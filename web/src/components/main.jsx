import React, { useState, useEffect } from 'react';
import COINS from './coins';
import { useWalletService } from '../services/walletService';
import './main.css';

function UniswapLike() {
  const { 
    signer, 
    network, 
    walletAddress, 
    initialized, 
    connectToWallet, 
    disconnectWallet 
  } = useWalletService();

  const [sellToken, setSellToken] = useState(COINS[0].symbol);
  const [buyToken, setBuyToken] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");

  const handleConnectWallet = async () => {
    await connectToWallet();
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
  };

  useEffect(() => {
    if (sellAmount && sellToken && buyToken) {
      const mockRate = 0.95;
      setBuyAmount((sellAmount * mockRate).toFixed(2));
    }
  }, [sellAmount, sellToken, buyToken]);

  return (
    <div className="middle-container">
      <header>
        <div className="logo">ARIWallet</div>
        <div className="header-right">
          <div className="search">
            <input type="text" placeholder="Search tokens" />
          </div>
          <div className="actions">
            {initialized && walletAddress ? (
              <button onClick={handleDisconnectWallet}>
                Disconnect ({walletAddress.slice(0, 6)}...{walletAddress.slice(-4)})
              </button>
            ) : (
              <button onClick={handleConnectWallet}>Connect Wallet</button>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className="swap-box">
          <h2>Arı gibi çalışıyoruz, bize güvenebilirsiniz.</h2>
          <div className="sell-section">
            <label htmlFor="sell-amount">Sell</label>
            <input
              type="number"
              id="sell-amount"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
            />
            <select
              value={sellToken}
              onChange={(e) => setSellToken(e.target.value)}
            >
              {COINS.map((coin) => (
                <option key={coin.symbol} value={coin.symbol}>
                  {coin.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="arrow-down">↓</div>
          <div className="buy-section">
            <label htmlFor="buy-amount">Buy</label>
            <input type="number" id="buy-amount" value={buyAmount} readOnly />
            <select
              value={buyToken}
              onChange={(e) => setBuyToken(e.target.value)}
            >
              <option value="" disabled hidden>
                Select a token
              </option>
              {COINS.map((coin) => (
                <option key={coin.symbol} value={coin.symbol}>
                  {coin.symbol}
                </option>
              ))}
            </select>
          </div>
          <button className="get-started-button" disabled={!initialized || !sellAmount || !buyAmount}>
            Swap (Disabled)
          </button>
        </div>
      </main>
    </div>
  );
}

export default UniswapLike;
