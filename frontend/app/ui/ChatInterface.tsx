"use client"
import React, { useState, useEffect } from "react";
import { ethers, Contract, TransactionReceipt, BrowserProvider } from "ethers";
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { AgentManagerABI } from "@/abi/AgentManager.sol/AgentManager";
import { Card } from "./v0/ui/card";
import { CardContent } from "./v0/ui/card";
import { Input } from "./v0/ui/input";
import { Button } from "./v0/ui/button";


interface Message {
  role: string;
  content: string;
}

const ChatInterface: React.FC = () => {
  const { walletProvider } = useWeb3ModalProvider()
  const { address } = useWeb3ModalAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRunId, setCurrentRunId] = useState<number | null>(null);
  const [runFinished, setRunFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessageIndex, setLastMessageIndex] = useState(0);
  const tokenId = 4; // Hardcoded for now

  const fetchNewMessages = async (contract: Contract, runId: number, lastMessageIndex: number): Promise<void> => {
    setLoading(true);
    try {
      const allMessageContents = await contract.getMessageHistoryContents(runId);
      const allMessageRoles = await contract.getMessageHistoryRoles(runId);

      const newMessages = allMessageContents.slice(lastMessageIndex).map((content: string, index: number) => ({
        role: allMessageRoles[lastMessageIndex + index],
        content,
      })).filter((message: Message) => message.role === "user" || message.role === "assistant");

      setMessages((prev) => [...prev, ...newMessages]);
      setLastMessageIndex(lastMessageIndex + newMessages.length);
    } catch (error) {
      console.error("Error fetching new messages:", error);
      setError("Failed to fetch new messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAgentRunId = (receipt: TransactionReceipt, contract: Contract): number | undefined => {
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog && parsedLog.name === "AgentRunCreated") {
          console.log("Agent run ID found:", ethers.toNumber(parsedLog.args[1]));
          return ethers.toNumber(parsedLog.args[1]);
        }
      } catch (error) {
        console.log("Could not parse log:", log);
      }
    }
    return undefined;
  };

  const sendMessage = async () => {
    setLoading(true);
    setError(null);
    const ethersProvider = walletProvider ? new BrowserProvider(walletProvider) : undefined;
    const signer = await ethersProvider?.getSigner();
    const contract = new Contract(
      process.env.NEXT_PUBLIC_AGENT_MANAGER_CONTRACT_ADDRESS || "",
      AgentManagerABI,
      signer
    );

    try {
      if (currentRunId === null) {
        const tx = await contract.runAgent(tokenId, input); // Assuming max_iterations is 10
        const receipt = await tx.wait();
        const runId = getAgentRunId(receipt, contract);
        if (runId !== undefined) {
          setCurrentRunId(runId);
          await fetchNewMessages(contract, runId, 0);
        } else {
          throw new Error("Couldn't find AgentRunCreated event in transaction logs");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
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