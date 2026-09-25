'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import {
  Sparkles,
  Search,
  Loader2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import GuideSummary from '@/src/modules/ai-guide/components/GuideSummary';
import GettingStarted from '@/src/modules/ai-guide/components/GettingStarted';
import TechnologyExplanation from '@/src/modules/ai-guide/components/TechnologyExplanation';
import FolderGuide from '@/src/modules/ai-guide/components/FolderGuide';
import ContributionRules from '@/src/modules/ai-guide/components/ContributionRules';
import BeginnerTips from '@/src/modules/ai-guide/components/BeginnerTips';
import CommonMistakes from '@/src/modules/ai-guide/components/CommonMistakes';
import { useAiGuide } from '@/src/modules/ai-guide/hooks/use-ai-guide';

function AiGuideContent() {
  const searchParams = useSearchParams();
  const initialRepo = searchParams?.get('repo') || 'https://github.com/facebook/react';

  const [repoUrl, setRepoUrl] = useState(initialRepo);
  const { loading, error, guide, generateGuide } = useAiGuide();

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!repoUrl) return;
    try {
      await generateGuide(repoUrl);
    } catch (err) {
      // Handled in hook
    }
  };

  useEffect(() => {
    if (initialRepo) {
      generateGuide(initialRepo).catch(() => {});
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
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400 bg-violet-950/50 border border-violet-800/40 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Onboarding Guide</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 section-badge mx-auto">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span>AI Developer Guide</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Repository Onboarding & Contribution Guide
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            AI-synthesized onboarding guidance grounded strictly on real repository intelligence (RIO). Clear setup steps, architecture explanations, and maintainer standards.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 glass-card space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="https://github.com/owner/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="repo-input pl-10"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-cyan flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Guide</span>
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
            <Loader2 className="w-10 h-10 animate-spin text-violet-400 mx-auto" />
            <p className="text-slate-400 animate-pulse text-sm">
              Analyzing repository intelligence and synthesizing onboarding guide...
            </p>
          </div>
        )}

        {/* Guide Content */}
        {guide && !loading && (
          <div className="space-y-6">
            <GuideSummary overview={guide.overview} repositoryName={repoUrl} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GettingStarted gettingStarted={guide.gettingStarted} />
              <TechnologyExplanation techStack={guide.techStack} primaryRole={guide.primaryRole} />
            </div>

            <FolderGuide repositoryStructure={guide.repositoryStructure} importantFiles={guide.importantFiles} />

            <ContributionRules rules={guide.rules} guidance={guide.contributionGuidance} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BeginnerTips tips={guide.beginnerTips} />
              <CommonMistakes mistakes={guide.commonMistakes} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function AiGuidePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center font-mono text-sm">
          Loading AI Repository Guide...
        </div>
      }
    >
      <AiGuideContent />
    </Suspense>
  );
}
