async function fetchPrice(coin) {
    try {
      const response = await fetch(`/api/v3/simple/price?ids=${coin.coingeckoId}&vs_currencies=usd`);
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error ${response.status}: ${errorData?.error || response.statusText}`);
        }
      const data = await response.json();
  
      if (data && data[coin.coingeckoId] && data[coin.coingeckoId].usd) {
        return data[coin.coingeckoId].usd;
      } else {
        console.error("Invalid response format:", data);
        throw new Error(`Price data not found for ${coin.symbol}`);
      }
    } catch (error) {
      console.error("Error fetching price for", coin.symbol, ":", error);
      return null;
    }
  }
  
  export default fetchPrice;