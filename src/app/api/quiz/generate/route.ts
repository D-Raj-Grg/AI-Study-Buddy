import { NextRequest, NextResponse } from 'next/server';
import { makeOpenAIRequest } from '@/lib/openai';
import { generateQuizPrompt } from '@/lib/prompts';
import { QuizGenerateRequest, QuizGenerateResponse, Question } from '@/types/quiz';
import { nanoid } from 'nanoid';

export const runtime = 'edge'; // Use edge runtime for better performance

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

    // Call OpenAI API with retry logic
    const completion = await makeOpenAIRequest(async (client) => {
      return await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educator who creates high-quality educational quizzes. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });
    });

    // Parse response
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const parsed = JSON.parse(content);

    // Validate response structure
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Add unique IDs to questions if not present
    const questions: Question[] = parsed.questions.map((q: Question, index: number) => ({
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

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to generate quiz. Please try again.' },
      { status: 500 }
    );
  }
}
