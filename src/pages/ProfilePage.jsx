import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Wallet, Image as ImageIcon, Calendar, Hash } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useUserNFTs, useNFTMetadata, useContractStats } from '../hooks/useContract';

const ProfilePage = () => {
  const { address, isConnected } = useAccount();
  const { tokenIds, isLoading: nftsLoading, hasNFTs, refetch } = useUserNFTs();
  const { totalSupply } = useContractStats();

  return (
    <div className="pt-16 min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-16">
        
        {/* Profile Header */}
        <div className="bg-slate-800 rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
              <img src="/123.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">Peter Whelan</h1>
              <p className="text-blue-400 text-lg mb-4">Blockchain and Web3 Developer</p>
              <p className="text-slate-300 mb-6 max-w-2xl">
                I am passionate about blockchain technology, decentralized applications, and contributing to the future of Web3.
                I have experience in smart contract development, blockchain development frameworks, frontend development frameworks, and I have a keen eye for developing creative and engaging solutions.
              </p>
              
              <div className="flex justify-center md:justify-start gap-4">
                <a href="https://github.com/PWhelan3" target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors">
                    <Github className="w-4 h-4" />
                    GitHub
                  </button>
                </a>
                <a href="https://www.linkedin.com/in/peter-c-whelan" target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                </a>
                <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Connection Status */}
        {!isConnected && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6 mb-12">
            <div className="flex items-center justify-center gap-3 text-yellow-400">
              <Wallet className="w-6 h-6" />
              <span className="text-lg font-medium">Connect your wallet to view your NFT collection</span>
            </div>
          </div>
        )}

        {/* NFT Collection */}
        {isConnected && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">My NFT Collection</h2>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Owned:</span>
                  <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm">
                    {tokenIds?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {nftsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <NFTCardSkeleton key={index} />
                ))}
              </div>
            ) : hasNFTs ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokenIds.map((tokenId) => (
                  <NFTCard key={tokenId} tokenId={tokenId} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ImageIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No NFTs Found</h3>
                <p className="text-slate-400 mb-6">You haven't minted any NFTs yet.</p>
                <button 
                  onClick={() => window.scrollTo({ top: 0 })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Mint Your First NFT
                </button>
              </div>
            )}
          </div>
        )}

        {/* Technical Skills */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Technical Skills</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                category: "Blockchain",
                skills: ["Solidity", "Web3", "Etherscan", "Hardhat", "Truffle", "OpenZeppelin", "MetaMask", "Sepolia", "IPFS", "Pinata", "Wagmi", "Remix IDE" ]
              },
              {
                category: "Frontend",
                skills: ["React", "JavaScript", "HTML", "Tailwind CSS", "Vite", "Wagmi", "GitHub", "CSS", "Bootstrap", "Java"]
              },
              {
                category: "Backend",
                skills: ["Node.js", "Express", "MongoDB", "AWS", "APIs", "mySQL"]
              }
            ].map((skillGroup, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-white font-medium mb-4">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Gallery */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Project Gallery</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Portfolio NFT Platform",
                description: "This current project - simplified NFT minting with IPFS storage via Pinata",
                status: "Deployed",
                tech: ["Solidity", "React", "Pinata", "Sepolia"],
                link: "#"
              },
              {
                title: "Cross-Chain Bridge",
                description: "Multi-chain asset transfer protocol supporting Ethereum and Polygon",
                status: "In Development",
                tech: ["Solidity", "Chainlink", "Node.js"],
                link: "#"
              },
              {
                title: "AI-Powered DeFi Analytics",
                description: "Machine learning models for DeFi yield optimization and risk assessment",
                status: "Beta",
                tech: ["Python", "Web3.py", "TensorFlow"],
                link: "#"
              },
              {
                title: "NFT Fractionalization Protocol",
                description: "Smart contracts for fractional NFT ownership and trading",
                status: "Deployed",
                tech: ["Solidity", "OpenZeppelin", "React"],
                link: "#"
              },
              {
                title: "DAO Governance Platform",
                description: "Complete governance solution with proposal creation and voting mechanisms",
                status: "Deployed",
                tech: ["Solidity", "Next.js", "The Graph"],
                link: "#"
              },
              {
                title: "Blockchain Identity Wallet",
                description: "Self-sovereign identity solution with biometric authentication",
                status: "Research",
                tech: ["Rust", "Substrate", "WebAuthn"],
                link: "#"
              }
            ].map((project, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-medium">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Deployed' ? 'bg-green-600/20 text-green-400' :
                    project.status === 'Beta' ? 'bg-yellow-600/20 text-yellow-400' :
                    project.status === 'In Development' ? 'bg-blue-600/20 text-blue-400' :
                    'bg-slate-600/20 text-slate-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-slate-300 text-sm mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tech.map(tech => (
                    <span key={tech} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm group-hover:translate-x-1 transition-all">
                  <ExternalLink className="w-3 h-3" />
                  View Project
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual NFT Card Component
const NFTCard = ({ tokenId }) => {
  const { metadata, tokenURI, isLoading, isError } = useNFTMetadata(tokenId);

  if (isLoading) {
    return <NFTCardSkeleton />;
  }

  if (isError || !metadata) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="text-center text-red-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p>Failed to load NFT #{tokenId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-all group">
      {/* NFT Image */}
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={metadata.image} 
          alt={metadata.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNDc0NjZhIi8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
          }}
        />
      </div>
      
      {/* NFT Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-medium truncate">{metadata.name}</h3>
          <span className="text-slate-500 text-sm">#{tokenId}</span>
        </div>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {metadata.description}
        </p>
        
        {/* Metadata */}
        <div className="space-y-2 text-xs text-slate-500">
          {metadata.attributes?.map((attr, index) => (
            <div key={index} className="flex justify-between">
              <span>{attr.trait_type}:</span>
              <span className="text-slate-400">{attr.value}</span>
            </div>
          ))}
        </div>
        
        {/* Links */}
        <div className="mt-4 flex gap-2">
          <a 
            href={metadata.image}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-2 rounded text-sm transition-colors"
          >
            View Image
          </a>
          <a 
            href={tokenURI}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-slate-600/20 text-slate-400 hover:bg-slate-600/30 px-3 py-2 rounded text-sm transition-colors"
          >
            Metadata
          </a>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for NFT cards
const NFTCardSkeleton = () => (
  <div className="bg-slate-800 rounded-lg overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-slate-700"></div>
    <div className="p-4">
      <div className="h-4 bg-slate-700 rounded mb-2"></div>
      <div className="h-3 bg-slate-700 rounded mb-4 w-3/4"></div>
      <div className="space-y-2">
        <div className="h-2 bg-slate-700 rounded"></div>
        <div className="h-2 bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default ProfilePage;