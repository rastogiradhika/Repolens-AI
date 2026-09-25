'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import {
  ClipboardCheck,
  Search,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  GitPullRequest,
  RefreshCw,
} from 'lucide-react';
import ReadinessScore from '@/src/modules/pr-readiness/components/ReadinessScore';
import ScoreBreakdown from '@/src/modules/pr-readiness/components/ScoreBreakdown';
import ReadinessChecklist from '@/src/modules/pr-readiness/components/ReadinessChecklist';
import ReadinessSuggestions from '@/src/modules/pr-readiness/components/ReadinessSuggestions';
import { usePrReadiness } from '@/src/modules/pr-readiness/hooks/use-pr-readiness';

function PRReadinessContent() {
  const searchParams = useSearchParams();
  const initialRepo = searchParams?.get('repo') || 'https://github.com/facebook/react';
  const initialPr = searchParams?.get('pr') || '1';

  const [repoUrl, setRepoUrl] = useState(initialRepo);
  const [prNumber, setPrNumber] = useState(initialPr);

  const {
    loading,
    semanticLoading,
    error,
    readinessData,
    semanticData,
    evaluatePr,
    analyzePrSemantic,
  } = usePrReadiness();

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    if (!repoUrl || !prNumber) return;
    try {
      await Promise.all([
        evaluatePr(repoUrl, prNumber),
        analyzePrSemantic(repoUrl, prNumber),
      ]);
    } catch (err) {
      // Handled in hook
    }
  };

  useEffect(() => {
    if (initialRepo && initialPr) {
      evaluatePr(initialRepo, initialPr).catch(() => {});
      analyzePrSemantic(initialRepo, initialPr).catch(() => {});
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
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Deterministic Scoring Engine</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 section-badge mx-auto">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Pre-PR Readiness & Audit</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Pre-flight Pull Request Readiness
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Audit PR branch conventions, commit standards, template adherence, and test signals deterministically against repository maintainer rules.
          </p>
        </div>

        {/* Evaluation Input */}
        <form onSubmit={handleEvaluate} className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 glass-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 space-y-1.5">
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
            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs text-slate-400 font-mono">PULL REQUEST NUMBER</label>
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
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              Deterministic scoring based on RIO rules (Branch, Commits, PR Template, Tests).
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-cyan flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
              <span>Audit Pull Request</span>
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
              Fetching PR commits, diff files, and repository rules to evaluate readiness score...
            </p>
          </div>
        )}

        {/* Evaluation Output */}
        {readinessData && !loading && (
          <div className="space-y-6">
            <ReadinessScore score={readinessData.score} verdict={readinessData.verdict} />

            {/* Semantic PR Analyzer Card */}
            {semanticData && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-dark-800 to-dark-800 border border-cyan-500/20 space-y-4 glass-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-semibold text-white">Semantic PR Analyzer</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {semanticData.changeIntent}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {semanticData.behavioralImpact}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-dark-900 border border-white/5 space-y-1">
                    <span className="font-mono text-[10px] text-slate-400">ARCHITECTURAL RISK SIGNALS</span>
                    <ul className="space-y-1 text-slate-300">
                      {semanticData.riskSignals.map((sig, i) => (
                        <li key={i} className="text-[11px]">• {sig}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-dark-900 border border-white/5 space-y-1">
                    <span className="font-mono text-[10px] text-slate-400">MAINTAINER REVIEW FOCUS</span>
                    <ul className="space-y-1 text-slate-300">
                      {semanticData.reviewFocus.map((focus, i) => (
                        <li key={i} className="text-[11px]">• {focus}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <ReadinessChecklist pr={readinessData.pr} changedFiles={readinessData.changedFiles} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScoreBreakdown checks={readinessData.checks} />
              <ReadinessSuggestions suggestions={readinessData.suggestions} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function PRReadinessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center font-mono text-sm">
          Loading Pre-PR Readiness...
        </div>
      }
    >
      <PRReadinessContent />
    </Suspense>
  );
}
