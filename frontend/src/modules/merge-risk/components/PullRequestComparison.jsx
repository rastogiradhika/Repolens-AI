import React from 'react';
import { GitPullRequest, GitMerge, Users } from 'lucide-react';

export default function PullRequestComparison({ pullRequest, targetBranch = 'main', concurrentOpenPrs = [] }) {
  if (!pullRequest) return null;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-400">
          <GitMerge className="w-5 h-5" />
          <h3 className="font-semibold text-white">Target Branch Comparison & Concurrent PRs</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Target: {targetBranch}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-dark-900 border border-white/5 space-y-2">
          <span className="text-[10px] font-mono text-slate-400">ACTIVE PR UNDER ANALYSIS</span>
          <p className="font-medium text-white truncate">PR #{pullRequest.number}: {pullRequest.title}</p>
          <div className="flex items-center gap-2 font-mono text-slate-400 text-[11px]">
            <span>Branch: <code className="text-cyan-400">{pullRequest.headBranch}</code></span>
            <span>Author: @{pullRequest.author}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-900 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">CONCURRENT OPEN PRs</span>
            <span className="text-[10px] font-mono text-cyan-400">{concurrentOpenPrs.length} Active</span>
          </div>
          {concurrentOpenPrs.length > 0 ? (
            <div className="space-y-1">
              {concurrentOpenPrs.map((pr, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[200px]">#{pr.number} {pr.title}</span>
                  <span className="font-mono text-slate-500">@{pr.user}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic">No other open PRs touching this branch.</p>
          )}
        </div>
      </div>
    </div>
  );
}
