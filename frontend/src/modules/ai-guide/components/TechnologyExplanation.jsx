import React from 'react';
import { Cpu, Check } from 'lucide-react';

export default function TechnologyExplanation({ techStack = {}, primaryRole = '' }) {
  const frameworks = techStack.frameworks || [];
  const dependencies = techStack.dependencies || [];

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center gap-2.5 text-blue-400">
        <Cpu className="w-5 h-5" />
        <h3 className="font-semibold text-white">Technology Stack & Architecture</h3>
      </div>

      {primaryRole && (
        <p className="text-xs text-slate-300 leading-relaxed bg-dark-900/60 p-3 rounded-lg border border-white/5">
          {primaryRole}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-slate-400 font-mono">FRAMEWORKS & RUNTIME</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {frameworks.length > 0 ? (
              frameworks.map((fw, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50 font-medium">
                  {fw}
                </span>
              ))
            ) : (
              <span className="text-slate-500">None detected</span>
            )}
          </div>
        </div>

        <div>
          <span className="text-slate-400 font-mono">DISCOVERED LIBRARIES</span>
          <div className="flex flex-wrap gap-1.5 mt-2 max-h-28 overflow-y-auto">
            {dependencies.length > 0 ? (
              dependencies.slice(0, 10).map((dep, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-dark-900 text-slate-300 border border-white/5 font-mono text-[11px]">
                  {dep}
                </span>
              ))
            ) : (
              <span className="text-slate-500">None detected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
