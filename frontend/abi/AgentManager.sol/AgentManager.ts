export const AgentManagerABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOracleAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "initialPrompt",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "AgentDeployed",
    type: "event",
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
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
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
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
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
    name: "agentConfigs",
    outputs: [
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
        internalType: "bool",
        name: "useOpenAi",
        type: "bool",
      },
      {
        internalType: "string",
        name: "knowledgeBase",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
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
        internalType: "bool",
        name: "useOpenAi",
        type: "bool",
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
      {
        internalType: "string",
        name: "knowledgeBase",
        type: "string",
      },
      {
        internalType: "string",
        name: "tools",
        type: "string",
      },
    ],
    name: "deployAgent",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
    inputs: [],
    name: "name",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
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
    ],
    name: "runAgent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
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
  {
    inputs: [
      {
        internalType: "string",
        name: "newPrompt",
        type: "string",
      },
    ],
    name: "setPrompt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    inputs: [],
    name: "symbol",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
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
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
