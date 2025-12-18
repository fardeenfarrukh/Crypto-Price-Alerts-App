// backend/services/WebSocket.js

const symbolMap = {
  btc: "bitcoin",
  eth: "ethereum",
  usdt: "tether",
  bnb: "binancecoin",
};

export function startPriceStream(onUpdate) {
  try {
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/!miniTicker@arr");

    socket.onmessage = (event) => {
      try {
        const tickers = JSON.parse(event.data);
        const updates = {};

        tickers.forEach((ticker) => {
          if (ticker.s && ticker.s.endsWith("USDT")) {
            const symbol = ticker.s.replace("USDT", "").toLowerCase();
            const coinId = symbolMap[symbol];
            if (coinId) {
              updates[coinId] = parseFloat(ticker.c);
            }
          }
        });

        onUpdate(updates);
      } catch (err) {
        console.error("WebSocket message parse error:", err.message);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err.message);
    };

    return () => {
      console.log("Closing Binance WebSocket stream...");
      socket.close();
    };
  } catch (err) {
    console.error("Failed to start WebSocket stream:", err.message);
    return () => {};
  }
}
