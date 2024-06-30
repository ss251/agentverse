"use client";

import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
import { AgentABI } from "@/abi/Agent.sol/Agent"; // Update the import path to the correct ABI
import { Button } from "./v0/ui/button";
import { Input } from "./v0/ui/input";
import { Card, CardContent } from "./v0/ui/card";

const ChatInterface = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();
  const [messages, setMessages] = useState();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRunId, setCurrentRunId] = useState(null);
  const [runFinished, setRunFinished] = useState(false);
  const [error, setError] = useState(null);

  const fetchNewMessages = async (contract, runId, currentMessagesCount) => {
    try {
      const allMessageContents = await contract.getMessageHistoryContents(runId);
      const allMessageRoles = await contract.getMessageHistoryRoles(runId);

      const newMessages = allMessageContents.slice(currentMessagesCount).map((content, index) => ({
        role: allMessageRoles[currentMessagesCount + index],
        content,
      })).filter(message => message.role === "user" || message.role === "assistant");

      return newMessages;
    } catch (error) {
      console.error("Error fetching new messages:", error);
      setError("Failed to fetch new messages. Please try again.");
      return ;
    }
  };

  const getAgentRunId = (receipt, contract) => {
    let agentRunID;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog && parsedLog.name === "AgentRunCreated") {
          agentRunID = ethers.toNumber(parsedLog.args[1]);
        }
      } catch (error) {
        console.log("Could not parse log:", log);
      }
    }
    return agentRunID;
  };

  const sendMessage = async () => {
    setLoading(true);
    setError(null);
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(
      process.env.NEXT_PUBLIC_AGENT_CONTRACT ?? "",
      AgentABI,
      signer
    );

    try {
      if (currentRunId === null) {
        console.log("Creating new agent run with message:", input);
        const tx = await contract.runAgent(input, 5);
        const receipt = await tx.wait();
        const runId = getAgentRunId(receipt, contract);
        if (runId !== undefined) {
          setCurrentRunId(runId);
          const newMessages = await fetchNewMessages(contract, runId, 0);
          setMessages(newMessages);
          startMessageLoop(contract, runId, newMessages.length);
        } else {
          throw new Error("Couldn't find AgentRunCreated event in transaction logs");
        }
      } else {
        console.log("Adding message to existing agent run:", input);
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        const tx = await contract.onOracleFunctionResponse(currentRunId, input, "");
        await tx.wait();
        startMessageLoop(contract, currentRunId, newMessages.length);
      }
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startMessageLoop = async (contract, runId, currentMessagesCount) => {
    try {
      while (true) {
        const newMessages = await fetchNewMessages(contract, runId, currentMessagesCount);
        if (newMessages.length > 0) {
          setMessages((prevMessages) => [...prevMessages, ...newMessages]);
          currentMessagesCount += newMessages.length;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const isFinished = await contract.isRunFinished(runId);
        if (isFinished) {
          console.log(`Agent run ID ${runId} finished!`);
          setRunFinished(true);
          break;
        }
      }
    } catch (error) {
      console.error("Error in message loop:", error);
      setError("An error occurred while fetching messages. Please try again.");
    }
  };

  return (
    <Card className="flex flex-col h-80vh max-w-lg mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <CardContent className="flex-1 overflow-y-auto p-4">
        {messages?.map((message, index) => (
          <div key={index} className={`mb-3 ${message.role}`}>
            <p
              className={`text-${
                message.role === "user"
                  ? "blue-500"
                  : message.role === "assistant"
                  ? "green-500"
                  : "gray-500"
              }`}
            >
              {message.content}
            </p>
          </div>
        ))}
        {error && <p className="text-red-500">{error}</p>}
      </CardContent>
      <div className="flex p-2 border-t border-gray-300">
        <Input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading || runFinished}
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input || runFinished}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </Card>
  );
};

export default ChatInterface;