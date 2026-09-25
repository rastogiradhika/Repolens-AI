import axios from 'axios';

export const aiGuideApi = {
  async generateGuide(repoUrl, commitSha) {
    const { data } = await axios.post('/api/v1/ai-guide/generate', {
      repoUrl,
      commitSha: commitSha || 'latest',
    });
    return data;
  },

  async getGuide(owner, repo, commitSha) {
    const { data } = await axios.get(`/api/v1/ai-guide/${owner}/${repo}`, {
      params: { commitSha },
    });
    return data;
  },
};
