"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "./v0/ui/card";
import { Label } from "./v0/ui/label";
import { Input } from "./v0/ui/input";
import { Textarea } from "./v0/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./v0/ui/select";
import { Button } from "./v0/ui/button";
import { Slider } from "./v0/ui/slider";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./v0/ui/dropdown-menu";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { AgentManagerABI } from "@/abi/AgentManager.sol/AgentManager";

const defaultValues = {
  modelType: "openai",
  openaiModel: "gpt-4-turbo-preview",
  groqModel: "",
  frequencyPenalty: 0,
  logitBias: "",
  maxTokens: 1000,
  maxIterations: 10,
  presencePenalty: 0,
  responseFormat: "{\"type\":\"text\"}",
  seed: 0,
  stop: "",
  temperature: 0.7,
  topP: 1,
  tools: "",
  toolChoice: "none",
  user: "",
  tokenURI: "",
  knowledgeBase: "",
  prompt: "Hello world!",
};

export default function Component() {
  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  const [stage, setStage] = useState("basic");
  const [modelType, setModelType] = useState(defaultValues.modelType);
  const [openaiModel, setOpenaiModel] = useState(defaultValues.openaiModel);
  const [groqModel, setGroqModel] = useState(defaultValues.groqModel);
  const [frequencyPenalty, setFrequencyPenalty] = useState(
    defaultValues.frequencyPenalty
  );
  const [logitBias, setLogitBias] = useState(defaultValues.logitBias);
  const [maxTokens, setMaxTokens] = useState(defaultValues.maxTokens);
  const [maxIterations, setMaxIterations] = useState(
    defaultValues.maxIterations
  );
  const [prompt, setPrompt] = useState(defaultValues.prompt);
  const [presencePenalty, setPresencePenalty] = useState(
    defaultValues.presencePenalty
  );
  const [responseFormat, setResponseFormat] = useState(
    defaultValues.responseFormat
  );
  const [seed, setSeed] = useState(defaultValues.seed);
  const [stop, setStop] = useState(defaultValues.stop);
  const [temperature, setTemperature] = useState(defaultValues.temperature);
  const [topP, setTopP] = useState(defaultValues.topP);
  const [tools, setTools] = useState<string[]>([]);
  const [toolChoice, setToolChoice] = useState(defaultValues.toolChoice);
  const [user, setUser] = useState(defaultValues.user);
  const [tokenURI, setTokenURI] = useState(defaultValues.tokenURI);
  const [knowledgeBase, setKnowledgeBase] = useState(
    defaultValues.knowledgeBase
  );
  const [numberofDocuments, setNumberofDocuments] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);

  const toolOptions = [
    { value: "web_search", label: "Web Search" },
    { value: "image_generation", label: "Image Generation" },
    { value: "code_interpreter", label: "Code Interpreter" },
  ];

  const handleToolChange = (value: string) => {
    setTools((prevTools: string[]) => {
      if (prevTools.includes(value)) {
        return prevTools.filter((tool) => tool !== value);
      } else {
        return [...prevTools, value];
      }
    });
  };

  const uploadToPinata = async (metadata: {
    name: string;
    description: string;
    attributes: (
      | { trait_type: string; value: string }
      | { trait_type: string; value: number }
    )[];
    openaiConfig: {};
    groqConfig: {};
  }) => {
    console.log(metadata);
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      "file"
    );

    try {
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_JWT}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      return result.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      return null;
    }
  };

  const generateToolsJson = () => {
    const selectedTools = [];
    if (tools.includes("web_search")) {
      selectedTools.push({
        type: "function",
        function: {
          name: "web_search",
          description: "Search the internet",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query",
              },
            },
            required: ["query"],
          },
        },
      });
    }
    if (tools.includes("image_generation")) {
      selectedTools.push({
        type: "function",
        function: {
          name: "image_generation",
          description: "Generates an image using Dalle-2",
          parameters: {
            type: "object",
            properties: {
              prompt: {
                type: "string",
                description: "Dalle-2 prompt to generate an image",
              },
            },
            required: ["prompt"],
          },
        },
      });
    }
    if (tools.includes("code_interpreter")) {
      selectedTools.push({
        type: "function",
        function: {
          name: "code_interpreter",
          description: "Executes Python code",
          parameters: {
            type: "object",
            properties: {
              code: {
                type: "string",
                description: "Python code to execute",
              },
            },
            required: ["code"],
          },
        },
      });
    }
    return JSON.stringify(selectedTools).replace(/"/g, '\"');
  };

  const handleDeployAgent = async () => {
    if (!address || !walletProvider) {
      console.log("Not connected");
      return;
    }

    setIsDeploying(true);

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(
      process.env.NEXT_PUBLIC_AGENT_MANAGER_CONTRACT_ADDRESS || "",
      AgentManagerABI,
      signer
    );

    const openAiConfig = {
      model: openaiModel || defaultValues.openaiModel,
      frequencyPenalty: Math.round(frequencyPenalty * 10), // Convert to int8 range
      logitBias: logitBias || defaultValues.logitBias,
      maxTokens: Math.round(maxTokens) || defaultValues.maxTokens,
      presencePenalty: Math.round(presencePenalty * 10), // Convert to int8 range
      responseFormat: responseFormat || defaultValues.responseFormat,
      seed: Math.max(0, Math.round(seed)) || defaultValues.seed,
      stop: stop || defaultValues.stop,
      temperature: Math.round((temperature || defaultValues.temperature) * 10), // Convert to uint range
      topP: Math.round((topP || defaultValues.topP) * 100), // Convert to uint range
      tools: "",
      toolChoice: toolChoice || defaultValues.toolChoice,
      user: user || defaultValues.user,
    };

    const groqConfig = {
      model: groqModel || defaultValues.groqModel,
      frequencyPenalty: Math.round(frequencyPenalty * 10), // Convert to int8 range
      logitBias: logitBias || defaultValues.logitBias,
      maxTokens: Math.round(maxTokens) || defaultValues.maxTokens,
      presencePenalty: Math.round(presencePenalty * 10), // Convert to int8 range
      responseFormat: responseFormat || defaultValues.responseFormat,
      seed: Math.max(0, Math.round(seed)) || defaultValues.seed,
      stop: stop || defaultValues.stop,
      temperature: Math.round((temperature || defaultValues.temperature) * 10), // Convert to uint range
      topP: Math.round((topP || defaultValues.topP) * 100), // Convert to uint range
      user: user || defaultValues.user,
    };

    const useOpenAi = modelType === "openai";

    const metadata = {
      name: "Agent",
      description: "AI Agent",
      attributes: [
        { trait_type: "Model Type", value: modelType },
        {
          trait_type: "Model",
          value: modelType === "openai" ? openaiModel : groqModel,
        },
        { trait_type: "Frequency Penalty", value: frequencyPenalty },
        { trait_type: "Logit Bias", value: logitBias },
        { trait_type: "Max Tokens", value: maxTokens },
        { trait_type: "Presence Penalty", value: presencePenalty },
        { trait_type: "Response Format", value: responseFormat },
        { trait_type: "Seed", value: seed },
        { trait_type: "Stop", value: stop },
        { trait_type: "Temperature", value: temperature },
        { trait_type: "Top P", value: topP },
        { trait_type: "Tools", value: tools.join(", ") },
        { trait_type: "Tool Choice", value: toolChoice },
        { trait_type: "User", value: user },
        { trait_type: "Knowledge Base", value: knowledgeBase },
      ],
      openaiConfig: useOpenAi ? openAiConfig : {},
      groqConfig: !useOpenAi ? groqConfig : {},
    };

    try {
      const cid = await uploadToPinata(metadata);
      const tokenURI = `ipfs://${cid}`;

      const toolsJson = generateToolsJson();
      openAiConfig.tools = toolsJson
      if (toolsJson === "") {
        openAiConfig.toolChoice = "none";
      } else {
        openAiConfig.toolChoice = "auto";
      }

      const tx = await contract.deployAgent(
        openAiConfig,
        groqConfig,
        useOpenAi,
        tokenURI || defaultValues.tokenURI,
        knowledgeBase || defaultValues.knowledgeBase,
        toolsJson,
        maxIterations,
        numberofDocuments || 0
      );

      await tx.wait();
      console.log("Agent deployed successfully!");
    } catch (error) {
      console.error("Error deploying agent:", error);
    } finally {
      setIsDeploying(false);
    }
  };

  const renderStage = () => {
    switch (stage) {
      case "basic":
        return (
          <section className="mx-auto space-y-6 mt-6">
            <div className="grid gap-4">
              <Label htmlFor="agent-name">Agent Name</Label>
              <Input id="agent-name" placeholder="Enter agent name" />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="agent-description">Agent Description</Label>
              <Textarea
                id="agent-description"
                placeholder="Describe your agent"
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="model-selection">Model Selection</Label>
              <Select
                value={modelType}
                onValueChange={(value) => setModelType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardFooter className="flex justify-between">
              <Button className="mr-auto" onClick={() => setStage("advanced")}>
                Next
              </Button>
            </CardFooter>
          </section>
        );
      case "advanced":
        return (
          <>
            <div className="space-y-4 mt-6">
              <div className="grid gap-4">
                <Label htmlFor="max-iterations">Max Iterations</Label>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  min={0}
                  onValueChange={(value) => setMaxIterations(value[0])}
                />
                <div>Value: {maxIterations}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="initial-prompt">Initial Prompt</Label>
                <Textarea
                  id="initial-prompt"
                  placeholder="Enter initial prompt"
                  className="min-h-[100px]"
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="knowledge-base-url">Knowledge Base URL</Label>
                <Input
                  id="knowledge-base-url"
                  placeholder="Enter knowledge base URL"
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                />
              </div>
              {knowledgeBase && (
                <div className="grid gap-4">
                  <Label htmlFor="knowledge-base-url">Number of Document</Label>
                  <Input
                    id="knowledge-base-url"
                    placeholder="Enter knowledge base URL"
                    onChange={(e) =>
                      setNumberofDocuments(Number(e.target.value))
                    }
                  />
                </div>
              )}
            </div>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setStage("basic")}>Back</Button>
              <Button
                onClick={() => setStage("model-specific")}
                className="ml-auto"
              >
                Next
              </Button>
            </CardFooter>
          </>
        );
      case "model-specific":
        return modelType === "openai" ? (
          <>
            <div className="space-y-4 mt-6">
              <div className="grid gap-4">
                <Label htmlFor="openai-model">OpenAI Model</Label>
                <Select
                  value={openaiModel}
                  onValueChange={(value) => setOpenaiModel(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select OpenAI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                    <SelectItem value="gpt-4-turbo-preview">
                      gpt-4-turbo-preview
                    </SelectItem>
                    <SelectItem value="gpt-3.5-turbo-1106">
                      gpt-3.5-turbo-1106
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-frequency-penalty">
                  Frequency Penalty
                </Label>
                <Slider
                  defaultValue={[0]}
                  max={20}
                  step={1}
                  min={-20}
                  onValueChange={(value) => setFrequencyPenalty(value[0])}
                />
                <div>Value: {frequencyPenalty}</div>
              </div>
              {/* <div className="grid gap-4">
                <Label htmlFor="openai-logit-bias">Logit Bias</Label>
                <Input
                  id="openai-logit-bias"
                  placeholder="Enter logit bias"
                  value={logitBias}
                  onChange={(e) => setLogitBias(e.target.value)}
                />
              </div> */}
              <div className="grid gap-4">
                <Label htmlFor="openai-max-tokens">Max Tokens</Label>
                <Slider
                  defaultValue={[0]}
                  max={1000}
                  step={1}
                  min={0}
                  onValueChange={(value) => setMaxTokens(value[0])}
                />
                <div>Value: {maxTokens}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-presence-penalty">
                  Presence Penalty
                </Label>
                <Slider
                  defaultValue={[0]}
                  max={20}
                  step={1}
                  min={-20}
                  onValueChange={(value) => setPresencePenalty(value[0])}
                />
                <div>Value: {presencePenalty}</div>
              </div>
              {/* <div className="grid gap-4">
                <Label htmlFor="openai-response-format">Response Format</Label>
                <Input
                  id="openai-response-format"
                  placeholder="Enter response format"
                  value={responseFormat}
                  onChange={(e) => setResponseFormat(e.target.value)}
                />
              </div> */}
              <div className="grid gap-4">
                <Label htmlFor="openai-seed">Seed</Label>
                <Input
                  id="openai-seed"
                  type="number"
                  placeholder="Enter seed"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                />
              </div>
              {/* <div className="grid gap-4">
                <Label htmlFor="openai-stop">Stop</Label>
                <Input
                  id="openai-stop"
                  placeholder="Enter stop sequence"
                  value={stop}
                  onChange={(e) => setStop(e.target.value)}
                />
              </div> */}
              <div className="grid gap-4">
                <Label htmlFor="openai-temperature">Temperature</Label>
                <Slider
                  defaultValue={[0]}
                  max={20}
                  step={1}
                  min={0}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <div>Value: {temperature}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-top-p">Top P</Label>
                <Slider
                  defaultValue={[0]}
                  max={100}
                  step={1}
                  min={0}
                  onValueChange={(value) => setTopP(value[0])}
                />
                <div>Value: {topP}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-tools">Tools</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Select Tools</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Tools</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {toolOptions.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={tools.includes(option.value)}
                        onCheckedChange={() => handleToolChange(option.value)}
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div>Selected Tools: {tools.join(", ")}</div>
              </div>
              {/* <div className="grid gap-4">
                <Label htmlFor="openai-tool-choice">Tool Choice</Label>
                <Input id="openai-tool-choice" placeholder="Enter tool choice" value={toolChoice} onChange={(e) => setToolChoice(e.target.value)} />
              </div> */}
              <div className="grid gap-4">
                <Label htmlFor="openai-user">User</Label>
                <Input
                  id="openai-user"
                  placeholder="Enter user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
            </div>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setStage("advanced")}>Back</Button>
              <Button onClick={() => setStage("launch")} className="ml-auto">
                Launch Agent
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 mt-6">
              <div className="grid gap-4">
                <Label htmlFor="groq-model">Groq Model</Label>
                <Select
                  value={groqModel}
                  onValueChange={(value) => setGroqModel(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Groq model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama3-8b-8192">
                      llama3-8b-8192
                    </SelectItem>
                    <SelectItem value="llama3-70b-8192">
                      llama3-70b-8192
                    </SelectItem>
                    <SelectItem value="mixtral-8x7b-32768">
                      mixtral-8x7b-32768
                    </SelectItem>
                    <SelectItem value="gemma-7b-it">gemma-7b-it</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-frequency-penalty">
                  Frequency Penalty
                </Label>
                <Slider
                  defaultValue={[0]}
                  max={20}
                  step={1}
                  min={-20}
                  onValueChange={(value) => setFrequencyPenalty(value[0])}
                />
                <div>Value: {frequencyPenalty}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-logit-bias">Logit Bias</Label>
                <Input
                  id="groq-logit-bias"
                  placeholder="Enter logit bias"
                  value={logitBias}
                  onChange={(e) => setLogitBias(e.target.value)}
                />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-max-tokens">Max Tokens</Label>
                <Slider
                  defaultValue={[0]}
                  max={1000}
                  step={1}
                  min={0}
                  onValueChange={(value) => setMaxTokens(value[0])}
                />
                <div>Value: {maxTokens}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-presence-penalty">Presence Penalty</Label>
                <Slider
                  defaultValue={[0]}
                  max={20}
                  step={1}
                  min={-20}
                  onValueChange={(value) => setPresencePenalty(value[0])}
                />
                <div>Value: {presencePenalty}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-response-format">Response Format</Label>
                <Input
                  id="groq-response-format"
                  placeholder="Enter response format"
                  value={responseFormat}
                  onChange={(e) => setResponseFormat(e.target.value)}
                />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-seed">Seed</Label>
                <Input
                  id="groq-seed"
                  type="number"
                  placeholder="Enter seed"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-stop">Stop</Label>
                <Input
                  id="groq-stop"
                  placeholder="Enter stop sequence"
                  value={stop}
                  onChange={(e) => setStop(e.target.value)}
                />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-temperature">Temperature</Label>
                <Slider
                  defaultValue={[0]}
                  max={20}
                  step={1}
                  min={0}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <div>Value: {temperature}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-top-p">Top P</Label>
                <Slider
                  defaultValue={[0]}
                  max={100}
                  step={1}
                  min={0}
                  onValueChange={(value) => setTopP(value[0])}
                />
                <div>Value: {topP}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-user">User</Label>
                <Input
                  id="groq-user"
                  placeholder="Enter user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
            </div>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setStage("advanced")}>Back</Button>
              <Button onClick={() => setStage("launch")} className="ml-auto">
                Launch Agent
              </Button>
            </CardFooter>
          </>
        );
      case "launch":
        const toolsJson = generateToolsJson();
        console.log("Tools JSON:", toolsJson);
        // Here you would send the toolsJson to your Solidity function
        return (
          <div className="space-y-4 mt-6">
            <p>Your agent is launching...</p>
            <CardFooter className="flex justify-between">
              <Button onClick={handleDeployAgent}>Deploy Agent</Button>
              <Button onClick={() => setStage("basic")}>Start Over</Button>
            </CardFooter>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="mt-8 mb-24">
      <div className="container max-w-2xl px-4 md:px-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Create Your Own AI Agent
            </h2>
            <p className="text-muted-foreground md:text-xl">
              Build and launch your custom AI assistant in minutes.
            </p>
          </div>
          <Card>
            <CardContent className="space-y-4">{renderStage()}</CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
