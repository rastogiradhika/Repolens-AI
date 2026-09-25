import React from 'react';
import { GitFork, Star, Globe, Lock, Clock, GitCommit } from 'lucide-react';

export default function RepositoryHeader({ metadata, analysisContext }) {
  if (!metadata) return null;

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white tracking-tight">{metadata.fullName || metadata.name}</span>
            {metadata.isPrivate ? (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lock className="w-3 h-3" /> Private
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Globe className="w-3 h-3" /> Public
              </span>
            )}
            {metadata.isFork && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <GitFork className="w-3 h-3" /> Fork
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {metadata.description || 'No repository description provided.'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-2 rounded-xl bg-dark-900/80 border border-white/5 flex items-center gap-2 text-slate-300">
            <Star className="w-4 h-4 text-amber-400" />
            <span>{typeof metadata.stars === 'number' ? metadata.stars.toLocaleString() : 'N/A'}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-dark-900/80 border border-white/5 flex items-center gap-2 text-slate-300">
            <GitCommit className="w-4 h-4 text-cyan-400" />
            <span className="truncate max-w-[120px]">{analysisContext?.commitSha?.slice(0, 7) || 'latest'}</span>
          </div>
          {analysisContext?.analyzedAt && (
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(analysisContext.analyzedAt).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
