'use client';

import { useState, useCallback } from 'react';
import { repositoryIntelligenceApi } from '../services/repository-intelligence.api.js';

export function useRepositoryAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rio, setRio] = useState(null);

  const analyzeRepository = useCallback(async (repoUrl, forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await repositoryIntelligenceApi.analyze(repoUrl, forceRefresh);
      if (response.success && response.data?.rio) {
        setRio(response.data.rio);
        return response.data.rio;
      } else {
        throw new Error(response.error?.message || 'Failed to extract repository intelligence.');
      }
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message || 'Analysis failed.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    rio,
    analyzeRepository,
    setRio,
  };
}
