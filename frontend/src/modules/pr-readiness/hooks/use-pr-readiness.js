'use client';

import { useState, useCallback } from 'react';
import { prReadinessApi } from '../services/pr-readiness.api.js';

export function usePrReadiness() {
  const [loading, setLoading] = useState(false);
  const [semanticLoading, setSemanticLoading] = useState(false);

  const [error, setError] = useState(null);
  const [semanticError, setSemanticError] = useState(null);

  const [readinessData, setReadinessData] = useState(null);
  const [semanticData, setSemanticData] = useState(null);

  const evaluatePr = useCallback(
    async (repoUrl, prNumber, forceRefresh = false) => {
      setLoading(true);
      setError(null);

      try {
        const response = await prReadinessApi.evaluate(
          repoUrl,
          prNumber,
          forceRefresh
        );

        if (response.success && response.data) {
          setReadinessData(response.data);
          return response.data;
        }

        throw new Error(
          response.error?.message || 'Failed to evaluate PR readiness.'
        );
      } catch (err) {
        const msg =
          err.response?.data?.error?.message ||
          err.message ||
          'Evaluation failed.';

        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const analyzePrSemantic = useCallback(async (repoUrl, prNumber) => {
    setSemanticLoading(true);
    setSemanticError(null);
    setSemanticData(null);

    try {
      const response = await prReadinessApi.analyzeSemantic(
        repoUrl,
        prNumber
      );

      if (response.success && response.data) {
        setSemanticData(response.data);
        return response.data;
      }

      throw new Error(
        response.error?.message || 'Semantic analysis failed.'
      );
    } catch (err) {
      console.error('Semantic PR analysis error:', err);

      const msg =
        err.response?.data?.error?.message ||
        err.message ||
        'Semantic analysis failed.';

      setSemanticError(msg);
    } finally {
      setSemanticLoading(false);
    }
  }, []);

  return {
    loading,
    semanticLoading,
    error,
    semanticError,
    readinessData,
    semanticData,
    evaluatePr,
    analyzePrSemantic,
    setReadinessData,
  };
}
