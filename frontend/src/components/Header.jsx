// frontend/src/components/Header.jsx

import React from "react";
import { Search, Plus, Activity } from "lucide-react";

const Header = ({ query, setQuery, openForm }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Left side: logo + app name */}
        <div className="flex items-center gap-4">
          {/* little icon box */}
          <div className="bg-blue-600 p-2 rounded-xl shadow-inner">
            <Activity className="w-5 h-5 text-white" />
          </div>
          {/* text branding */}
          <div className="flex flex-col leading-tight">
            <h1 className="text-xl font-black tracking-wide text-white">
              Crypto Price Alerts
            </h1>
            <p className="text-xs text-slate-400 uppercase">
              Real‑Time Monitoring Service
            </p>
          </div>
        </div>

        {/* Right side: search bar + button */}
        <div className="flex items-center gap-4">
          {/* search input (hidden on very small screens) */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter symbols..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-48 lg:w-64 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* button to open the "New Alert" form */}
          <button
            onClick={openForm}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Alert
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
