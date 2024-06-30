// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./interfaces/IOracle.sol";

contract AgentManager is ERC721URIStorage {
    uint256 private _nextTokenId;
    address private owner;
    address public oracleAddress;
    string public prompt;

    struct Message {
        string role;
        string content;
    }

    struct AgentRun {
        address owner;
        Message[] messages;
        uint responsesCount;
        uint8 max_iterations;
        bool is_finished;
        string knowledge_base;
    }

    struct AgentConfig {
        IOracle.OpenAiRequest openAiConfig;
        IOracle.GroqRequest groqConfig;
        bool useOpenAi;
        string knowledgeBase;
        uint8 maxIterations;
    }

    mapping(uint => AgentConfig) public agentConfigs;
    mapping(uint => AgentRun) public agentRuns;
    uint private agentRunCount;

    event AgentDeployed(uint indexed tokenId, address indexed owner);
    event AgentRunCreated(uint indexed tokenId, uint indexed runId);
    event OracleAddressUpdated(address indexed newOracleAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    constructor(
        address initialOracleAddress,
        string memory initialPrompt
    ) ERC721("AgentNFT", "AGNT") {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        prompt = initialPrompt;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        require(msg.sender == owner, "Caller is not the owner");
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function setPrompt(string memory newPrompt) public onlyOwner {
        prompt = newPrompt;
    }

    function validateOpenAiConfig(
        IOracle.OpenAiRequest memory config
    ) internal pure {
        require(bytes(config.model).length > 0, "Model must be specified");
        require(
            config.frequencyPenalty >= -20 && config.frequencyPenalty <= 20,
            "Invalid frequency penalty"
        );
        require(
            bytes(config.logitBias).length == 0 ||
                bytes(config.logitBias).length > 0,
            "Invalid logitBias"
        );
        require(
            config.maxTokens == 0 || config.maxTokens > 0,
            "Invalid maxTokens"
        );
        require(
            config.presencePenalty >= -20 && config.presencePenalty <= 20,
            "Invalid presence penalty"
        );
        require(
            bytes(config.responseFormat).length == 0 ||
                keccak256(abi.encodePacked(config.responseFormat)) ==
                keccak256(abi.encodePacked('{"type":"text"}')),
            "Invalid response format"
        );
        require(config.seed == 0 || config.seed > 0, "Invalid seed");
        require(
            bytes(config.stop).length == 0 || bytes(config.stop).length > 0,
            "Invalid stop sequence"
        );
        require(config.temperature <= 20, "Invalid temperature");
        require(config.topP <= 100, "Invalid topP value");
        require(
            bytes(config.toolChoice).length == 0 ||
                keccak256(abi.encodePacked(config.toolChoice)) ==
                keccak256(abi.encodePacked("none")) ||
                keccak256(abi.encodePacked(config.toolChoice)) ==
                keccak256(abi.encodePacked("auto")),
            "Invalid tool choice"
        );
        // Note: We can't thoroughly validate tools as it's a complex structure
        // But we can check if it's empty when it should be
        require(
            (bytes(config.tools).length == 0 &&
                (bytes(config.toolChoice).length == 0 ||
                    keccak256(abi.encodePacked(config.toolChoice)) ==
                    keccak256(abi.encodePacked("none")))) ||
                (bytes(config.tools).length > 0 &&
                    (bytes(config.toolChoice).length == 0 ||
                        keccak256(abi.encodePacked(config.toolChoice)) ==
                        keccak256(abi.encodePacked("auto")))),
            "Tools and toolChoice must be consistent"
        );
    }

    function validateGroqConfig(
        IOracle.GroqRequest memory config
    ) internal pure {
        require(bytes(config.model).length > 0, "Model must be specified");
        require(
            keccak256(abi.encodePacked(config.model)) ==
                keccak256(abi.encodePacked("llama3-8b-8192")) ||
                keccak256(abi.encodePacked(config.model)) ==
                keccak256(abi.encodePacked("llama3-70b-8192")) ||
                keccak256(abi.encodePacked(config.model)) ==
                keccak256(abi.encodePacked("mixtral-8x7b-32768")) ||
                keccak256(abi.encodePacked(config.model)) ==
                keccak256(abi.encodePacked("gemma-7b-it")),
            "Invalid model specified"
        );
        require(
            config.frequencyPenalty >= -20 && config.frequencyPenalty <= 20,
            "Invalid frequency penalty"
        );
        require(
            bytes(config.logitBias).length == 0 ||
                bytes(config.logitBias).length > 0,
            "Invalid logitBias"
        );
        require(
            config.maxTokens == 0 || config.maxTokens > 0,
            "Invalid maxTokens"
        );
        require(
            config.presencePenalty >= -20 && config.presencePenalty <= 20,
            "Invalid presence penalty"
        );
        require(
            bytes(config.responseFormat).length == 0 ||
                keccak256(abi.encodePacked(config.responseFormat)) ==
                keccak256(abi.encodePacked('{"type":"text"}')),
            "Invalid response format"
        );
        require(config.seed == 0 || config.seed > 0, "Invalid seed");
        require(
            bytes(config.stop).length == 0 || bytes(config.stop).length > 0,
            "Invalid stop sequence"
        );
        require(config.temperature <= 20, "Invalid temperature");
        require(config.topP <= 100, "Invalid topP value");
        require(
            bytes(config.user).length == 0 || bytes(config.user).length > 0,
            "Invalid user identifier"
        );
    }

    function deployAgent(
        IOracle.OpenAiRequest memory openAiConfig,
        IOracle.GroqRequest memory groqConfig,
        bool useOpenAi,
        string memory tokenURI,
        string memory knowledgeBase,
        string memory tools,
        uint8 maxIterations
    ) public returns (uint) {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        AgentConfig storage config = agentConfigs[tokenId];

        if (useOpenAi) {
            validateOpenAiConfig(openAiConfig);
            openAiConfig.tools = tools;
            openAiConfig.toolChoice = bytes(tools).length > 0 ? "auto" : "none";
        } else {
            validateGroqConfig(groqConfig);
        }

        config.openAiConfig = openAiConfig;
        config.groqConfig = groqConfig;
        config.useOpenAi = useOpenAi;
        config.knowledgeBase = knowledgeBase;
        config.maxIterations = maxIterations;

        emit AgentDeployed(tokenId, msg.sender);

        return tokenId;
    }

    function runAgent(uint tokenId, string memory query) public {
        require(
            ownerOf(tokenId) == msg.sender,
            "Caller is not the owner of the agent"
        );

        AgentConfig storage config = agentConfigs[tokenId];
        AgentRun storage run = agentRuns[agentRunCount];
        run.owner = msg.sender;
        run.is_finished = false;
        run.responsesCount = 0;
        run.max_iterations = config.maxIterations;
        run.knowledge_base = config.knowledgeBase;

        Message memory systemMessage = Message("system", prompt);
        run.messages.push(systemMessage);

        Message memory userMessage = Message("user", query);
        run.messages.push(userMessage);

        uint currentId = agentRunCount;
        agentRunCount++;

        if (bytes(config.knowledgeBase).length > 0) {
            IOracle(oracleAddress).createKnowledgeBaseQuery(
                currentId,
                config.knowledgeBase,
                query,
                3
            );
        } else if (config.useOpenAi) {
            IOracle(oracleAddress).createOpenAiLlmCall(
                currentId,
                config.openAiConfig
            );
        } else {
            IOracle(oracleAddress).createGroqLlmCall(
                currentId,
                config.groqConfig
            );
        }
        emit AgentRunCreated(tokenId, currentId);
    }

    function onOracleOpenAiLlmResponse(
        uint runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];

        if (bytes(errorMessage).length > 0) {
            Message memory newMessage = Message("assistant", errorMessage);
            run.messages.push(newMessage);
            run.responsesCount++;
            run.is_finished = true;
            return;
        }
        if (run.responsesCount >= run.max_iterations) {
            run.is_finished = true;
            return;
        }
        if (bytes(response.content).length > 0) {
            Message memory assistantMessage = Message(
                "assistant",
                response.content
            );
            run.messages.push(assistantMessage);
            run.responsesCount++;
        }
        if (bytes(response.functionName).length > 0) {
            IOracle(oracleAddress).createFunctionCall(
                runId,
                response.functionName,
                response.functionArguments
            );
            return;
        }
    }

    function onOracleGroqLlmResponse(
        uint runId,
        IOracle.GroqResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];

        if (bytes(errorMessage).length > 0) {
            Message memory newMessage = Message("assistant", errorMessage);
            run.messages.push(newMessage);
            run.responsesCount++;
            run.is_finished = true;
            return;
        }
        if (run.responsesCount >= run.max_iterations) {
            run.is_finished = true;
            return;
        }
        if (bytes(response.content).length > 0) {
            Message memory assistantMessage = Message(
                "assistant",
                response.content
            );
            run.messages.push(assistantMessage);
            run.responsesCount++;
        }
        if (run.responsesCount < run.max_iterations) {
            IOracle(oracleAddress).createGroqLlmCall(
                runId,
                agentConfigs[runId].groqConfig
            );
        } else {
            run.is_finished = true;
        }
    }

    function onOracleFunctionResponse(
        uint runId,
        string memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];
        require(!run.is_finished, "Run is finished");

        string memory result = bytes(errorMessage).length > 0
            ? errorMessage
            : response;

        Message memory newMessage = Message("user", result);
        run.messages.push(newMessage);
        run.responsesCount++;
        IOracle(oracleAddress).createOpenAiLlmCall(
            runId,
            agentConfigs[runId].openAiConfig
        );
    }

    function onOracleKnowledgeBaseQueryResponse(
        uint runId,
        string[] memory documents,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];
        uint256 lastIndex = run.messages.length - 1;

        require(
            run.messages.length > 0 &&
                keccak256(abi.encodePacked(run.messages[lastIndex].role)) ==
                keccak256(abi.encodePacked("user")),
            "No message to add context to"
        );

        if (bytes(errorMessage).length > 0) {
            Message memory errorMessageStruct = Message(
                "assistant",
                errorMessage
            );
            run.messages.push(errorMessageStruct);
            run.responsesCount++;
            run.is_finished = true;
            return;
        }

        Message storage lastMessage = run.messages[lastIndex];
        string memory newContent = lastMessage.content;

        if (documents.length > 0) {
            newContent = string(
                abi.encodePacked(newContent, "\n\nRelevant context:\n")
            );
            for (uint i = 0; i < documents.length; i++) {
                newContent = string(
                    abi.encodePacked(newContent, documents[i], "\n")
                );
            }
        }

        lastMessage.content = newContent;
        IOracle(oracleAddress).createOpenAiLlmCall(
            runId,
            agentConfigs[runId].openAiConfig
        );
    }

    function getMessageHistoryContents(
        uint agentId
    ) public view returns (string[] memory) {
        string[] memory messages = new string[](
            agentRuns[agentId].messages.length
        );
        for (uint i = 0; i < agentRuns[agentId].messages.length; i++) {
            messages[i] = agentRuns[agentId].messages[i].content;
        }
        return messages;
    }

    function getMessageHistoryRoles(
        uint agentId
    ) public view returns (string[] memory) {
        string[] memory roles = new string[](
            agentRuns[agentId].messages.length
        );
        for (uint i = 0; i < agentRuns[agentId].messages.length; i++) {
            roles[i] = agentRuns[agentId].messages[i].role;
        }
        return roles;
    }

    function isRunFinished(uint runId) public view returns (bool) {
        return agentRuns[runId].is_finished;
    }

    function compareStrings(
        string memory a,
        string memory b
    ) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
