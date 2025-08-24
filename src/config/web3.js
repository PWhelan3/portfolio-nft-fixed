import { getDefaultConfig } from 'connectkit';
import { createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  // Your App Info
  appName: "Peter's Web3 Portfolio",
  appDescription: "Geo-Located NFT Minting Platform",
  appUrl: "https://yourportfolio.com",
  appIcon: "/icon.png",

  // WalletConnect Project ID (you'll need to get this from https://cloud.walletconnect.com)
  walletConnectProjectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || "your-project-id",

  // Supported chains
  chains: [sepolia, mainnet],
});

// Contract configuration
export const CONTRACT_CONFIG = {
  address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
  abi: [
    // Essential ABI for your GeoNFT contract
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "string", "name": "uri", "type": "string"},
        {"internalType": "int256", "name": "latitude", "type": "int256"},
        {"internalType": "int256", "name": "longitude", "type": "int256"},
        {"internalType": "string", "name": "locationName", "type": "string"}
      ],
      "name": "mintGeoNFT",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "getTokenLocation",
      "outputs": [
        {
          "components": [
            {"internalType": "int256", "name": "latitude", "type": "int256"},
            {"internalType": "int256", "name": "longitude", "type": "int256"},
            {"internalType": "string", "name": "locationName", "type": "string"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
          ],
          "internalType": "struct GeoNFT.Location",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
      "name": "getOwnedTokens",
      "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "tokenURI",
      "outputs": [{"internalType": "string", "name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "ownerOf",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

// Utility functions
export const getEtherscanUrl = (address) => {
  return `https://sepolia.etherscan.io/address/${address}`;
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};