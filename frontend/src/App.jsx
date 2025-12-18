// frontend/src/App.jsx

import React, { useState, useEffect, useMemo } from "react";
import "./App.css";

import Header from "./components/Header";
import MarketList from "./components/MarketList";
import PriceChart from "./components/PriceChart";
import AlertForm from "./components/AlertForm";
import NotificationLog from "./components/NotificationLog";
import AlertStatus from "./components/AlertStatus";

const API_BASE = "http://localhost:3000";
const PRICE_POLL_MS = 5000;

export default function App() {
  const [query, setQuery] = useState("");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCoin, setActiveCoin] = useState(null);
  const [prices, setPrices] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  const selectedCoin = useMemo(() => {
    return coins.find((c) => c.id === activeCoin) || null;
  }, [coins, activeCoin]);

  useEffect(() => {
    let cancelled = false;
    async function loadCoins() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/coins`);
        if (!res.ok) throw new Error("Backend coins route not available");
        const data = await res.json();
        if (!cancelled) {
          setCoins(data);
          setLoading(false);
          if (!activeCoin && data.length > 0) setActiveCoin(data[0].id);
        }
      } catch {
        try {
          const res = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h"
          );
          const data = await res.json();
          if (!cancelled) {
            setCoins(data);
            setLoading(false);
            if (!activeCoin && data.length > 0) setActiveCoin(data[0].id);
          }
        } catch (err) {
          console.error("Failed to load coins:", err.message);
          if (!cancelled) setLoading(false);
        }
      }
    }
    loadCoins();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let timerId;
    async function pollPrices() {
      try {
        if (coins.length === 0) return;
        const res = await fetch(`${API_BASE}/api/prices/live`);
        if (res.ok) {
          const live = await res.json();
          setPrices(live || {});
          return;
        }
        const map = {};
        for (const coin of coins) {
          map[coin.id] = coin.current_price;
        }
        setPrices(map);
      } catch {
        const map = {};
        for (const coin of coins) {
          map[coin.id] = coin.current_price;
        }
        setPrices(map);
      }
    }
    pollPrices();
    timerId = setInterval(pollPrices, PRICE_POLL_MS);
    return () => clearInterval(timerId);
  }, [coins]);

  useEffect(() => {
    let cancelled = false;
    async function loadLogs() {
      try {
        const res = await fetch(`${API_BASE}/api/alerts`);
        if (res.ok) {
          const alerts = await res.json();
          if (!cancelled) {
            const entries = alerts.map((a) => ({
              id: a.id || `${a.coinId}-${a.createdAt}`,
              symbol: a.coinId,
              condition: a.direction,
              threshold: a.targetPrice,
              contactInfo: a.email || a.phoneNumber || "N/A",
              notificationMethod: a.email ? "Email" : a.phoneNumber ? "SMS" : "N/A",
              triggered: false,
              timestamp: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
              message: `Alert: ${a.coinId} ${a.direction} ${a.targetPrice}`,
            }));
            setLogs(entries);
          }
        }
      } catch {
      }
    }
    loadLogs();
    return () => {
      cancelled = true;
    };
  }, []);

  async function createAlertOnServer(alert) {
    try {
      const res = await fetch(`${API_BASE}/api/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      });
      const data = await res.json();
      setLogs((prev) => [
        {
          id: data.id || `${alert.coinId}-${Date.now()}`,
          symbol: alert.coinId,
          condition: alert.direction,
          threshold: alert.targetPrice,
          contactInfo: alert.email || alert.phoneNumber || "N/A",
          notificationMethod: alert.email ? "Email" : alert.phoneNumber ? "SMS" : "N/A",
          triggered: false,
          timestamp: new Date().toISOString(),
          message: `Alert: ${alert.coinId} ${alert.direction} ${alert.targetPrice}`,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Failed to save alert:", err.message);
    }
  }

  const filteredCoins = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coins;
    return coins.filter(
      (c) =>
        c.symbol?.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q)
    );
  }, [coins, query]);

  const livePrice = useMemo(() => {
    if (!selectedCoin) return undefined;
    return prices[selectedCoin.id];
  }, [selectedCoin, prices]);

  return (
    <div className="min-h-screen">
      <Header query={query} setQuery={setQuery} openForm={() => setIsFormOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1">
          <MarketList
            coins={filteredCoins}
            prices={prices}
            activeCoin={activeCoin}
            setActiveCoin={setActiveCoin}
            streamStatus={"connected"}
            loading={loading}
          />
        </section>
        <section className="lg:col-span-2 space-y-6">
          <PriceChart coin={selectedCoin} livePrice={livePrice} />
          <AlertStatus
            alerts={logs}
            onRemove={(id) => setLogs((prev) => prev.filter((log) => log.id !== id))}
            socketStatus="connected"
          />
          <NotificationLog logs={logs} />
        </section>
      </main>
      {isFormOpen && (
        <AlertForm
          onClose={() => setIsFormOpen(false)}
          onAlertCreated={(add) => {
            const last = typeof add === "function" ? add([]).slice(-1)[0] : null;
            if (last) {
              createAlertOnServer(last);
            }
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}
