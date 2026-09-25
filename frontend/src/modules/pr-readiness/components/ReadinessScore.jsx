import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export default function ReadinessScore({ score = 0, verdict = 'NEEDS_ATTENTION' }) {
  const isNeedsReview = verdict === 'NEEDS_REVIEW';
  const isReady = !isNeedsReview && score >= 80;
  const isWarning = !isNeedsReview && score >= 50 && score < 80;

  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 glass-card flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          {isNeedsReview && <AlertTriangle className="w-5 h-5 text-amber-400" />}
          {isReady && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
          {!isReady && !isWarning && !isNeedsReview && <XCircle className="w-5 h-5 text-rose-400" />}
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Deterministic Readiness</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          {isNeedsReview && 'Manual Review Required'}
          {isReady && 'Review Ready'}
          {isWarning && 'Action Recommended'}
          {!isReady && !isWarning && !isNeedsReview && 'Not Ready for Submission'}
        </h2>
        <p className="text-xs text-slate-400 max-w-md">
          {isNeedsReview
            ? 'No automated repository contribution rules detected in RIO. Maintainer manual review is required.'
            : 'Calculated from repository contribution rules, branch convention adherence, commit standards, and test signals.'}
        </p>
      </div>

      {/* Circular Gauge */}
      <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="transparent"
            stroke={isReady ? '#34d399' : isWarning || isNeedsReview ? '#fbbf24' : '#f43f5e'}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={isNeedsReview ? 0 : strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white font-mono">
            {isNeedsReview ? 'N/A' : score}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {isNeedsReview ? 'Unscored' : '/ 100'}
          </span>
        </div>
      </div>
    </div>
  );
}
