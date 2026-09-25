'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Loader2,
  Sparkles,
  ArrowLeft,
  Code2,
  FileText,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  GitPullRequest,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useRepositoryAnalysis } from '../../src/modules/repository-intelligence/hooks/use-repository-analysis';
import RepositoryHeader from '../../src/modules/repository-intelligence/components/RepositoryHeader';
import RioOverview from '../../src/modules/repository-intelligence/components/RioOverview';
import ImportantFiles from '../../src/modules/repository-intelligence/components/ImportantFiles';
import CommandsCard from '../../src/modules/repository-intelligence/components/CommandsCard';
import IngestionWorkflow from '../../src/modules/repository-intelligence/components/IngestionWorkflow';

function RepositoryIntelligenceContent() {
  const searchParams = useSearchParams();
  const initialRepo = searchParams?.get('repo') || '';

  const [repoUrl, setRepoUrl] = useState(initialRepo);
  const { loading, error, rio: rioData, analyzeRepository } = useRepositoryAnalysis();
  const [activeTab, setActiveTab] = useState('arch-rules'); // 'arch-rules' | 'ast' | 'live-rio'
  const [copiedJson, setCopiedJson] = useState(false);
  const [jsonFilter, setJsonFilter] = useState('');

  const handleAnalyze = async (urlToAnalyze) => {
    const targetUrl = urlToAnalyze || repoUrl;
    if (!targetUrl) return;
    await analyzeRepository(targetUrl);
  };

  const copyRioJson = () => {
    if (!rioData) return;
    navigator.clipboard.writeText(JSON.stringify(rioData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  useEffect(() => {
    if (initialRepo) {
      setRepoUrl(initialRepo);
      handleAnalyze(initialRepo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRepo]);

  const metadata = rioData?.metadata || {};
  const intelligence = rioData?.intelligence || {};
  const analysisContext = rioData?.analysisContext || {};

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/pr-readiness${repoUrl ? `?repo=${encodeURIComponent(repoUrl)}` : ''}`}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline-block font-mono"
            >
              Pre-PR Readiness →
            </Link>
            <Link
              href={`/merge-risk${repoUrl ? `?repo=${encodeURIComponent(repoUrl)}` : ''}`}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline-block font-mono"
            >
              Merge Risk →
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              RIE Engine Active
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <span>REPOSITORY INTELLIGENCE ENGINE (RIE)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
            Repository Intelligence & RIO
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            One deterministic analysis powering three core intelligence views: Architecture & Rules, AST Intelligence, and Live RIO.
          </p>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="https://github.com/facebook/react or vercel/next.js"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="repo-input pl-10"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-cyan flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze Repository'}
          </button>
        </form>

        {/* Quick try samples */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>Quick samples:</span>
          {['facebook/react', 'vitejs/vite', 'tailwindlabs/tailwindcss'].map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => {
                const url = `https://github.com/${slug}`;
                setRepoUrl(url);
                handleAnalyze(url);
              }}
              className="hover:text-cyan-400 underline transition-colors"
            >
              {slug}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mx-auto" />
            <p className="text-slate-400 animate-pulse text-sm">
              Enumerating git tree, inspecting manifests, and synthesizing Repository Intelligence Object (RIO)...
            </p>
          </div>
        )}

        {/* Active Analysis Dashboard */}
        {rioData && !loading && (
          <div className="space-y-6">
            {/* Repository Header */}
            <RepositoryHeader metadata={metadata} analysisContext={analysisContext} />

            {/* View Switcher: 3 VIEWS OF THE SAME RIO */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-xl bg-dark-900 border border-white/10">
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('arch-rules')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'arch-rules'
                      ? 'bg-cyan-500 text-dark-900 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Cpu className="w-4 h-4" /> Architecture & Rules
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ast')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'ast'
                      ? 'bg-cyan-500 text-dark-900 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Code2 className="w-4 h-4" /> AST Intelligence
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('live-rio')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'live-rio'
                      ? 'bg-cyan-500 text-dark-900 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Live RIO Report
                </button>
              </div>

              {/* Cross-feature shortcuts */}
              <div className="flex items-center gap-2 text-xs">
                <Link
                  href={`/pr-readiness?repo=${encodeURIComponent(repoUrl)}`}
                  className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-cyan-300 border border-white/5 flex items-center gap-1.5 transition-colors"
                >
                  <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Audit PR Readiness</span>
                </Link>
                <Link
                  href={`/merge-risk?repo=${encodeURIComponent(repoUrl)}`}
                  className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-cyan-300 border border-white/5 flex items-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Merge Risk</span>
                </Link>
              </div>
            </div>

            {/* TAB 1: ARCHITECTURE & RULES VIEW */}
            {activeTab === 'arch-rules' && (
              <div className="space-y-6">
                <RioOverview intelligence={intelligence} metadata={metadata} />

                {/* Important files and discovered docs */}
                <ImportantFiles
                  documentationFiles={intelligence?.documentation?.documentationFiles || []}
                  sourceFiles={intelligence?.rules?.sourceFiles || []}
                  topLevelDirectories={analysisContext?.topLevelDirectories || []}
                />

                {/* Commands Card */}
                <CommandsCard
                  setupInstructions={intelligence?.documentation?.setupInstructions || []}
                  workflows={intelligence?.workflows || {}}
                />

                {/* Ingestion Workflow Pipeline */}
                <IngestionWorkflow analysisContext={analysisContext} />
              </div>
            )}

            {/* TAB 2: AST INTELLIGENCE VIEW */}
            {activeTab === 'ast' && (
              <div className="space-y-6">
                {/* Truthful AST Status Banner */}
                <div className="p-6 rounded-2xl bg-dark-900 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Code2 className="w-5 h-5" />
                    <h3 className="font-semibold text-white text-base">AST Intelligence & Module Graph Status</h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    RIE analyzes git trees, module manifests, and code boundaries deterministically. Deep compiler-level AST graph generation (e.g. per-function call-site blast radius) is not active in this repository environment.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 p-2.5 rounded-lg border border-cyan-800/40">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>RIE structural module boundaries and file classification verified with 100% deterministic integrity.</span>
                  </div>
                </div>

                {/* Scanned Files Tree / Classification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-3 glass-card">
                    <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      Discovered Architectural Modules
                    </h4>
                    <p className="text-xs text-slate-400">
                      Partitioned by top-level source directories discovered in git tree:
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {(analysisContext?.topLevelDirectories || []).map((dir, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded bg-dark-900 border border-white/5 text-xs font-mono">
                          <span className="text-slate-300">📁 {dir}/</span>
                          <span className="text-slate-500 text-[11px]">Active module</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-3 glass-card">
                    <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Static Verification Pipeline
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded bg-dark-900 border border-white/5 flex items-center justify-between">
                        <span className="text-slate-300">Total Scanned Blobs</span>
                        <span className="font-mono text-cyan-400">{analysisContext?.scannedFilesCount || 0}</span>
                      </div>
                      <div className="p-2.5 rounded bg-dark-900 border border-white/5 flex items-center justify-between">
                        <span className="text-slate-300">Target Extracted Blobs</span>
                        <span className="font-mono text-cyan-400">{analysisContext?.fetchedFilesCount || 0}</span>
                      </div>
                      <div className="p-2.5 rounded bg-dark-900 border border-white/5 flex items-center justify-between">
                        <span className="text-slate-300">Analysis Commit SHA</span>
                        <span className="font-mono text-slate-400">{analysisContext?.commitSha?.slice(0, 10) || 'N/A'}</span>
                      </div>
                      <div className="p-2.5 rounded bg-dark-900 border border-white/5 flex items-center justify-between">
                        <span className="text-slate-300">Processing Time</span>
                        <span className="font-mono text-emerald-400">{analysisContext?.durationMs ? `${analysisContext.durationMs}ms` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LIVE RIO REPORT VIEW */}
            {activeTab === 'live-rio' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-400">
                        <FileText className="w-5 h-5" />
                        <h3 className="font-semibold text-white text-base">Live Repository Intelligence Object (RIO)</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Canonical JSON data contract emitted by RIE backend, cached in Redis.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={copyRioJson}
                        className="px-3 py-1.5 rounded-lg bg-dark-900 hover:bg-dark-700 text-xs font-mono text-slate-300 hover:text-cyan-400 border border-white/10 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedJson ? 'Copied to Clipboard!' : 'Copy Raw RIO'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Filter for RIO */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter RIO properties (e.g. frameworks, branchRules, metadata)..."
                      value={jsonFilter}
                      onChange={(e) => setJsonFilter(e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  {/* Formatted Code Block */}
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-dark-950">
                    <pre className="p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-[500px] leading-relaxed">
                      {JSON.stringify(
                        jsonFilter
                          ? Object.fromEntries(
                              Object.entries(rioData).filter(([k]) =>
                                k.toLowerCase().includes(jsonFilter.toLowerCase())
                              )
                            )
                          : rioData,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RepositoryIntelligencePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-mono text-sm">
          Loading RepoLens Intelligence...
        </div>
      }
    >
      <RepositoryIntelligenceContent />
    </Suspense>
  );
}
