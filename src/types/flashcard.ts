// Flashcard Type Definitions
import { z } from 'zod';

export type CardStatus = 'not-studied' | 'dont-know' | 'learning' | 'know';
export type StudyMode = 'study' | 'shuffle' | 'quiz';

export interface Flashcard {
  id: string;
  front: string; // Term/Question
  back: string; // Definition/Answer
  status: CardStatus;
  lastReviewed?: Date;
  reviewCount: number;
}

export interface FlashcardSet {
  id: string;
  topic: string;
  cards: Flashcard[];
  createdAt: Date;
  lastStudied?: Date;
  masteryPercentage: number;
}

export interface FlashcardProgress {
  setId: string;
  cardsReviewed: number;
  totalCards: number;
  knowCount: number;
  learningCount: number;
  dontKnowCount: number;
  completedAt?: Date;
}

export interface FlashcardGenerateRequest {
  topic: string;
  cardCount: number;
}

export interface FlashcardGenerateResponse {
  cards: Omit<Flashcard, 'id' | 'status' | 'reviewCount'>[];
  error?: string;
}

// Zod Schemas for AI SDK validation
export const flashcardSchema = z.object({
  front: z.string().min(3).max(300),
  back: z.string().min(10).max(1000),
});

export const flashcardGenerateSchema = z.object({
  cards: z.array(flashcardSchema).min(5).max(30),
});
