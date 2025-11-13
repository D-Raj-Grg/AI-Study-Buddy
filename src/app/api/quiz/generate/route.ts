import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { defaultModel } from '@/lib/openai';
import { generateQuizPrompt } from '@/lib/prompts';
import { QuizGenerateRequest, QuizGenerateResponse, Question, quizGenerateSchema } from '@/types/quiz';
import { nanoid } from 'nanoid';

export const runtime = 'edge'; // Use edge runtime for better performance
export const maxDuration = 30; // Maximum duration for quiz generation

// Input validation
function validateRequest(body: unknown): body is QuizGenerateRequest {
  if (!body || typeof body !== 'object') return false;

  const req = body as QuizGenerateRequest;

  // Validate topic
  if (!req.topic || typeof req.topic !== 'string' || req.topic.trim().length === 0) {
    return false;
  }

  if (req.topic.length > 500) {
    return false;
  }

  // Validate difficulty
  if (!['easy', 'medium', 'hard'].includes(req.difficulty)) {
    return false;
  }

  // Validate question count
  if (!Number.isInteger(req.questionCount) || req.questionCount < 5 || req.questionCount > 20) {
    return false;
  }

  // Validate question types
  if (!Array.isArray(req.questionTypes) || req.questionTypes.length === 0) {
    return false;
  }

  const validTypes = ['multiple-choice', 'true-false', 'short-answer', 'fill-blank'];
  if (!req.questionTypes.every(type => validTypes.includes(type))) {
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
    const prompt = generateQuizPrompt({
      topic: sanitizedTopic,
      difficulty: body.difficulty,
      questionCount: body.questionCount,
      questionTypes: body.questionTypes,
    });

    // Call AI SDK with structured output
    const result = await generateObject({
      model: defaultModel,
      schema: quizGenerateSchema,
      system: 'You are an expert educator who creates high-quality educational quizzes. Generate questions that are clear, accurate, and educational.',
      prompt,
      temperature: 0.7,
      maxRetries: 3, // Built-in retry logic
    });

    // Add unique IDs to questions if not present
    const questions: Question[] = result.object.questions.map((q, index) => ({
      ...q,
      id: q.id || `q${index + 1}_${nanoid(8)}`,
    }));

    // Return successful response
    const response: QuizGenerateResponse = {
      questions,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Quiz generation error:', error);

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
      { error: 'Failed to generate quiz. Please try again.' },
      { status: 500 }
    );
  }
}
