// frontend/src/components/AlertForm.jsx

import React, { useState } from "react";
import { X, Bell } from "lucide-react";


const AlertForm = ({ onClose, onAlertCreated }) => {
  const [coinId, setCoinId] = useState("bitcoin");
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState("above");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const resetForm = () => {
    setTargetPrice("");
    setEmail("");
    setPhoneNumber("");
    setDirection("above");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const alert = {
      coinId,
      targetPrice: Number(targetPrice),
      direction: direction.toUpperCase(), 
      email,
      phoneNumber,
      createdAt: Date.now(),
      triggered: false,
    };

    try {
      const res = await fetch("http://localhost:3000/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      });
      const data = await res.json();
      console.log("✅ Alert saved:", data);

      onAlertCreated?.((prev) => [...prev, { ...alert, id: data.id }]);

      resetForm();
    } catch (err) {
      console.error("❌ Something went wrong saving the alert:", err.message);
    }
  };

  const Field = ({ label, children }) => (
    <div>
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      {/* main card container */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* header bar with title + close button */}
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Create Alert</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* the actual form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* coin + direction side by side */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Coin">
              <select value={coinId} onChange={(e) => setCoinId(e.target.value)} required
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none">
                <option value="bitcoin">BTC</option>
                <option value="ethereum">ETH</option>
                <option value="tether">USDT</option>
                <option value="binancecoin">BNB</option>
              </select>
            </Field>
            <Field label="Direction">
              <select value={direction} onChange={(e) => setDirection(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none">
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
            </Field>
          </div>

          {/* target price field */}
          <Field label="Target Price">
            <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} required placeholder="Enter price..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" />
          </Field>

          {/* contact info */}
          <Field label="Email (optional)">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com"
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none placeholder:text-slate-600" />
          </Field>
          <Field label="Phone (optional)">
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 000-0000"
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none placeholder:text-slate-600" />
          </Field>

          {/* save button */}
          <button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform active:scale-95 uppercase tracking-widest">
            Save Alert
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlertForm;
