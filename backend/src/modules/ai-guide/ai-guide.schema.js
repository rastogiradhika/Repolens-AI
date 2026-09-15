import { z } from 'zod';

export const dashboardResponseSchema = z.object({
  overview: z.string().describe('A simple 2-3 sentence explanation of what this repository does.'),
  techStack: z.array(z.string()).describe('List of core technologies (e.g. React, Node.js) and what they are used for here.'),
  projectStructure: z.string().describe('A quick map of the most important folders in the repo and what is inside them.'),
  beginnerTips: z.array(z.string()).describe("2-3 encouraging tips or 'gotchas' specifically for beginners looking at this code."),
  gettingStarted: z.string().describe('Step-by-step instructions on how a beginner should set this project up on their local machine.'),
  importantFiles: z.array(z.string()).describe('A list of exactly 3-5 critical files the developer should look at first.'),
  contributionGuidance: z.string().describe('The exact git workflow (branch naming, commit style) they should use to make a PR.')
});
