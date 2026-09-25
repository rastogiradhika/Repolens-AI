'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';
import {
  Search,
  Cpu,
  Sparkles,
  ClipboardCheck,
  GitMerge,
  ArrowRight,
  ExternalLink,
  Code2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const [repoUrl, setRepoUrl] = useState('');

  const features = [
    {
      title: 'Repository Intelligence',
      desc: 'Three unified views: Architecture & Rules, AST Intelligence, and Live RIO report.',
      icon: Cpu,
      color: 'text-cyan-400',
      border: 'border-cyan-500/20',
      bg: 'bg-cyan-950/20',
      href: '/repository-intelligence',
    },
    {
      title: 'AI Repository Guide',
      desc: 'Grounded onboarding guidance, beginner tips, common pitfalls, and folder directory tour.',
      icon: Sparkles,
      color: 'text-violet-400',
      border: 'border-violet-500/20',
      bg: 'bg-violet-950/20',
      href: '/ai-guide',
    },
    {
      title: 'Pre-PR Readiness',
      desc: 'Deterministic PR auditing for branch names, commit conventions, PR templates, and test signals.',
      icon: ClipboardCheck,
      color: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'bg-amber-950/20',
      href: '/pr-readiness',
    },
    {
      title: 'Semantic Merge Risk',
      desc: 'Distinguish superficial diffs from high-risk interface collisions and schema migrations.',
      icon: GitMerge,
      color: 'text-rose-400',
      border: 'border-rose-500/20',
      bg: 'bg-rose-950/20',
      href: '/merge-risk',
    },
  ];

  const popularRepos = [
    { name: 'facebook/react', lang: 'JavaScript', desc: 'The library for web and native user interfaces' },
    { name: 'vitejs/vite', lang: 'TypeScript', desc: 'Next generation frontend tooling' },
    { name: 'tailwindlabs/tailwindcss', lang: 'CSS/JS', desc: 'A utility-first CSS framework' },
    { name: 'expressjs/express', lang: 'JavaScript', desc: 'Fast, unopinionated, minimalist web framework' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full space-y-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-2xl glass-card border border-white/10">
          <div className="space-y-2">
            <span className="mono-label text-cyan-400">REPOLENS WORKSPACE</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Repository Intelligence Platform
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Turn public repositories into structured intelligence, onboarding roadmaps, and contribution-ready audits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/repository-intelligence"
              className="btn-cyan flex items-center gap-2 text-sm"
            >
              <span>Launch Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link
                key={idx}
                href={feat.href}
                className={`p-6 rounded-2xl border ${feat.border} ${feat.bg} glass-card-hover flex flex-col justify-between space-y-4 group`}
              >
                <div className="space-y-2.5">
                  <div className={`p-2.5 rounded-xl bg-dark-900 border border-white/5 w-fit ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 pt-2">
                  <span>Open Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Start Repositories */}
        <div className="p-8 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Quick Intelligence Test Repositories</h3>
              <p className="text-xs text-slate-400">One-click analysis targets with verified contribution and manifest structures.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {popularRepos.map((repo, idx) => (
              <Link
                key={idx}
                href={`/repository-intelligence?repo=https://github.com/${repo.name}`}
                className="p-4 rounded-xl bg-dark-900 border border-white/5 hover:border-cyan-500/30 transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">
                    {repo.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{repo.desc}</p>
                <div className="text-[10px] font-mono text-cyan-400/80 pt-1">
                  ● {repo.lang}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
