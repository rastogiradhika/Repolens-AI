import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function RiskReasons({ reasons = [] }) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center gap-2 text-cyan-400">
        <AlertCircle className="w-5 h-5" />
        <h3 className="font-semibold text-white">Identified Risk Signals & Root Causes</h3>
      </div>

      <div className="space-y-3">
        {reasons.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border space-y-1 ${
              item.level === 'HIGH'
                ? 'bg-rose-950/30 border-rose-500/20'
                : item.level === 'MEDIUM'
                ? 'bg-amber-950/30 border-amber-500/20'
                : 'bg-dark-900 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-white">{item.signal}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                item.level === 'HIGH'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : item.level === 'MEDIUM'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {item.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
