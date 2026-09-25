import React from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon } from 'lucide-react';

export default function RiskLevel({ level = 'LOW', score = 20, summary = '' }) {
  const isHigh = level === 'HIGH';
  const isMedium = level === 'MEDIUM';

  return (
    <div className={`p-6 rounded-2xl border glass-card ${
      isHigh
        ? 'bg-rose-950/20 border-rose-500/30'
        : isMedium
        ? 'bg-amber-950/20 border-amber-500/30'
        : 'bg-emerald-950/20 border-emerald-500/30'
    }`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            {isHigh && <AlertOctagon className="w-5 h-5 text-rose-400" />}
            {isMedium && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {!isHigh && !isMedium && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Semantic Merge Risk</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isHigh ? 'High Merge Conflict & Coupling Risk' : isMedium ? 'Moderate Merge Risk' : 'Low Semantic Merge Risk'}
          </h2>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            {summary || 'Analysis evaluates textual overlap, shared dependencies, module couplings, and schema modifications.'}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-dark-900/80 border border-white/10 shrink-0 min-w-[120px]">
          <span className={`text-4xl font-extrabold font-mono ${
            isHigh ? 'text-rose-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {score}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase mt-1">Risk Index (0-100)</span>
        </div>
      </div>
    </div>
  );
}
