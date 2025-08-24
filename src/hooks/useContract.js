import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '../config/wagmi';
import { uploadNFTToPinata, validateImageFile } from '../utils/pinata';

/**
 * Hook for minting NFTs
 */
export const useMintNFT = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mintNFT = useCallback(async (imageFile, name, description) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    if (!CONTRACT_CONFIG.address) {
      throw new Error('Contract address not configured');
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validate image file
      validateImageFile(imageFile);

      // Upload to IPFS via Pinata
      console.log('📤 Uploading NFT to IPFS...');
      const { metadataUrl } = await uploadNFTToPinata(imageFile, name, description);

      // Mint NFT on blockchain
      console.log('⛓️  Minting NFT on blockchain...');
      const hash = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'mint',
        args: [address, metadataUrl],
      });

      console.log('✅ NFT minted successfully!', { hash, metadataUrl });
      
      return {
        hash,
        metadataUrl,
        success: true
      };

    } catch (err) {
      console.error('❌ Minting failed:', err);
      const errorMessage = err?.message || 'Failed to mint NFT';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [address, writeContractAsync]);

  return {
    mintNFT,
    isLoading,
    error,
  };
};

/**
 * Hook for getting user's owned NFTs
 */
export const useUserNFTs = () => {
  const { address } = useAccount();

  // Get owned token IDs
  const {
    data: tokenIds,
    isError,
    isLoading,
    refetch
  } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getOwnedTokens',
    args: address ? [address] : undefined,
    enabled: !!address && !!CONTRACT_CONFIG.address,
  });

  return {
    tokenIds: tokenIds || [],
    isLoading,
    isError,
    refetch,
    hasNFTs: tokenIds && tokenIds.length > 0,
  };
};

/**
 * Hook for getting NFT metadata
 */
export const useNFTMetadata = (tokenId) => {
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token URI from contract
  const {
    data: tokenURI,
    isError: uriError,
    isLoading: uriLoading
  } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'tokenURI',
    args: tokenId ? [tokenId] : undefined,
    enabled: !!tokenId && !!CONTRACT_CONFIG.address,
  });

  // Fetch metadata from IPFS when tokenURI is available
  const fetchMetadata = useCallback(async (uri) => {
    if (!uri) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }
      
      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      console.error('Failed to fetch NFT metadata:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch metadata when tokenURI changes
  React.useEffect(() => {
    if (tokenURI) {
      fetchMetadata(tokenURI);
    }
  }, [tokenURI, fetchMetadata]);

  return {
    metadata,
    tokenURI,
    isLoading: isLoading || uriLoading,
    isError: error || uriError,
    refetch: () => fetchMetadata(tokenURI),
  };
};

/**
 * Hook for contract statistics
 */
export const useContractStats = () => {
  // Get total supply
  const {
    data: totalSupply,
    isError,
    isLoading,
    refetch
  } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'totalSupply',
    enabled: !!CONTRACT_CONFIG.address,
  });

  return {
    totalSupply: totalSupply ? Number(totalSupply) : 0,
    isLoading,
    isError,
    refetch,
  };
};

/**
 * Hook for tracking transaction status
 */
export const useTransactionStatus = (hash) => {
  const {
    data: receipt,
    isError,
    isLoading,
    isSuccess
  } = useWaitForTransactionReceipt({
    hash,
    enabled: !!hash,
  });

  return {
    receipt,
    isLoading,
    isError,
    isSuccess,
    isConfirmed: isSuccess && receipt?.status === 'success',
  };
};