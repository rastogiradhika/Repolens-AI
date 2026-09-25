import React from 'react';
import { ShieldCheck, GitBranch, MessageSquare, CheckSquare } from 'lucide-react';

export default function ContributionRules({ rules = {}, guidance = '' }) {
  const branchRules = rules.branchRules || [];
  const commitRules = rules.commitRules || [];
  const prRules = rules.pullRequestRules || [];

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center gap-2.5 text-emerald-400">
        <ShieldCheck className="w-5 h-5" />
        <h3 className="font-semibold text-white">Contribution Standards</h3>
      </div>

      {guidance && (
        <p className="text-xs text-slate-300 leading-relaxed bg-dark-900/60 p-3 rounded-lg border border-white/5">
          {guidance}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Branch Rules */}
        <div className="p-3.5 rounded-xl bg-dark-900 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-medium">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Branch Conventions</span>
          </div>
          {branchRules.length > 0 ? (
            <ul className="space-y-1 text-slate-400">
              {branchRules.map((r, i) => (
                <li key={i} className="text-[11px]">• {r}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-[11px]">Use prefix branches (feat/, fix/).</p>
          )}
        </div>

        {/* Commit Conventions */}
        <div className="p-3.5 rounded-xl bg-dark-900 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-medium">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Commit Conventions</span>
          </div>
          {commitRules.length > 0 ? (
            <ul className="space-y-1 text-slate-400">
              {commitRules.map((r, i) => (
                <li key={i} className="text-[11px]">• {r}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-[11px]">Use Conventional Commits format.</p>
          )}
        </div>

        {/* PR Guidelines */}
        <div className="p-3.5 rounded-xl bg-dark-900 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>PR Guidelines</span>
          </div>
          {prRules.length > 0 ? (
            <ul className="space-y-1 text-slate-400">
              {prRules.map((r, i) => (
                <li key={i} className="text-[11px]">• {r}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-[11px]">Fill PR description and pass CI tests.</p>
          )}
        </div>
      </div>
    </div>
  );
}
