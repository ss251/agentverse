// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Agent.sol";
import "./interfaces/IOracle.sol";

contract AgentManager is ERC721URIStorage {
    uint256 private _nextTokenId;
    address private owner;
    address public oracleAddress;
    string public prompt;

    struct AgentConfig {
        IOracle.OpenAiRequest openAiConfig;
        IOracle.GroqRequest groqConfig;
        bool useOpenAi;
        string knowledgeBase;
    }

    mapping(uint => AgentConfig) public agentConfigs;

    event AgentDeployed(uint indexed tokenId, address indexed owner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    constructor(address initialOracleAddress, string memory initialPrompt) ERC721("AgentNFT", "AGNT") {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        prompt = initialPrompt;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
    }

    function setPrompt(string memory newPrompt) public onlyOwner {
        prompt = newPrompt;
    }

    function deployAgent(IOracle.OpenAiRequest memory openAiConfig, IOracle.GroqRequest memory groqConfig, bool useOpenAi, string memory tokenURI, string memory knowledgeBase) public returns (uint) {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        AgentConfig storage config = agentConfigs[tokenId];
        config.openAiConfig = openAiConfig;
        config.groqConfig = groqConfig;
        config.useOpenAi = useOpenAi;
        config.knowledgeBase = knowledgeBase;

        emit AgentDeployed(tokenId, msg.sender);

        return tokenId;
    }

    function runAgent(uint tokenId, string memory query, uint8 maxIterations) public {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner of the agent");
        Agent agent = new Agent(oracleAddress, prompt);
        AgentConfig storage config = agentConfigs[tokenId];

        if (config.useOpenAi) {
            agent.runAgent(query, maxIterations, config.openAiConfig, IOracle.GroqRequest({
                model: "",
                frequencyPenalty: 0,
                logitBias: "",
                maxTokens: 0,
                presencePenalty: 0,
                responseFormat: "",
                seed: 0,
                stop: "",
                temperature: 0,
                topP: 0,
                user: ""
            }), config.knowledgeBase);
        } else {
            agent.runAgent(query, maxIterations, IOracle.OpenAiRequest({
                model: "",
                frequencyPenalty: 0,
                logitBias: "",
                maxTokens: 0,
                presencePenalty: 0,
                responseFormat: "",
                seed: 0,
                stop: "",
                temperature: 0,
                topP: 0,
                tools: "",
                toolChoice: "",
                user: ""
            }), config.groqConfig, config.knowledgeBase);
        }
    }
}
