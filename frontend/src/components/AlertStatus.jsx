// frontend/src/components/AlertStatus.jsx

import React from "react";
import { Database, Trash2, Mail, MessageSquare, Clock } from "lucide-react";

const AlertStatus = ({
  alerts: activeAlerts = [],   
  onRemove: handleDelete = () => {}, 
  socketStatus: wsHealth = "offline", 
}) => {
  return (
    <div className="space-y-6">
      
      {/* Active Monitors section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        {/* header row with title + count */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">
            Active Monitors
          </h3>
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] text-blue-500 font-bold">
              {activeAlerts.length}
            </span>
          </div>
        </div>

        {/* list of alerts */}
        <div className="space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                No active watchers
              </p>
            </div>
          ) : (
            activeAlerts.map(({ id, symbol, condition, threshold, contactInfo, notificationMethod, triggered }) => {
              const conditionBadge =
                condition === "ABOVE"
                  ? { text: "TARGET >=", style: "bg-blue-500/10 text-blue-400" }
                  : { text: "TARGET <=", style: "bg-amber-500/10 text-amber-400" };

              return (
                <div
                  key={id}
                  className={`p-4 rounded-xl border transition-all ${
                    triggered
                      ? "bg-slate-800/20 border-slate-800 opacity-40"
                      : "bg-slate-800 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  {/* top row: coin + badge + delete button */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-100 uppercase">
                        {symbol}
                      </span>
                      <span
                        className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${conditionBadge.style}`}
                      >
                        {conditionBadge.text}
                      </span>
                    </div>
                    <button
                      onClick={() => id && handleDelete(id)}
                      className="text-slate-600 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* threshold value */}
                  <p className="text-lg font-mono font-black text-white mb-3">
                    ${threshold?.toLocaleString()}
                  </p>

                  {/* bottom row: contact info + status */}
                  <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                    <div className="flex items-center gap-2">
                      {notificationMethod === "Email" ? (
                        <Mail className="w-3 h-3" />
                      ) : (
                        <MessageSquare className="w-3 h-3" />
                      )}
                      <span className="truncate max-w-[80px]">{contactInfo}</span>
                    </div>
                    {triggered ? (
                      <span className="text-emerald-500">FIRED</span>
                    ) : (
                      <span className="text-blue-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Infrastructure health section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
          Cloud Infrastructure
        </h4>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Firebase Store</span>
          <span className="text-blue-500 font-bold uppercase tracking-widest">
            Connected
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">WebSocket Node</span>
          <span className="text-emerald-500 font-bold uppercase tracking-widest">
            {wsHealth}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertStatus;
