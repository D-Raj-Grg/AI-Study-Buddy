import OpenAI from 'openai';

// Lazy initialization of OpenAI client
// API key should be set in .env.local as OPENAI_API_KEY
let _openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!_openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set. Please add it to .env.local');
    }

    _openaiClient = new OpenAI({ apiKey });
  }

  return _openaiClient;
}

// Helper function to make API calls with retry logic
export async function makeOpenAIRequest<T>(
  request: (client: OpenAI) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;
  const client = getOpenAIClient();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await request(client);
    } catch (error) {
      lastError = error as Error;
      console.error(`OpenAI API attempt ${attempt} failed:`, error);

      // Don't retry on certain errors
      if (error instanceof OpenAI.APIError) {
        if (error.status === 401 || error.status === 403) {
          // Authentication errors - don't retry
          throw error;
        }
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('OpenAI request failed after retries');
}

// Export getter function instead of client instance
export const openai = getOpenAIClient;
export default getOpenAIClient;
