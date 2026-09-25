import React from 'react';
import { GitPullRequest, GitCommit, FileCode, CheckSquare } from 'lucide-react';

export default function ReadinessChecklist({ pr, changedFiles = [] }) {
  if (!pr) return null;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-400">
          <GitPullRequest className="w-5 h-5" />
          <h3 className="font-semibold text-white">Pull Request Metadata & Files</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">PR #{pr.number}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-dark-900 border border-white/5">
          <span className="text-slate-500 font-mono text-[10px]">HEAD BRANCH</span>
          <p className="font-mono text-cyan-300 truncate mt-1">{pr.headBranch}</p>
        </div>
        <div className="p-3 rounded-lg bg-dark-900 border border-white/5">
          <span className="text-slate-500 font-mono text-[10px]">BASE BRANCH</span>
          <p className="font-mono text-slate-300 truncate mt-1">{pr.baseBranch}</p>
        </div>
        <div className="p-3 rounded-lg bg-dark-900 border border-white/5">
          <span className="text-slate-500 font-mono text-[10px]">FILES CHANGED</span>
          <p className="font-mono text-white mt-1">{pr.changedFilesCount || changedFiles.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-dark-900 border border-white/5">
          <span className="text-slate-500 font-mono text-[10px]">NET DIFF</span>
          <p className="font-mono mt-1">
            <span className="text-emerald-400">+{pr.additions || 0}</span> / <span className="text-rose-400">-{pr.deletions || 0}</span>
          </p>
        </div>
      </div>

      {changedFiles.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono text-slate-400">TOUCHED FILES</span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {changedFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-dark-900 border border-white/5 text-xs font-mono">
                <span className="text-slate-300 truncate max-w-sm">{file.filename}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  file.status === 'added' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-dark-800'
                }`}>
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
