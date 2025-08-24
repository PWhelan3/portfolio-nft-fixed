import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Wallet, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useMintNFT, useTransactionStatus, useContractStats } from '../hooks/useContract';

const MintPage = () => {
  const { address, isConnected } = useAccount();
  const { mintNFT, isLoading: isMinting, error: mintError } = useMintNFT();
  const { totalSupply } = useContractStats();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [mintSuccess, setMintSuccess] = useState(false);
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useTransactionStatus(transactionHash);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle mint NFT
  const handleMint = async () => {
    if (!selectedFile || !nftName || !nftDescription) {
      alert('Please fill in all fields and select an image');
      return;
    }

    try {
      const result = await mintNFT(selectedFile, nftName, nftDescription);
      setTransactionHash(result.hash);
      setMintSuccess(true);
      
      // Reset form after successful mint
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl('');
        setNftName('');
        setNftDescription('');
        setMintSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setNftName('');
    setNftDescription('');
    setTransactionHash('');
    setMintSuccess(false);
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Mint Your <span className="text-blue-400">NFT</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Upload your artwork and mint it as an NFT on the Sepolia testnet. 
            Your image will be stored on IPFS via Pinata.
          </p>
          
          {/* Stats */}
          <div className="mt-8 inline-flex items-center gap-4 bg-slate-800 rounded-lg px-6 py-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{totalSupply}</div>
              <div className="text-sm text-slate-400">Total Minted</div>
            </div>
            <div className="w-px h-8 bg-slate-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Free</div>
              <div className="text-sm text-slate-400">Mint Cost</div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="max-w-2xl mx-auto mb-8 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
            <div className="flex items-center gap-3 text-yellow-400">
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Connect your wallet to start minting NFTs</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {mintSuccess && (
          <div className="max-w-2xl mx-auto mb-8 bg-green-900/20 border border-green-600/30 rounded-lg p-6">
            <div className="flex items-center gap-3 text-green-400 mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">NFT Minted Successfully!</span>
            </div>
            {transactionHash && (
              <div className="text-sm text-slate-300">
                <p className="mb-2">Transaction Hash:</p>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 break-all"
                >
                  {transactionHash}
                </a>
                {isConfirming && (
                  <p className="mt-2 text-yellow-400">Waiting for confirmation...</p>
                )}
                {isConfirmed && (
                  <p className="mt-2 text-green-400">Transaction confirmed!</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {mintError && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-900/20 border border-red-600/30 rounded-lg p-6">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Minting Error:</span>
            </div>
            <p className="text-sm text-slate-300 mt-2">{mintError}</p>
          </div>
        )}

        {/* Main Minting Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800 rounded-xl p-8">
            
            {/* Image Upload Section */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-4">Upload Image</label>
              
              {!selectedFile ? (
                <div 
                  className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 mb-2">Drag and drop your image here</p>
                  <p className="text-slate-500 text-sm">or click to browse</p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="NFT Preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={resetForm}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                  <div className="mt-4 text-sm text-slate-400">
                    <p><strong>File:</strong> {selectedFile.name}</p>
                    <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* NFT Metadata */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-white font-medium mb-2">NFT Name *</label>
                <input
                  type="text"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  placeholder="Enter a name for your NFT"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isMinting}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description *</label>
                <textarea
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                  placeholder="Describe your NFT artwork"
                  rows={4}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={isMinting}
                />
              </div>
            </div>

            {/* Mint Button */}
            <button
              onClick={handleMint}
              disabled={!isConnected || !selectedFile || !nftName || !nftDescription || isMinting}
              className={`w-full py-4 rounded-lg font-medium text-white transition-all ${
                !isConnected || !selectedFile || !nftName || !nftDescription || isMinting
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
              }`}
            >
              {isMinting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Minting NFT...</span>
                </div>
              ) : !isConnected ? (
                'Connect Wallet to Mint'
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Mint NFT</span>
                </div>
              )}
            </button>

            {/* Info */}
            <div className="mt-6 text-sm text-slate-400 text-center">
              <p>• Free minting on Sepolia testnet</p>
              <p>• Images stored on IPFS via Pinata</p>
              <p>• ERC-721 standard compliant</p>
            </div>
          </div>
        </div>

        {/* Technology Info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">1. Upload Image</h3>
              <p className="text-slate-400">Select your artwork and add metadata like name and description</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">2. IPFS Storage</h3>
              <p className="text-slate-400">Image and metadata are uploaded to IPFS via Pinata for decentralized storage</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">3. Mint NFT</h3>
              <p className="text-slate-400">Smart contract mints your ERC-721 token on Sepolia testnet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintPage;