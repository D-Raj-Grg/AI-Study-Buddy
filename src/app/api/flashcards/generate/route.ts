import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { defaultModel } from '@/lib/openai';
import { generateFlashcardsPrompt } from '@/lib/prompts';
import { FlashcardGenerateRequest, FlashcardGenerateResponse, flashcardGenerateSchema } from '@/types/flashcard';

export const runtime = 'edge';
export const maxDuration = 30;

// Input validation
function validateRequest(body: unknown): body is FlashcardGenerateRequest {
  if (!body || typeof body !== 'object') return false;

  const req = body as FlashcardGenerateRequest;

  // Validate topic
  if (!req.topic || typeof req.topic !== 'string' || req.topic.trim().length === 0) {
    return false;
  }

  if (req.topic.length > 500) {
    return false;
  }

  // Validate card count
  if (!Number.isInteger(req.cardCount) || req.cardCount < 5 || req.cardCount > 30) {
    return false;
  }

  return true;
}

// Sanitize user input
function sanitizeInput(text: string): string {
  return text.trim().slice(0, 500);
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request
    if (!validateRequest(body)) {
      return NextResponse.json(
        { error: 'Invalid request. Please check your input.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTopic = sanitizeInput(body.topic);

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Generate prompt
    const prompt = generateFlashcardsPrompt(sanitizedTopic, body.cardCount);

    // Call AI SDK with structured output
    const result = await generateObject({
      model: defaultModel,
      schema: flashcardGenerateSchema,
      system: 'You are an expert educator who creates high-quality educational flashcards. Generate flashcards that are clear, memorable, and focused.',
      prompt,
      temperature: 0.7,
      maxRetries: 3,
    });

    // Return successful response
    const response: FlashcardGenerateResponse = {
      cards: result.object.cards,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Flashcard generation error:', error);

    // Handle specific error types from AI SDK
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check for rate limit or authentication errors
    if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      return NextResponse.json(
        { error: 'API rate limit reached. Please try again in a moment.' },
        { status: 429 }
      );
    }

    if (errorMessage.includes('authentication') || errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to generate flashcards. Please try again.' },
      { status: 500 }
    );
  }
}
