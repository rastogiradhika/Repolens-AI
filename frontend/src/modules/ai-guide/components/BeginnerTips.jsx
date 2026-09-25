import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function BeginnerTips({ tips = [] }) {
  const defaultTips = [
    'Create a dedicated feature branch for each change rather than committing directly to main.',
    'Verify that your local node version matches the repository engines constraint in package.json.',
    'Run the local test suite and linter before opening a pull request.',
  ];

  const items = tips && tips.length > 0 ? tips : defaultTips;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center gap-2.5 text-amber-400">
        <Lightbulb className="w-5 h-5" />
        <h3 className="font-semibold text-white">Beginner Tips & Workflow Insights</h3>
      </div>

      <div className="space-y-2.5">
        {items.map((tip, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-dark-900 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
