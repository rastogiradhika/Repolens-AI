'use client';

import { useState, useCallback } from 'react';
import { aiGuideApi } from '../services/ai-guide.api.js';

export function useAiGuide() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guide, setGuide] = useState(null);

  const generateGuide = useCallback(async (repoUrl, commitSha) => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiGuideApi.generateGuide(repoUrl, commitSha);
      if (response.success && response.data) {
        setGuide(response.data);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to generate guide.');
      }
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message || 'Guide generation failed.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    guide,
    generateGuide,
    setGuide,
  };
}
