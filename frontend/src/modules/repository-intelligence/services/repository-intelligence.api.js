import axios from 'axios';

export const repositoryIntelligenceApi = {
  async analyze(repoUrl, forceRefresh = false) {
    const { data } = await axios.post('/api/v1/rie/analyze', {
      url: repoUrl,
      forceRefresh,
    });
    return data;
  },

  async getCached(owner, repo) {
    const { data } = await axios.get(`/api/v1/rie/${owner}/${repo}`);
    return data;
  },
};
