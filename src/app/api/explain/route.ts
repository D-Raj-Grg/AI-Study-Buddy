import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { defaultModel } from '@/lib/openai';
import { explainerRequestSchema } from '@/types/explainer';
import { generateExplainerPrompt } from '@/lib/prompts';

// Edge runtime for better performance with streaming
export const runtime = 'edge';
export const maxDuration = 30;

/**
 * POST /api/explain
 * Generates streaming explanation for a given topic
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = explainerRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          details: validation.error.issues,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { topic, complexity, context } = validation.data;

    // Generate prompt
    const prompt = generateExplainerPrompt(topic, complexity, context);

    // Stream the explanation using Vercel AI SDK
    const result = await streamText({
      model: defaultModel,
      prompt,
      temperature: 0.7,
    });

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error generating explanation:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate explanation',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
