import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const AGENT_PROMPT = "You are a helpful assistant";

async function main() {
  const oracleAddress = process.env.ORACLE_ADDRESS; // Get Oracle address from env
  if (!oracleAddress) {
    throw new Error("Oracle address is not set in the environment variables.");
  }

  const initialPrompt = AGENT_PROMPT;

  const agentManagerAddress = await deployAgentManager(oracleAddress, initialPrompt);
  console.log(`AgentManager deployed to ${agentManagerAddress}`);
}

async function deployAgentManager(oracleAddress: string, initialPrompt: string): Promise<string> {
  const AgentManager = await ethers.getContractFactory("AgentManager");
  const agentManager = await AgentManager.deploy(oracleAddress, initialPrompt);

  const deploymentTransaction = agentManager.deploymentTransaction();
  if (!deploymentTransaction) {
    throw new Error("Failed to get deployment transaction for AgentManager.");
  }

  await deploymentTransaction.wait();

  if (!agentManager.target) {
    throw new Error("Failed to get deployment address for AgentManager.");
  }

  const agentManagerAddress = agentManager.target as string;
  console.log(`AgentManager deployed to ${agentManagerAddress}`);

  return agentManagerAddress;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
