import axios from 'axios';

export const prReadinessApi = {
  async evaluate(repoUrl, prNumber, forceRefresh = false) {
    const { data } = await axios.post('/api/v1/pr-readiness/check', {
      repoUrl,
      prNumber: parseInt(prNumber, 10),
      forceRefresh,
    });
    return data;
  },

  async analyzeSemantic(repoUrl, prNumber) {
    const { data } = await axios.post('/api/v1/pr-readiness/semantic', {
      repoUrl,
      prNumber: parseInt(prNumber, 10),
    });
    return data;
  },
};
