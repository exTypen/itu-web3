import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWalletService = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [ariBalance, setAriBalance] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState(null);

  const ARI_ADDRESS = "0x36c29d9C60969C0b5dbb9E49c616feA4737276fC"; // Sepolia
  const USDT_ADDRESS = "0x714247e799aA19bD75ea55dAC2d1DDE7641a0321"; // Sepolia
  const ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ];

  const getBalances = useCallback(async () => {
    if (provider && walletAddress) {
      try {
        const ariContract = new ethers.Contract(ARI_ADDRESS, ABI, provider);
        const usdtContract = new ethers.Contract(USDT_ADDRESS, ABI, provider);

        // const ariDecimals = await ariContract.decimals();
        // const usdtDecimals = await usdtContract.decimals();

        const ariRawBalance = await ariContract.balanceOf(walletAddress);
        const usdtRawBalance = await usdtContract.balanceOf(walletAddress);

        const ariBalance = ethers.utils.formatUnits(ariRawBalance, 6);
        const usdtBalance = ethers.utils.formatUnits(usdtRawBalance, 18);

        setAriBalance(ariBalance);
        setUsdtBalance(usdtBalance);
      } catch (error) {
        console.error("Error fetching balances:", error);
        setAriBalance(null);
        setUsdtBalance(null);
      }
    } else {
      setAriBalance(null);
      setUsdtBalance(null);
    }
  }, [provider, walletAddress]);

  const initializeWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        const signer = web3Provider.getSigner();
        setSigner(signer);
        const network = await web3Provider.getNetwork();
        setNetwork(network.name);
        const address = await signer.getAddress();
        setWalletAddress(address);
        setInitialized(true);
        getBalances(); // Get initial balances after connection
      } catch (error) {
        console.error("Error initializing wallet:", error);
      }
    } else {
      console.error('Wallet extension not installed.');
    }
  }, [getBalances]);

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

  const handleWalletDisconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setNetwork(null);
    setWalletAddress(null);
    setInitialized(false);
    setAriBalance(null);
    setUsdtBalance(null);
    if (window.ethereum && window.ethereum.disconnect) {
      window.ethereum.disconnect();
    }
  }, []);

  const connectToWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length === 0) {
          handleWalletDisconnect();
        } else {
          initializeWalletConnection();
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error('Wallet is not installed.');
    }
  }, [initializeWalletConnection, handleWalletDisconnect]);

  useEffect(() => {
    initializeWalletConnection();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleWalletDisconnect);
      }
    };
  }, [initializeWalletConnection, handleAccountsChanged, handleWalletDisconnect]);

  useEffect(() => {
    if (walletAddress && provider) {
      const filter = {
        address: [ARI_ADDRESS, USDT_ADDRESS],
        topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      };

      provider.on(filter, (log, event) => {
        getBalances();
      });

      return () => {
        provider.off(filter);
      };
    }
  }, [walletAddress, provider, getBalances]);


  return {
    signer,
    network,
    walletAddress,
    initialized,
    connectToWallet,
    disconnectWallet: handleWalletDisconnect,
    ariBalance,
    usdtBalance,
  };
};