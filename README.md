# Agentverse README

## Introduction

Welcome to Agentverse! This project allows you to deploy and interact with customizable AI Agent NFTs (AGNTs) with advanced AI configurations and knowledge bases. This README will guide you through setting up, deploying, and running the Agentverse platform.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v18 or higher)
- Yarn package manager
- Docker and Docker Compose
- Python 3.11
- A web3 wallet (like MetaMask)

## Getting Started

Follow these steps to set up and run the Agentverse project.

### 1. Clone the Repository

```sh
git clone https://github.com/your-repo/agentverse.git
cd agentverse
2. Install Dependencies
Install the required dependencies for all the project components:

Contracts Dependencies
sh
Copy code
cd contracts
yarn install
Frontend Dependencies
sh
Copy code
cd frontend
yarn install
RAG Tools Dependencies
sh
Copy code
cd rag-tools
yarn install
3. Environment Variables
Create a .env file in the contracts, frontend, and rag-tools directories with the necessary environment variables.

Contracts .env Example
env
Copy code
# Address of oracle deployed on Galadriel testnet. See https://docs.galadriel.com/oracle-address
ORACLE_ADDRESS="your_oracle_address"

# Private key to use for deployment on Galadriel testnet
PRIVATE_KEY_GALADRIEL="your_private_key_galadriel"

# Private key to use for deployment on local network
PRIVATE_KEY_LOCALHOST=""
Frontend .env Example
env
Copy code
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_API_ENDPOINT=http://127.0.0.1:5001/process_rag
NEXT_PUBLIC_AGENT_MANAGER_CONTRACT_ADDRESS=your_agent_manager_contract_address
NEXT_PUBLIC_AGENT_CONTRACT=your_agent_contract_address
NEXT_PUBLIC_PINATA_API_JWT=your_pinata_api_jwt
RAG Tools .env Example
env
Copy code
CHAIN_ID=your_chain_id
RPC_URL="your_rpc_url"
PRIVATE_KEY="your_private_key"
ORACLE_ADDRESS="your_oracle_address"
PINATA_API_KEY="your_pinata_api_key"
MAX_DOCUMENT_SIZE_MB=10
4. Deploy Agentverse Contract
Deploy the Agentverse smart contract to the blockchain:

sh
Copy code
cd contracts
yarn run deployAgentVerse:galadriel
5. Run the Docker Container for RAG Knowledge Base Generation and Indexing
Start the backend services using Docker Compose:

sh
Copy code
docker-compose up --build
6. Run the Frontend
Start the frontend development server:

sh
Copy code
cd frontend
yarn dev
Interacting with Agentverse
Deploying an AGNT
Once the backend and frontend are running, you can deploy an AGNT NFT from the frontend UI. Navigate to the deployment page, fill in the required details, and deploy your AGNT.

Customizing AI Configurations
Customize your AGNTs AI model and parameters from the frontend interface. Select the AI model, set parameters like temperature, max tokens, etc., and save the configuration.

Starting RAG Knowledge Base Generation
You can start the RAG knowledge base generation directly from the UI. Enter the necessary data and initiate the generation process to equip your AGNT with relevant information.

Interacting with Deployed AGNTs
Use the chat interface to interact with your deployed AGNTs. Type your queries or commands, and the AGNT will respond based on its configured AI model and knowledge base.

Note: For this setup to work, you must explicitly define the tokenID of the AGNT in app/ui/ChatInterface.tsx once the AGNT NFT has been minted, as the retrieval of AGNT NFTs owned by users is still currently being built.

Troubleshooting
If you encounter any issues, please check the following:

Ensure all dependencies are installed correctly.
Verify environment variables in the .env files are set accurately.
Check Docker services are running without errors.
For detailed logging, ensure you have enabled logging in your frontend and backend configurations.

Contributing
We welcome contributions! Please fork the repository, make your changes, and submit a pull request.

License
This project is licensed under the MIT License.

Thank you for using Agentverse! If you have any questions or need further assistance, please feel free to reach out to our support team.

Note: Replace placeholders like your_chain_id, your_rpc_url, your_private_key, your_oracle_address, your_walletconnect_project_id, your_agent_manager_contract_address, and your_pinata_api_jwt with actual values specific to your environment.