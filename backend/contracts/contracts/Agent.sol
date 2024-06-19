// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./interfaces/IOracle.sol";

// @title Agent
// @notice This contract interacts with teeML oracle to run agents that perform multiple iterations of querying and responding using a large language model (LLM).
contract Agent {

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

    // @notice Mapping from run ID to AgentRun
    mapping(uint => AgentRun) public agentRuns;
    uint private agentRunCount;

    // @notice Event emitted when a new agent run is created
    event AgentRunCreated(address indexed owner, uint indexed runId);

    // @notice Address of the contract owner
    address private owner;

    // @notice Address of the oracle contract
    address public oracleAddress;

    // @notice Event emitted when the oracle address is updated
    event OracleAddressUpdated(address indexed newOracleAddress);

    // @notice Configuration for the OpenAI request
    IOracle.OpenAiRequest private OpenAiConfig;

    IOracle.GroqRequest private GroqConfig;

    // @param initialOracleAddress Initial address of the oracle contract
    // @param systemPrompt Initial prompt for the system message
    constructor(address initialOracleAddress, string memory systemPrompt) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        prompt = systemPrompt;
    }

    // @notice Ensures the caller is the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    // @notice Ensures the caller is the oracle contract
    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    // @notice Updates the oracle address
    // @param newOracleAddress The new oracle address to set
    function setOracleAddress(address newOracleAddress) public onlyOwner {
        require(msg.sender == owner, "Caller is not the owner");
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    // @notice Starts a new agent run
    // @param query The initial user query
    // @param max_iterations The maximum number of iterations for the agent run
    // @return The ID of the newly created agent run
    function runAgent(string memory query, uint8 maxIterations, IOracle.OpenAiRequest memory openAiConfig, IOracle.GroqRequest memory groqConfig, string memory knowledge_base) public returns (uint) {
        AgentRun storage run = agentRuns[agentRunCount];
        run.owner = msg.sender;
        run.is_finished = false;
        run.responsesCount = 0;
        run.max_iterations = maxIterations;
        run.knowledge_base = knowledge_base;

        Message memory systemMessage = Message("system", prompt);
        run.messages.push(systemMessage);

        Message memory userMessage = Message("user", query);
        run.messages.push(userMessage);

        uint currentId = agentRunCount;
        agentRunCount++;

        if (bytes(knowledge_base).length > 0) {
            // Query the knowledge base if provided
            IOracle(oracleAddress).createKnowledgeBaseQuery(currentId, knowledge_base, query, 3);
        } else if (keccak256(abi.encodePacked(openAiConfig.model)) != keccak256(abi.encodePacked(""))) {
            IOracle(oracleAddress).createOpenAiLlmCall(currentId, openAiConfig);
        } else {
            IOracle(oracleAddress).createGroqLlmCall(currentId, groqConfig);
        }
        emit AgentRunCreated(run.owner, currentId);

        return currentId;
    }

    // @notice Handles the response from the oracle for an OpenAI LLM call
    // @param runId The ID of the agent run
    // @param response The response from the oracle
    // @param errorMessage Any error message
    // @dev Called by teeML oracle
    function onOracleOpenAiLlmResponse(
        uint runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];

        if (!compareStrings(errorMessage, "")) {
            Message memory newMessage;
            newMessage.role = "assistant";
            newMessage.content = errorMessage;
            run.messages.push(newMessage);
            run.responsesCount++;
            run.is_finished = true;
            return;
        }
        if (run.responsesCount >= run.max_iterations) {
            run.is_finished = true;
            return;
        }
        if (!compareStrings(response.content, "")) {
            Message memory assistantMessage;
            assistantMessage.content = response.content;
            assistantMessage.role = "assistant";
            run.messages.push(assistantMessage);
            run.responsesCount++;
        }
        if (!compareStrings(response.functionName, "")) {
            IOracle(oracleAddress).createFunctionCall(runId, response.functionName, response.functionArguments);
            return;
        }
        run.is_finished = true;
    }

    function onOracleGroqLlmResponse(
        uint runId,
        IOracle.GroqResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];

        if (!compareStrings(errorMessage, "")) {
            // If there's an error message, handle it as an assistant message and finish the run
            Message memory errorMessageStruct;
            errorMessageStruct.role = "assistant";
            errorMessageStruct.content = errorMessage;
            run.messages.push(errorMessageStruct);
            run.responsesCount++;
            run.is_finished = true;
            return;
        }

        if (run.responsesCount >= run.max_iterations) {
            // If the maximum number of iterations is reached, finish the run
            run.is_finished = true;
            return;
        }

        if (!compareStrings(response.content, "")) {
            // If there's a content response, add it as an assistant message
            Message memory assistantMessage;
            assistantMessage.content = response.content;
            assistantMessage.role = "assistant";
            run.messages.push(assistantMessage);
            run.responsesCount++;
        }

        // If the agent should continue after this response, trigger the next LLM call
        if (
            run.responsesCount < run.max_iterations &&
            compareStrings(errorMessage, "")
        ) {
            IOracle(oracleAddress).createGroqLlmCall(runId, GroqConfig);
        } else {
            // Otherwise, mark the run as finished
            run.is_finished = true;
        }
    }


    // @notice Handles the response from the oracle for a function call
    // @param runId The ID of the agent run
    // @param response The response from the oracle
    // @param errorMessage Any error message
    // @dev Called by teeML oracle
    function onOracleFunctionResponse(
        uint runId,
        string memory response,
        string memory errorMessage
    ) public onlyOracle {
        AgentRun storage run = agentRuns[runId];
        require(!run.is_finished, "Run is finished");

        string memory result = response;
        if (!compareStrings(errorMessage, "")) {
            result = errorMessage;
        }

        Message memory newMessage;
        newMessage.role = "user";
        newMessage.content = result;
        run.messages.push(newMessage);
        run.responsesCount++;
        IOracle(oracleAddress).createOpenAiLlmCall(runId, OpenAiConfig);
    }

    function onOracleKnowledgeBaseQueryResponse(uint runId, string[] memory documents, string memory errorMessage) public onlyOracle {
        AgentRun storage run = agentRuns[runId];
        uint256 lastIndex = run.messages.length - 1;
        
        require(run.messages.length > 0 && compareStrings(run.messages[lastIndex].role, "user"), "No message to add context to");

        if (!compareStrings(errorMessage, "")) {
            // Handle the error case by adding the error message as an assistant message
            Message memory errorMessageStruct;
            errorMessageStruct.role = "assistant";
            errorMessageStruct.content = errorMessage;
            run.messages.push(errorMessageStruct);
            run.responsesCount++;
            run.is_finished = true;
            return;
        }

        Message storage lastMessage = run.messages[lastIndex];
        string memory newContent = lastMessage.content;

        if (documents.length > 0) {
            newContent = string(abi.encodePacked(newContent, "\n\nRelevant context:\n"));
        }

        for (uint i = 0; i < documents.length; i++) {
            newContent = string(abi.encodePacked(newContent, documents[i], "\n"));
        }

        lastMessage.content = newContent;
        IOracle(oracleAddress).createOpenAiLlmCall(runId, OpenAiConfig);
    }

    // @notice Retrieves the message history contents for a given agent run
    // @param agentId The ID of the agent run
    // @return An array of message contents
    // @dev Called by teeML oracle
    function getMessageHistoryContents(uint agentId) public view returns (string[] memory) {
        string[] memory messages = new string[](agentRuns[agentId].messages.length);
        for (uint i = 0; i < agentRuns[agentId].messages.length; i++) {
            messages[i] = agentRuns[agentId].messages[i].content;
        }
        return messages;
    }

    // @notice Retrieves the roles of the messages in a given agent run
    // @param agentId The ID of the agent run
    // @return An array of message roles
    // @dev Called by teeML oracle
    function getMessageHistoryRoles(uint agentId) public view returns (string[] memory) {
        string[] memory roles = new string[](agentRuns[agentId].messages.length);
        for (uint i = 0; i < agentRuns[agentId].messages.length; i++) {
            roles[i] = agentRuns[agentId].messages[i].role;
        }
        return roles;
    }

    // @notice Checks if a given agent run is finished
    // @param runId The ID of the agent run
    // @return True if the run is finished, false otherwise
    function isRunFinished(uint runId) public view returns (bool) {
        return agentRuns[runId].is_finished;
    }

    // @notice Compares two strings for equality
    // @param a The first string
    // @param b The second string
    // @return True if the strings are equal, false otherwise
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
