import React, { useState, useEffect } from 'react';
import COINS from './coins';
import './main.css';
import fetchPrice from '../utils/priceUtils';

function UniswapLike() {
  const [sellToken, setSellToken] = useState(COINS[0].symbol);
  const [buyToken, setBuyToken] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [prices, setPrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    async function getPrices() {
      setLoadingPrices(true);
      const newPrices = {};
      for (const coin of COINS) {
        const price = await fetchPrice(coin);
        if (price) {
          newPrices[coin.symbol] = price;
        }
      }
      setPrices(newPrices);
      setLoadingPrices(false);
    }

    getPrices();
  }, []);

  useEffect(() => {
    calculateBuyAmount();
  }, [sellToken, buyToken, sellAmount, prices, loadingPrices]);

  const calculateBuyAmount = () => {
    if (loadingPrices) return;

    if (sellAmount && prices[sellToken] && prices[buyToken]) {
      const sellValue = parseFloat(sellAmount) * prices[sellToken];
      const buyValue = sellValue / prices[buyToken];
      setBuyAmount(buyValue.toFixed(6));
    } else {
      setBuyAmount("");
    }
  };

  return (
    <div className="middle-container">
      <header>
        <div className="logo">ARIWallet</div>
        <div className="header-right">
          <div className="search">
            <input type="text" placeholder="Search tokens" />
          </div>
          <div className="actions">
            <button>Connect Wallet</button>
          </div>
        </div>
      </header>
      <main>
        <div className="swap-box">
          <h2>Arı gibi çalışıyoruz bize güvenebilirsiniz.</h2>
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
          <button className="get-started-button">Swap (Disabled)</button>
        </div>
      </main>
    </div>
  );
}

export default UniswapLike;