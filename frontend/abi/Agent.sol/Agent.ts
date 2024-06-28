export const AgentABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOracleAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "systemPrompt",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "runId",
        type: "uint256",
      },
    ],
    name: "AgentRunCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newOracleAddress",
        type: "address",
      },
    ],
    name: "OracleAddressUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "agentRuns",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "responsesCount",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "max_iterations",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "is_finished",
        type: "bool",
      },
      {
        internalType: "string",
        name: "knowledge_base",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "agentId",
        type: "uint256",
      },
    ],
    name: "getMessageHistoryContents",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "agentId",
        type: "uint256",
      },
    ],
    name: "getMessageHistoryRoles",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "runId",
        type: "uint256",
      },
    ],
    name: "isRunFinished",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "runId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "response",
        type: "string",
      },
      {
        internalType: "string",
        name: "errorMessage",
        type: "string",
      },
    ],
    name: "onOracleFunctionResponse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "runId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "uint64",
            name: "created",
            type: "uint64",
          },
          {
            internalType: "string",
            name: "model",
            type: "string",
          },
          {
            internalType: "string",
            name: "systemFingerprint",
            type: "string",
          },
          {
            internalType: "string",
            name: "object",
            type: "string",
          },
          {
            internalType: "uint32",
            name: "completionTokens",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "promptTokens",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "totalTokens",
            type: "uint32",
          },
        ],
        internalType: "struct IOracle.GroqResponse",
        name: "response",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "errorMessage",
        type: "string",
      },
    ],
    name: "onOracleGroqLlmResponse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "runId",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "documents",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "errorMessage",
        type: "string",
      },
    ],
    name: "onOracleKnowledgeBaseQueryResponse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "runId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "string",
            name: "functionName",
            type: "string",
          },
          {
            internalType: "string",
            name: "functionArguments",
            type: "string",
          },
          {
            internalType: "uint64",
            name: "created",
            type: "uint64",
          },
          {
            internalType: "string",
            name: "model",
            type: "string",
          },
          {
            internalType: "string",
            name: "systemFingerprint",
            type: "string",
          },
          {
            internalType: "string",
            name: "object",
            type: "string",
          },
          {
            internalType: "uint32",
            name: "completionTokens",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "promptTokens",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "totalTokens",
            type: "uint32",
          },
        ],
        internalType: "struct IOracle.OpenAiResponse",
        name: "response",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "errorMessage",
        type: "string",
      },
    ],
    name: "onOracleOpenAiLlmResponse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "oracleAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "prompt",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "query",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "maxIterations",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "string",
            name: "model",
            type: "string",
          },
          {
            internalType: "int8",
            name: "frequencyPenalty",
            type: "int8",
          },
          {
            internalType: "string",
            name: "logitBias",
            type: "string",
          },
          {
            internalType: "uint32",
            name: "maxTokens",
            type: "uint32",
          },
          {
            internalType: "int8",
            name: "presencePenalty",
            type: "int8",
          },
          {
            internalType: "string",
            name: "responseFormat",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "seed",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "stop",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "temperature",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "topP",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "tools",
            type: "string",
          },
          {
            internalType: "string",
            name: "toolChoice",
            type: "string",
          },
          {
            internalType: "string",
            name: "user",
            type: "string",
          },
        ],
        internalType: "struct IOracle.OpenAiRequest",
        name: "openAiConfig",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "model",
            type: "string",
          },
          {
            internalType: "int8",
            name: "frequencyPenalty",
            type: "int8",
          },
          {
            internalType: "string",
            name: "logitBias",
            type: "string",
          },
          {
            internalType: "uint32",
            name: "maxTokens",
            type: "uint32",
          },
          {
            internalType: "int8",
            name: "presencePenalty",
            type: "int8",
          },
          {
            internalType: "string",
            name: "responseFormat",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "seed",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "stop",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "temperature",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "topP",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "user",
            type: "string",
          },
        ],
        internalType: "struct IOracle.GroqRequest",
        name: "groqConfig",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "knowledge_base",
        type: "string",
      },
    ],
    name: "runAgent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOracleAddress",
        type: "address",
      },
    ],
    name: "setOracleAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
