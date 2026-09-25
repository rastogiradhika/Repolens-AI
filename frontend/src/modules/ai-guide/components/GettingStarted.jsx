import React from 'react';
import { PlayCircle, Terminal, CheckCircle2 } from 'lucide-react';

export default function GettingStarted({ gettingStarted = [], setupInstructions = [] }) {
  const steps = Array.isArray(gettingStarted) ? gettingStarted : (gettingStarted ? [gettingStarted] : []);
  const allSteps = steps.length > 0 ? steps : setupInstructions;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center gap-2.5 text-cyan-400">
        <PlayCircle className="w-5 h-5" />
        <h3 className="font-semibold text-white">Getting Started</h3>
      </div>

      {allSteps.length > 0 ? (
        <div className="space-y-3">
          {allSteps.map((step, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-dark-900 border border-white/5 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">{step}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">Run standard package installation commands to bootstrap the repository.</p>
      )}
    </div>
  );
}
