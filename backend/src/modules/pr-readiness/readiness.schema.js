import { z } from 'zod';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';

export const readinessRequestSchema = z.object({
  repositoryUrl: z.string().url('Must be a valid repository URL'),
  pullRequestNumber: z.number().int().positive(),
  forceRefresh: z.boolean().optional().default(false),
});

const checkStatusSchema = z.enum([
  'PASS',
  'FAIL',
  'WARNING',
  'NOT_APPLICABLE',
  'UNKNOWN',
]);

export const readinessCheckSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  status: checkStatusSchema,
  weight: z.number().nonnegative(),
  scoreContribution: z.number().nonnegative(),
  message: z.string().min(1),
  evidence: z.record(z.any()),
  source: z.object({
    rioPaths: z.array(z.string()),
    prPaths: z.array(z.string()),
  }),
});

export const readinessResultSchema = z.object({
  score: z.number().min(0).max(100),
  status: z.enum(['READY', 'READY_WITH_WARNINGS', 'NOT_READY', 'NEEDS_REVIEW']),
  summary: z.object({
    pass: z.number().int().nonnegative(),
    fail: z.number().int().nonnegative(),
    warning: z.number().int().nonnegative(),
    notApplicable: z.number().int().nonnegative(),
    unknown: z.number().int().nonnegative(),
  }),
  checks: z.array(readinessCheckSchema),
  suggestions: z.array(z.object({
    checkId: z.string().min(1),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    message: z.string().min(1),
    action: z.string().min(1),
  })),
});

export const readinessResponseSchema = z.object({
  repository: z.object({
    owner: z.string().min(1),
    name: z.string().min(1),
    fullName: z.string().min(1),
    url: z.string().url(),
  }),
  pullRequest: z.object({
    number: z.number().int().positive(),
    title: z.string(),
    body: z.string(),
    state: z.string(),
    url: z.string().url(),
    base: z.object({ ref: z.string(), sha: z.string().min(1) }),
    head: z.object({ ref: z.string(), sha: z.string().min(1) }),
  }),
  rio: z.object({
    commitSha: z.string().min(1),
    source: z.enum(['cache', 'analysis']),
  }),
  readiness: readinessResultSchema,
  cache: z.object({
    source: z.enum(['cache', 'analysis']),
    cachedAt: z.string().datetime(),
  }),
});

export function validateReadinessRequest(req, res, next) {
  try {
    req.body = readinessRequestSchema.parse(req.body);
    next();
  } catch (error) {
    const message = error.errors
      .map((item) => `${item.path.join('.')}: ${item.message}`)
      .join(', ');
    next(new AppError(ErrorCodes.VALIDATION_ERROR, `Validation failed: ${message}`, 400));
  }
}

export function parseReadinessResult(result) {
  const parsed = readinessResultSchema.safeParse(result);
  if (!parsed.success) {
    throw AppError.readinessValidationFailed(parsed.error.flatten());
  }
  return parsed.data;
}

export function parseReadinessResponse(response) {
  const parsed = readinessResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw AppError.readinessValidationFailed(parsed.error.flatten());
  }
  return parsed.data;
}