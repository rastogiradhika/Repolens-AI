import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function RiskRecommendations({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center gap-2 text-emerald-400">
        <CheckCircle2 className="w-5 h-5" />
        <h3 className="font-semibold text-white">Safe Merge Recommendations</h3>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-dark-900 border border-white/5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
