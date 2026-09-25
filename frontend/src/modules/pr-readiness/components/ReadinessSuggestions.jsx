import React from 'react';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ReadinessSuggestions({ suggestions = [] }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center gap-2 text-cyan-400">
        <AlertCircle className="w-5 h-5" />
        <h3 className="font-semibold text-white">Actionable Pre-Submission Suggestions</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border space-y-1.5 ${
              item.severity === 'critical'
                ? 'bg-rose-950/20 border-rose-500/30'
                : item.severity === 'warning'
                ? 'bg-amber-950/20 border-amber-500/30'
                : item.severity === 'success'
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-dark-900 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs text-white">{item.title}</h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                item.severity === 'critical'
                  ? 'bg-rose-500/10 text-rose-400'
                  : item.severity === 'warning'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {item.severity}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{item.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
