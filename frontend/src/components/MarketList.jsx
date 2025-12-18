// frontend/src/components/MarketList.jsx

import React from "react";

const MarketList = ({ coins, prices, activeCoin, setActiveCoin, streamStatus, loading }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      
      {/* Top bar: stream status indicator */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          WebSocket Stream
        </h2>
        <div className="flex items-center gap-2">
          {/* little dot that glows green when connected, pulses amber otherwise */}
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              streamStatus === "connected"
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                : "bg-amber-500 animate-pulse"
            }`}
          ></div>
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            {streamStatus}
          </span>
        </div>
      </div>

      {/* Scrollable list of coins */}
      <div className="overflow-y-auto h-[calc(100vh-280px)] custom-scrollbar divide-y divide-slate-800/40">
        {loading ? (
          <div className="p-4 text-center text-xs text-slate-500 uppercase font-bold animate-pulse">
            Loading Markets...
          </div>
        ) : (
          coins.map((coin) => {
            const livePrice = prices[coin.symbol.toLowerCase()];
            const displayPrice = livePrice || coin.current_price;

            return (
              <button
                key={coin.id}
                onClick={() => setActiveCoin(coin.id)}
                className={`w-full flex items-center justify-between p-4 hover:bg-slate-800/40 transition-all border-l-4 ${
                  activeCoin === coin.id
                    ? "bg-slate-800/80 border-blue-600"
                    : "border-transparent"
                }`}
              >
                {/* left side: coin icon + symbol */}
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                  <p className="text-xs font-black text-slate-100 uppercase">
                    {coin.symbol}
                  </p>
                </div>

                {/* right side: price + 24h change */}
                <div className="text-right">
                  <p
                    className={`text-xs font-mono font-bold transition-colors ${
                      livePrice ? "text-blue-400" : "text-slate-500"
                    }`}
                  >
                    ${displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p
                    className={`text-[9px] font-bold ${
                      coin.price_change_percentage_24h >= 0
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MarketList;
