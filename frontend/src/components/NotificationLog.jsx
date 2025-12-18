// frontend/src/components/NotificationLog.jsx

import React from "react";
import { Bell, CheckCircle2, AlertCircle } from "lucide-react";

const NotificationLog = ({ logs }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
      
      {/* Top bar with title */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-xs text-slate-300 uppercase tracking-widest">
            Live Alert Dispatcher
          </h3>
        </div>
      </div>

      {/* Scrollable list of log entries */}
      <div className="p-2 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
        {logs.length === 0 ? (
          <div className="py-20 text-center text-slate-700">
            <p className="text-xs font-medium italic">
              History is clean. Monitoring active...
            </p>
          </div>
        ) : (
          logs.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 transition-all hover:bg-slate-800/50"
            >
              {/* left side: status icon (green for sent, red for failed) */}
              <div
                className={`mt-1 p-2 rounded-full ${
                  entry.status === "SENT"
                    ? "bg-emerald-500/10"
                    : "bg-rose-500/10"
                }`}
              >
                {entry.status === "SENT" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
              </div>

              {/* right side: details about the notification */}
              <div className="flex-1">
                {/* top row: method + status + timestamp */}
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      entry.status === "SENT"
                        ? "text-slate-400"
                        : "text-rose-400"
                    }`}
                  >
                    {entry.method} {entry.status}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {/* message body */}
                <p className="text-xs text-slate-300 font-medium">
                  {entry.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationLog;
