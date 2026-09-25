import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export default function CommandsCard({ setupInstructions = [], workflows = {} }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hasCommands = setupInstructions && setupInstructions.length > 0;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-cyan-400">
          <Terminal className="w-5 h-5" />
          <h3 className="font-semibold text-white">Detected Setup & Execution Commands</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          {workflows?.hasTests && <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Tests Active</span>}
          {workflows?.hasLinting && <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Linter Active</span>}
        </div>
      </div>

      {hasCommands ? (
        <div className="space-y-2">
          {setupInstructions.map((cmd, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-dark-900 border border-white/5 font-mono text-xs text-slate-300 group hover:border-cyan-500/30 transition-colors"
            >
              <span className="truncate">{cmd}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(cmd, i)}
                className="text-slate-500 group-hover:text-cyan-400 transition-colors p-1"
                aria-label="Copy command"
              >
                {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-dark-900/50 border border-white/5 text-center text-xs text-slate-500">
          No explicit CLI setup commands extracted from documentation.
        </div>
      )}
    </div>
  );
}
