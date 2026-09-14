'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, ArrowRight, Loader2 } from 'lucide-react';

const POPULAR = [
  'vercel/next.js',
  'vitejs/vite',
  'tailwindlabs/tailwindcss',
];

export default function RepositoryInput({ className = '' }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    // Encode the repo url and navigate to the analysis page
    const encoded = encodeURIComponent(url.trim());
    router.push(`/analyze?repo=${encoded}`);
  };

  const handlePopular = (slug) => {
    setUrl(`https://github.com/${slug}`);
  };

  return (
    <div className={className}>
      <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
        {/* Input */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Github size={15} className="text-slate-500" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="github.com/facebook/react"
            className="repo-input pl-9 pr-4 h-11"
            disabled={loading}
          />
        </div>

        {/* Analyze button */}
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="btn-cyan h-11 px-5 gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowRight size={14} />
          )}
          Analyze Repo
        </button>
      </form>

      {/* Popular repos */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
        <span className="text-xs text-slate-600">Popular:</span>
        {POPULAR.map((slug) => (
          <button
            key={slug}
            onClick={() => handlePopular(slug)}
            className="text-xs text-slate-500 hover:text-cyan-400 font-mono transition-colors"
          >
            {slug}
          </button>
        ))}
      </div>
    </div>
  );
}
