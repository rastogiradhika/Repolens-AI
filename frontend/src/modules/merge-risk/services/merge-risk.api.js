import axios from 'axios';

export const mergeRiskApi = {
  async evaluateRisk(repoUrl, prNumber, targetBranch = 'main', forceRefresh = false) {
    const { data } = await axios.post('/api/v1/merge-risk/analyze', {
      repoUrl,
      prNumber: parseInt(prNumber, 10),
      targetBranch,
      forceRefresh,
    });
    return data;
  },
};
