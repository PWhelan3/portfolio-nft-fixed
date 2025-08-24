const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SimpleNFT contract...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
  const simpleNFT = await SimpleNFT.deploy(deployer.address);
  
  await simpleNFT.waitForDeployment();
  
  const contractAddress = await simpleNFT.getAddress();
  
  console.log("✅ SimpleNFT deployed to:", contractAddress);
  console.log("🔗 Sepolia Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("\n📋 Add this to your .env file:");
  console.log(`VITE_NFT_CONTRACT_ADDRESS=${contractAddress}`);
  
  // Get contract info
  const name = await simpleNFT.name();
  const symbol = await simpleNFT.symbol();
  const owner = await simpleNFT.owner();
  const totalSupply = await simpleNFT.totalSupply();
  
  console.log("\n📊 Contract Information:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Owner:", owner);
  console.log("   Total Supply:", totalSupply.toString());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
