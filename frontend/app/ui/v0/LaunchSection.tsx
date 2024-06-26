"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "../v0/ui/card";
import { Label } from "../v0/ui/label";
import { Input } from "../v0/ui/input";
import { Textarea } from "../v0/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../v0/ui/select";
import { Button } from "../v0/ui/button";
import { Slider } from "./ui/slider";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Component() {
  const [stage, setStage] = useState("basic");
  const [modelType, setModelType] = useState("openai");
  const [openaiModel, setOpenaiModel] = useState("gpt-4-turbo");
  const [groqModel, setGroqModel] = useState("llama3-8b-8192");
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [logitBias, setLogitBias] = useState("");
  const [maxTokens, setMaxTokens] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [responseFormat, setResponseFormat] = useState("");
  const [seed, setSeed] = useState(0);
  const [stop, setStop] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [topP, setTopP] = useState(0);
  const [tools, setTools] = useState<string[]>([]);
  const [toolChoice, setToolChoice] = useState("");
  const [user, setUser] = useState("");

  const toolOptions = [
    { value: 'web_search', label: 'Web Search' },
    { value: 'image_generation', label: 'Image Generation' },
    { value: 'code_interpreter', label: 'Code Interpreter' },
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
    return JSON.stringify(selectedTools).replace(/"/g, '\\"');
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
              <Textarea id="agent-description" placeholder="Describe your agent" className="min-h-[100px]" />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="model-selection">Model Selection</Label>
              <Select value={modelType} onValueChange={(value) => setModelType(value)}>
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
                <Slider defaultValue={[50]} max={100} step={1} min={0} onValueChange={(value) => setMaxTokens(value[0])} />
                <div>Value: {maxTokens}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="initial-prompt">Initial Prompt</Label>
                <Textarea id="initial-prompt" placeholder="Enter initial prompt" className="min-h-[100px]" />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="knowledge-base-url">Knowledge Base URL</Label>
                <Input id="knowledge-base-url" placeholder="Enter knowledge base URL" />
              </div>
            </div>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setStage("basic")}>Back</Button>
              <Button onClick={() => setStage("model-specific")} className="ml-auto">
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
                <Select value={openaiModel} onValueChange={(value) => setOpenaiModel(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OpenAI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                    <SelectItem value="gpt-4-turbo-preview">gpt-4-turbo-preview</SelectItem>
                    <SelectItem value="gpt-3.5-turbo-1106">gpt-3.5-turbo-1106</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-frequency-penalty">Frequency Penalty</Label>
                <Slider defaultValue={[0]} max={20} step={1} min={-20} onValueChange={(value) => setFrequencyPenalty(value[0])} />
                <div>Value: {frequencyPenalty}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-logit-bias">Logit Bias</Label>
                <Input id="openai-logit-bias" placeholder="Enter logit bias" value={logitBias} onChange={(e) => setLogitBias(e.target.value)} />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-max-tokens">Max Tokens</Label>
                <Slider defaultValue={[0]} max={100} step={1} min={0} onValueChange={(value) => setMaxTokens(value[0])} />
                <div>Value: {maxTokens}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-presence-penalty">Presence Penalty</Label>
                <Slider defaultValue={[0]} max={20} step={1} min={-20} onValueChange={(value) => setPresencePenalty(value[0])} />
                <div>Value: {presencePenalty}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-response-format">Response Format</Label>
                <Input id="openai-response-format" placeholder="Enter response format" value={responseFormat} onChange={(e) => setResponseFormat(e.target.value)} />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-seed">Seed</Label>
                <Input id="openai-seed" type="number" placeholder="Enter seed" value={seed} onChange={(e) => setSeed(Number(e.target.value))} />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-stop">Stop</Label>
                <Input id="openai-stop" placeholder="Enter stop sequence" value={stop} onChange={(e) => setStop(e.target.value)} />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-temperature">Temperature</Label>
                <Slider defaultValue={[0]} max={20} step={1} min={0} onValueChange={(value) => setTemperature(value[0])} />
                <div>Value: {temperature}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="openai-top-p">Top P</Label>
                <Slider defaultValue={[0]} max={100} step={1} min={0} onValueChange={(value) => setTopP(value[0])} />
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
                <Input id="openai-user" placeholder="Enter user" value={user} onChange={(e) => setUser(e.target.value)} />
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
                <Select value={groqModel} onValueChange={(value) => setGroqModel(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Groq model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama3-8b-8192">llama3-8b-8192</SelectItem>
                    <SelectItem value="llama3-70b-8192">llama3-70b-8192</SelectItem>
                    <SelectItem value="mixtral-8x7b-32768">mixtral-8x7b-32768</SelectItem>
                    <SelectItem value="gemma-7b-it">gemma-7b-it</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-frequency-penalty">Frequency Penalty</Label>
                <Slider defaultValue={[0]} max={20} step={1} min={-20} onValueChange={(value) => setFrequencyPenalty(value[0])} />
                <div>Value: {frequencyPenalty}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-logit-bias">Logit Bias</Label>
                <Input id="groq-logit-bias" placeholder="Enter logit bias" value={logitBias} onChange={(e) => setLogitBias(e.target.value)} />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-max-tokens">Max Tokens</Label>
                <Slider defaultValue={[0]} max={100} step={1} min={0} onValueChange={(value) => setMaxTokens(value[0])} />
                <div>Value: {maxTokens}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-presence-penalty">Presence Penalty</Label>
                <Slider defaultValue={[0]} max={20} step={1} min={-20} onValueChange={(value) => setPresencePenalty(value[0])} />
                <div>Value: {presencePenalty}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-response-format">Response Format</Label>
                <Input id="groq-response-format" placeholder="Enter response format" value={responseFormat} onChange={(e) => setResponseFormat(e.target.value)} />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-seed">Seed</Label>
                <Input id="groq-seed" type="number" placeholder="Enter seed" value={seed} onChange={(e) => setSeed(Number(e.target.value))} />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-stop">Stop</Label>
                <Input id="groq-stop" placeholder="Enter stop sequence" value={stop} onChange={(e) => setStop(e.target.value)} />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-temperature">Temperature</Label>
                <Slider defaultValue={[0]} max={20} step={1} min={0} onValueChange={(value) => setTemperature(value[0])} />
                <div>Value: {temperature}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-top-p">Top P</Label>
                <Slider defaultValue={[0]} max={100} step={1} min={0} onValueChange={(value) => setTopP(value[0])} />
                <div>Value: {topP}</div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="groq-user">User</Label>
                <Input id="groq-user" placeholder="Enter user" value={user} onChange={(e) => setUser(e.target.value)} />
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
            <Button onClick={() => setStage("basic")}>Start Over</Button>
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
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Create Your Own AI Agent</h2>
            <p className="text-muted-foreground md:text-xl">Build and launch your custom AI assistant in minutes.</p>
          </div>
          <Card>
            <CardContent className="space-y-4">{renderStage()}</CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
