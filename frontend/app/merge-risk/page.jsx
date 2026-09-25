'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import {
  GitMerge,
  Search,
  Loader2,
  AlertOctagon,
  ArrowLeft,
  ArrowRight,
  GitBranch,
  RefreshCw,
} from 'lucide-react';
import RiskLevel from '@/src/modules/merge-risk/components/RiskLevel';
import RiskReasons from '@/src/modules/merge-risk/components/RiskReasons';
import AffectedModules from '@/src/modules/merge-risk/components/AffectedModules';
import PullRequestComparison from '@/src/modules/merge-risk/components/PullRequestComparison';
import RiskRecommendations from '@/src/modules/merge-risk/components/RiskRecommendations';
import { useMergeRisk } from '@/src/modules/merge-risk/hooks/use-merge-risk';

function MergeRiskContent() {
  const searchParams = useSearchParams();
  const initialRepo = searchParams?.get('repo') || 'https://github.com/facebook/react';
  const initialPr = searchParams?.get('pr') || '1';

  const [repoUrl, setRepoUrl] = useState(initialRepo);
  const [prNumber, setPrNumber] = useState(initialPr);
  const [targetBranch, setTargetBranch] = useState('main');

  const { loading, error, riskData, evaluateRisk } = useMergeRisk();

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!repoUrl || !prNumber) return;
    try {
      await evaluateRisk(repoUrl, prNumber, targetBranch);
    } catch (err) {
      // Handled in hook
    }
  };

  useEffect(() => {
    if (initialRepo && initialPr) {
      evaluateRisk(initialRepo, initialPr, targetBranch).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-8">
        {/* Navigation & Status */}
        <div className="flex items-center justify-between">
          <Link href="/repository-intelligence" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Intelligence
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-3 py-1 rounded-full">
            <GitMerge className="w-3.5 h-3.5" />
            <span>Semantic Risk Engine Active</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 section-badge mx-auto">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Semantic Merge Risk Analyzer</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Merge Conflict & Collision Predictor
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Distinguish superficial textual overlaps from deep semantic architectural collisions, modified interfaces, and database schema mutations.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 glass-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 space-y-1.5">
              <label className="text-xs text-slate-400 font-mono">REPOSITORY URL</label>
              <input
                type="text"
                placeholder="https://github.com/owner/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="repo-input"
                required
              />
            </div>
            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs text-slate-400 font-mono">PR NUMBER</label>
              <input
                type="number"
                placeholder="e.g. 1"
                min="1"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                className="repo-input"
                required
              />
            </div>
            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs text-slate-400 font-mono">TARGET BRANCH</label>
              <input
                type="text"
                placeholder="main"
                value={targetBranch}
                onChange={(e) => setTargetBranch(e.target.value)}
                className="repo-input"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-cyan flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitMerge className="w-4 h-4" />}
              <span>Analyze Merge Risk</span>
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mx-auto" />
            <p className="text-slate-400 animate-pulse text-sm">
              Tracing dependency graph, inspecting file overlaps, and computing semantic merge risk...
            </p>
          </div>
        )}

        {/* Results */}
        {riskData && !loading && (
          <div className="space-y-6">
            <RiskLevel
              level={riskData.riskLevel}
              score={riskData.riskScore}
              summary={riskData.summary}
            />

            <PullRequestComparison
              pullRequest={riskData.pullRequest}
              targetBranch={riskData.targetBranch}
              concurrentOpenPrs={riskData.concurrentOpenPrs}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RiskReasons reasons={riskData.reasons} />
              <RiskRecommendations recommendations={riskData.recommendations} />
            </div>

            <AffectedModules modules={riskData.affectedModules} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function MergeRiskPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center font-mono text-sm">
          Loading Merge Risk Predictor...
        </div>
      }
    >
      <MergeRiskContent />
    </Suspense>
  );
}
