import { Difficulty, QuestionType } from '@/types/quiz';

interface PromptOptions {
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  questionTypes: QuestionType[];
}

// Difficulty level descriptions for the AI
const difficultyDescriptions = {
  easy: 'basic, fundamental concepts that test understanding of simple ideas',
  medium: 'intermediate concepts that require application of knowledge and some critical thinking',
  hard: 'advanced concepts that require deep understanding, analysis, and complex reasoning',
};

// Question type instructions
const questionTypeInstructions = {
  'multiple-choice': 'multiple choice questions with 4 options (A, B, C, D)',
  'true-false': 'true/false questions',
  'short-answer': 'short answer questions that require a brief written response',
  'fill-blank': 'fill-in-the-blank questions with one or two blanks',
};

export function generateQuizPrompt(options: PromptOptions): string {
  const { topic, difficulty, questionCount, questionTypes } = options;

  const difficultyDesc = difficultyDescriptions[difficulty];
  const typesList = questionTypes
    .map(type => questionTypeInstructions[type])
    .join(', ');

  return `You are an expert educator creating a quiz to help students learn about "${topic}".

Create a ${difficulty} level quiz with ${questionCount} questions. The difficulty should focus on ${difficultyDesc}.

Question types to include: ${typesList}

IMPORTANT INSTRUCTIONS:
1. Distribute question types evenly across the quiz
2. Each question should be clear, unambiguous, and educational
3. For multiple choice: provide exactly 4 options, with only ONE correct answer
4. For true/false: make the statement clear and definitive
5. For short answer: expect 1-3 sentences as the answer
6. For fill-in-the-blank: use ___ to indicate blanks
7. Every question MUST include a detailed explanation of the correct answer
8. Explanations should teach the concept, not just state the answer
9. Ensure questions are relevant to the topic and at the appropriate difficulty level
10. Avoid trick questions or ambiguous wording

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "What is photosynthesis?",
      "options": ["A. Cell division", "B. Energy from sunlight", "C. Water absorption", "D. Protein synthesis"],
      "correctAnswer": "B",
      "explanation": "Photosynthesis is the process by which plants convert light energy into chemical energy..."
    },
    {
      "id": "q2",
      "type": "true-false",
      "question": "The sun is a planet.",
      "correctAnswer": "False",
      "explanation": "The sun is actually a star, not a planet. Stars produce their own light through nuclear fusion..."
    }
  ]
}

Generate exactly ${questionCount} questions about "${topic}" at ${difficulty} difficulty level.`;
}

export function generateExplanationPrompt(
  question: string,
  style: 'eli5' | 'standard' | 'detailed' | 'analogy'
): string {
  const styleInstructions = {
    eli5: 'Explain this as if talking to a 5-year-old. Use very simple language, short sentences, and relatable examples.',
    standard: 'Provide a clear, comprehensive explanation suitable for a general audience. Use proper terminology but keep it accessible.',
    detailed: 'Give an in-depth, thorough explanation with examples, context, and related concepts. Suitable for someone wanting to deeply understand the topic.',
    analogy: 'Explain this concept primarily through analogies and comparisons to everyday things people understand.',
  };

  return `You are a knowledgeable tutor helping a student understand a concept.

Question: ${question}

Style: ${styleInstructions[style]}

Provide a helpful, accurate explanation. Include:
1. A clear answer to the question
2. Key concepts explained
3. Examples where appropriate
4. Related topics they might want to explore (2-3 suggestions)

Keep your explanation engaging and educational.`;
}

export function generateFlashcardsPrompt(topic: string, cardCount: number): string {
  return `You are an expert educator creating flashcards to help students learn about "${topic}".

Create ${cardCount} high-quality flashcards that cover the most important concepts, terms, and ideas related to this topic.

IMPORTANT INSTRUCTIONS:
1. Front of card: A term, concept, or question (concise, 1-10 words)
2. Back of card: Definition, explanation, or answer (clear, 1-3 sentences)
3. Focus on key vocabulary, important concepts, and fundamental ideas
4. Make cards that are actually useful for studying and memorization
5. Organize cards logically (foundational concepts first, then build complexity)
6. Ensure variety - don't repeat the same type of information
7. Each card should be atomic - test one concept only

Return ONLY valid JSON in this exact format:
{
  "flashcards": [
    {
      "id": "f1",
      "front": "Photosynthesis",
      "back": "The process by which plants convert light energy into chemical energy, using sunlight, water, and CO2 to produce glucose and oxygen.",
      "category": "Biology Processes"
    },
    {
      "id": "f2",
      "front": "What are the products of photosynthesis?",
      "back": "Glucose (sugar) and oxygen are the main products of photosynthesis.",
      "category": "Biology Processes"
    }
  ]
}

Generate exactly ${cardCount} flashcards about "${topic}".`;
}
