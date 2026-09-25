import React from 'react';
import { AlertOctagon } from 'lucide-react';

export default function CommonMistakes({ mistakes = [] }) {
  const defaultMistakes = [
    'Submitting changes directly against the main branch without branching.',
    'Omitting test coverage for modified logic paths.',
    'Leaving checklist items incomplete in the PR template.',
    'Introducing large unstructured multi-concern commits.',
  ];

  const items = mistakes && mistakes.length > 0 ? mistakes : defaultMistakes;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center gap-2.5 text-rose-400">
        <AlertOctagon className="w-5 h-5" />
        <h3 className="font-semibold text-white">Common Beginner Pitfalls</h3>
      </div>

      <div className="space-y-2.5">
        {items.map((mistake, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-dark-900 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">{mistake}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
