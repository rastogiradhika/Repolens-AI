import React, { useState } from 'react';
import RioDashboard from '@/modules/repository-intelligence/components/RioDashboard';
import { Search, Loader2 } from 'lucide-react';

export default function RepositoryIntelligencePage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [rioData, setRioData] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!repoUrl) return;

    setLoading(true);
    setError(null);
    setRioData(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/rie/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to analyze repository');
      }

      setRioData(data.data.rio);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Repository Intelligence Engine
          </h1>
          <p className="text-gray-400">
            Paste a public GitHub repository URL to generate a deterministic intelligence report.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="flex gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="url"
              placeholder="https://github.com/facebook/react"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mx-auto" />
            <p className="text-gray-400 animate-pulse">Scanning repository files and extracting intelligence...</p>
          </div>
        )}

        {/* Dashboard */}
        {rioData && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RioDashboard rio={rioData} />
          </div>
        )}

      </div>
    </div>
  );
}
