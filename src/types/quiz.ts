// Quiz Type Definitions

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
