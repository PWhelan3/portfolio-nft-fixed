import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi'; // Fix import path
import { Menu, X, Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// Import your pages
import HomePage from './pages/HomePage';
import MintPage from './pages/MintPage';
import ProfilePage from './pages/ProfilePage';

// Create query client
const queryClient = new QueryClient();

// Navigation Component
const Navigation = ({ currentPage, setCurrentPage, isConnected, account, connectWallet, disconnectWallet }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md z-50 border-b border-slate-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and title */}
        <button 
          onClick={() => setCurrentPage('home')} 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img width="55" height="55" src="/Icon.png" alt="Portfolio Logo" />
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Peter's Web3 Portfolio
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { id: 'home', label: 'Home' },
            { id: 'mint', label: 'Mint NFT' },
            { id: 'profile', label: 'Profile' }
          ].map(page => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`transition-colors hover:text-blue-400 ${
                currentPage === page.id ? 'text-blue-400' : 'text-slate-300'
              }`}
            >
              {page.label}
            </button>
          ))}
          
          {/* Wallet button */}
          <button
            onClick={isConnected ? disconnectWallet : connectWallet}
            className={`p-2 rounded-lg font-medium transition-all ${
              isConnected 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }`}
            title={isConnected ? `Connected: ${account}` : 'Connect Wallet'}
          >
            <Wallet className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2"
        >
          <div className="w-6 h-6 flex flex-col justify-center">
            <span className={`w-full h-0.5 bg-white block mb-1 transition-transform ${
              mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}></span>
            <span className={`w-full h-0.5 bg-white block mb-1 transition-opacity ${
              mobileMenuOpen ? 'opacity-0' : ''
            }`}></span>
            <span className={`w-full h-0.5 bg-white block transition-transform ${
              mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}></span>
          </div>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`md:hidden bg-slate-900/98 backdrop-blur-md border-b border-slate-700 transition-all duration-300 ${
        mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="container mx-auto px-4 py-4 space-y-4">
          {[
            { id: 'home', label: 'Home' },
            { id: 'mint', label: 'Mint NFT' },
            { id: 'profile', label: 'Profile' }
          ].map(page => (
            <button
              key={page.id}
              onClick={() => {
                setCurrentPage(page.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                currentPage === page.id 
                  ? 'text-blue-400 bg-blue-400/10' 
                  : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800'
              }`}
            >
              {page.label}
            </button>
          ))}
          
          {/* Mobile wallet button */}
          <button
            onClick={() => {
              isConnected ? disconnectWallet() : connectWallet();
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full py-2 px-3 rounded font-medium transition-all ${
              isConnected 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }`}
          >
            <Wallet className="w-5 h-5" />
            {isConnected ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
};

// Main App Component wrapped with Web3 Hook
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = () => {
    const metaMaskConnector = connectors.find(c => c.name === 'MetaMask');
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isConnected={isConnected}
        account={address}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
      
      {/* Page Content */}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'mint' && <MintPage />}
      {currentPage === 'profile' && <ProfilePage />}
      
      {/* Footer */}
      <footer className="bg-slate-800 py-8 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            This Portfolio was Built with React, Vite, Tailwind CSS, and Blockchain Technologies
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Smart Contracts Deployed on Sepolia Testnet | IPFS Storage via Pinata
          </p>
        </div>
      </footer>
    </div>
  );
};

// Main App with Providers
const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;