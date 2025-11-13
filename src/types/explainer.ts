import { z } from 'zod';

/**
 * Complexity level for explanations
 */
export type ComplexityLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Request payload for explanation generation
 */
export interface ExplainerRequest {
  topic: string;
  complexity: ComplexityLevel;
  context?: string; // Optional additional context
}

/**
 * Response from explanation API (streaming)
 */
export interface ExplainerResponse {
  explanation: string;
  relatedTopics?: string[];
  furtherReading?: string[];
}

/**
 * Zod schema for explainer request validation
 */
export const explainerRequestSchema = z.object({
  topic: z.string().min(2, 'Topic must be at least 2 characters').max(200, 'Topic must be less than 200 characters'),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']),
  context: z.string().max(1000).optional(),
});

export type ExplainerRequestValidated = z.infer<typeof explainerRequestSchema>;
