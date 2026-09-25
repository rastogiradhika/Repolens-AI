import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from 'lucide-react';

export default function ScoreBreakdown({ checks = [] }) {
  const getIcon = (status) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'FAIL':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <MinusCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'PASS':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'WARNING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'FAIL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <h3 className="font-semibold text-white text-sm">Automated Readiness Verification Breakdown</h3>

      <div className="space-y-3">
        {checks.map((check) => (
          <div
            key={check.id}
            className="p-3.5 rounded-xl bg-dark-900 border border-white/5 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {getIcon(check.status)}
                <span className="font-medium text-xs text-white">{check.name}</span>
                <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-dark-800">
                  {check.category}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getBadgeStyle(check.status)}`}>
                {check.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 pl-6 leading-relaxed">{check.message}</p>
            {check.evidence && (
              <div className="pl-6 text-[11px] font-mono text-slate-500">
                Evidence: {check.evidence}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
