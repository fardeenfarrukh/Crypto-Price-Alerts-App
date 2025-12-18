// backend/services/CoinGecko.js
import fetch from "node-fetch"; 

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.COINGECKO_API_KEY; 

export async function fetchTopCoins() {
  try {
    const endpoint = `${COINGECKO_API}/coins/markets`;
    const query =
      "?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=true&price_change_percentage=24h";

    const headers = API_KEY ? { "x-cg-pro-api-key": API_KEY } : {};

    const res = await fetch(endpoint + query, { headers });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`CoinGecko responded with ${res.status}: ${text}`);
    }

    const coins = await res.json();
    return coins;
  } catch (err) {
    console.error("fetchTopCoins failed:", err.message);
    return [];
  }
}
