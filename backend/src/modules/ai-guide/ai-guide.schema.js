import { z } from 'zod';

export const dashboardResponseSchema = z.object({
  overview: z.string().describe('A simple 2-3 sentence explanation of what this repository does.'),
  techStack: z.union([z.array(z.string()), z.object({ frameworks: z.array(z.string()).optional(), dependencies: z.array(z.string()).optional() })]).describe('Core technologies.'),
  projectStructure: z.union([z.string(), z.array(z.any())]).describe('Map of important folders and contents.'),
  beginnerTips: z.array(z.string()).describe("Tips for beginners."),
  commonMistakes: z.array(z.string()).optional().describe("Common beginner mistakes."),
  gettingStarted: z.union([z.string(), z.array(z.string())]).describe('Setup instructions.'),
  importantFiles: z.array(z.any()).describe('List of critical files.'),
  contributionGuidance: z.string().describe('Git workflow and contribution rules.')
});

