import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function GuideSummary({ overview = '', repositoryName = '' }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-dark-800 to-cyan-950/40 border border-violet-500/20 space-y-3 glass-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-violet-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-semibold text-white">AI Developer Onboarding Overview</h3>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
          Grounded on RIO
        </span>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">
        {overview || `Welcome to ${repositoryName || 'the repository'}. This guide was synthesized using real repository intelligence.`}
      </p>
    </div>
  );
}
