import { z } from 'zod';

export const evaluateRiskSchema = z.object({
  repoUrl: z.string().trim().url('Must be a valid URL').includes('github.com', { message: 'Must be a GitHub URL' }),
  prNumber: z.number({ invalid_type_error: 'PR number must be an integer' }).int().positive('PR number must be positive'),
  targetBranch: z.string().optional().default('main'),
  forceRefresh: z.boolean().optional(),
});
