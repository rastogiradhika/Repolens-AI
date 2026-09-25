import { z } from 'zod';

export const dashboardResponseSchema = z.object({
  overview: z.string().describe('A simple, beginner-friendly 2-3 sentence explanation of what this repository does.'),
  primaryRole: z.string().describe('A high-level explanation of the system architecture and how the components interact.'),
  techStack: z.object({
    frameworks: z.array(z.string()).default([]).describe('Core frameworks and runtimes detected in the repository.'),
    dependencies: z.array(z.string()).default([]).describe('Important libraries and tools detected in the repository.'),
    primaryLanguage: z.string().default('Not detected').describe('The primary language of the codebase.'),
  }),
  repositoryStructure: z.array(
    z.object({
      folder: z.string().describe('Folder or directory path name'),
      description: z.string().describe('What is inside this directory and why a beginner needs to know about it'),
    })
  ).default([]).describe('Top-level directories detected in the repository and their purpose.'),
  importantFiles: z.array(z.string()).default([]).describe('3-5 critical starting files for a beginner developer.'),
  gettingStarted: z.array(z.string()).default([]).describe('Step-by-step instructions on how a beginner should set this project up locally.'),
  rules: z.object({
    branchRules: z.array(z.string()).default([]),
    commitRules: z.array(z.string()).default([]),
    pullRequestRules: z.array(z.string()).default([]),
  }).default({ branchRules: [], commitRules: [], pullRequestRules: [] }),
  contributionGuidance: z.string().describe('High-level workflow guidelines for opening a pull request.'),
  beginnerTips: z.array(z.string()).default([]).describe('Encouraging, practical tips for beginners contributing to this project.'),
  commonMistakes: z.array(z.string()).default([]).describe('Common mistakes or pitfalls to avoid in this repository.'),
  beforeSubmitChecks: z.array(z.string()).default([]).describe('Key checks before opening a pull request.'),
});
