import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWalletService = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const initializeWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();
      const address = await web3Signer.getAddress();

      setSigner(web3Signer);
      setNetwork(network.name);
      setWalletAddress(address);

      // Handle events
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      setInitialized(true);
    } else {
      console.error('Wallet extension not installed.');
    }
  }, []);

  const handleAccountsChanged = useCallback(
    (accounts) => {
      if (accounts.length === 0) {
        handleWalletDisconnect();
      } else {
        initializeWalletConnection();
      }
    },
    [initializeWalletConnection]
  );

  const handleChainChanged = useCallback(() => {
    initializeWalletConnection();
  }, [initializeWalletConnection]);

  const handleWalletDisconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setNetwork(null);
    setWalletAddress(null);
    setInitialized(false);
  }, []);

  const connectToWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      initializeWalletConnection();
    } else {
      console.error('Wallet is not installed.');
    }
  }, [initializeWalletConnection]);

  const signMessage = useCallback(
    async (message) => {
      if (!signer) {
        alert('Wallet not connected');
        return undefined;
      }

      try {
        const signature = await signer.signMessage(message);
        return signature;
      } catch (error) {
        console.error('Sign failed:', error);
        return undefined;
      }
    },
    [signer]
  );

  useEffect(() => {
    initializeWalletConnection();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [initializeWalletConnection, handleAccountsChanged, handleChainChanged]);

  return {
    signer,
    network,
    walletAddress,
    initialized,
    connectToWallet,
    disconnectWallet: handleWalletDisconnect,
    signMessage,
  };
};
