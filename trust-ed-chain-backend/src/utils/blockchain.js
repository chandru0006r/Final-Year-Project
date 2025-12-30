const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');

// Load environment variables if not already loaded
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let contractInstance = null;
let provider = null;
let wallet = null;

const initContract = async () => {
    try {
        if (contractInstance) return contractInstance;

        const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545"; // Default hardhat node
        const privateKey = process.env.PRIVATE_KEY; 
        const contractAddress = process.env.CONTRACT_ADDRESS;

        if (!privateKey || !contractAddress) {
            console.warn("⚠️ Blockchain: Missing PRIVATE_KEY or CONTRACT_ADDRESS. Blockchain logging disabled.");
            return null;
        }

        // Connect to provider
        provider = new ethers.JsonRpcProvider(rpcUrl);

        // Check if provider is ready
        // await provider.getNetwork(); 

        // Load ABI
        const artifactPath = path.join(__dirname, '../../artifacts/contracts/StudentMicroloan.sol/StudentMicroloan.json');
        
        if (!fs.existsSync(artifactPath)) {
            console.warn("⚠️ Blockchain: Contract artifacts not found. Run 'npx hardhat compile'.");
            return null;
        }

        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
        const abi = artifact.abi;

        // Create Wallet
        wallet = new ethers.Wallet(privateKey, provider);

        // Create Contract instance
        contractInstance = new ethers.Contract(contractAddress, abi, wallet);
        console.log("✅ Blockchain connected to StudentMicroloan contract.");
        
        return contractInstance;
    } catch (error) {
        console.error("❌ Blockchain Init Error:", error.message);
        return null; // Fail gracefully
    }
};

const logLoanOnChain = async (loanId, action, amount, status) => {
    try {
        const contract = await initContract();
        if (!contract) {
            console.log(`[Mock Blockchain] Loan Logged: ID=${loanId}, Action=${action}, Amount=${amount}, Status=${status}`);
            return;
        }

        // actions enum: Created, Funded, Repaid, StatusUpdated, Penalty, Forgiveness
        // Map string string action to int if needed, or pass int directly
        // Solidity Enum: Created=0, Funded=1, ...
        
        const actionEnum = {
            'Created': 0,
            'Funded': 1,
            'Repaid': 2,
            'StatusUpdated': 3
        };

        const actionInt = actionEnum[action] !== undefined ? actionEnum[action] : 3;

        // Send transaction
        // Send transaction
        console.log(`\n🔗 Blockchain: Initiating Transaction...`);
        console.log(`   Function: logLoan(id=${loanId}, action=${action})`);
        
        const tx = await contract.logLoan(loanId, actionInt, amount, status || "Pending");
        
        console.log(`\n🚀 Transaction SENT!`);
        console.log(`   Hash:      ${tx.hash}`);
        console.log(`   From:      ${tx.from}`);
        console.log(`   To:        ${tx.to}`);
        console.log(`   Nonce:     ${tx.nonce}`);
        console.log(`   Gas Limit: ${tx.gasLimit.toString()}`);
        console.log(`   Creating Block... (Waiting for Mine)`);

        // Wait for confirmation
        const receipt = await tx.wait(); 
        
        console.log(`\n✅ Transaction CONFIRMED!`);
        console.log(`   Block Number:   ${receipt.blockNumber}`);
        console.log(`   BlockHash:      ${receipt.blockHash}`);
        console.log(`   Gas Used:       ${receipt.gasUsed.toString()}`);
        console.log(`   Effective Gas:  ${receipt.gasPrice ? receipt.gasPrice.toString() : 'N/A'}`);
        console.log(`   Status:         ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'}`);
        console.log(`--------------------------------------------------\n`);
        
        return tx.hash;

    } catch (error) {
        console.error("❌ Blockchain Log Error:", error);
    }
};

module.exports = {
    logLoanOnChain
};
