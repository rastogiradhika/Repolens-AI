'use client';

import { useState, useCallback } from 'react';
import { mergeRiskApi } from '../services/merge-risk.api.js';

export function useMergeRisk() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [riskData, setRiskData] = useState(null);

  const evaluateRisk = useCallback(async (repoUrl, prNumber, targetBranch = 'main', forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mergeRiskApi.evaluateRisk(repoUrl, prNumber, targetBranch, forceRefresh);
      if (response.success && response.data) {
        setRiskData(response.data);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to evaluate merge risk.');
      }
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message || 'Merge risk evaluation failed.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    riskData,
    evaluateRisk,
    setRiskData,
  };
}
