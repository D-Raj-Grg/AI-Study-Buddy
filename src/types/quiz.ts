// Quiz Type Definitions
import { z } from 'zod';

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-blank';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
  userAnswers: (string | null)[];
  score: number | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface QuizSettings {
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  questionTypes: QuestionType[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentageScore: number;
  completedAt: Date;
}

export interface QuizGenerateRequest {
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  questionTypes: QuestionType[];
}

export interface QuizGenerateResponse {
  questions: Question[];
  error?: string;
}

// Zod Schemas for AI SDK validation
export const questionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer', 'fill-blank']),
  question: z.string().min(5).max(500),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(10).max(1000),
});

export const quizGenerateSchema = z.object({
  questions: z.array(questionSchema).min(1).max(20),
});
