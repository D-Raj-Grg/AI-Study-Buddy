import { createOpenAI } from '@ai-sdk/openai';

// Validate API key on module load
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY is not set. Please add it to .env.local');
}

// Create OpenAI provider instance
// API key should be set in .env.local as OPENAI_API_KEY
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Export commonly used models for easy access
export const models = {
  'gpt-4o-mini': openai('gpt-4o-mini'),
  'gpt-4o': openai('gpt-4o'),
  'gpt-4-turbo': openai('gpt-4-turbo'),
} as const;

// Default model for the app (cost-effective)
export const defaultModel = models['gpt-4o-mini'];

export default openai;
