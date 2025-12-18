// frontend/src/components/PriceChart.jsx

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import { Globe } from "lucide-react";

const PriceChart = ({ coin, livePrice }) => {
  if (!coin) return null;

  const displayPrice = livePrice || coin.current_price;
  const priceTrend = coin.price_change_percentage_24h;

  const chartData =
    coin.sparkline_in_7d?.price.map((value, index) => ({
      price: value,
      index,
    })) || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      
      {/* faint background icon for decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Globe className="w-24 h-24 text-blue-500" />
      </div>

      {/* header with coin name, live tag, price, and trend badge */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            {coin.name}
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-500 font-mono uppercase tracking-tighter">
              Live_Tick
            </span>
          </h2>
          <div className="flex items-center gap-4">
            {/* current price */}
            <span className="text-3xl font-mono text-blue-500 font-black tracking-tighter">
              ${displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            {/* trend badge: green up arrow if positive, red down arrow if negative */}
            <span
              className={`px-2 py-1 rounded-lg text-xs font-black ${
                priceTrend >= 0
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              {priceTrend >= 0 ? "▲" : "▼"} {Math.abs(priceTrend).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* chart area showing 7-day sparkline */}
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            {/* gradient fill under the line */}
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* grid lines */}
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1e293b" />
            {/* hide axes, we only care about the line */}
            <XAxis hide dataKey="index" />
            <YAxis hide domain={["auto", "auto"]} />
            {/* tooltip when hovering over points */}
            <ChartTooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                fontSize: "10px",
              }}
              itemStyle={{ color: "#60a5fa" }}
              labelStyle={{ display: "none" }}
            />
            {/* the line itself */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={3}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
