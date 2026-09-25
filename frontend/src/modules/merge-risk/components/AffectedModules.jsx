import React from 'react';
import { Layers, AlertTriangle } from 'lucide-react';

export default function AffectedModules({ modules = [] }) {
  if (!modules || modules.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-400">
          <Layers className="w-5 h-5" />
          <h3 className="font-semibold text-white">Coupled Architectural Modules</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">{modules.length} Modules Affected</span>
      </div>

      <div className="space-y-3">
        {modules.map((mod, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-dark-900 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-300 font-semibold">📁 {mod.name}</span>
                {mod.hasCriticalChanges && (
                  <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="w-3 h-3" /> Critical File
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400">{mod.layer}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {mod.files.map((file, fIdx) => (
                <span key={fIdx} className="text-[11px] font-mono text-slate-400 bg-dark-800 px-2 py-0.5 rounded border border-white/5 truncate max-w-xs">
                  {file}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
