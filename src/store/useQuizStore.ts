import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quiz, Question } from '@/types/quiz';
import { nanoid } from 'nanoid';

interface QuizStore {
  // State
  currentQuiz: Quiz | null;
  quizHistory: Quiz[];

  // Actions
  setCurrentQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'userAnswers' | 'score' | 'completedAt'>) => void;
  submitAnswer: (questionIndex: number, answer: string) => void;
  calculateScore: () => number;
  completeQuiz: () => void;
  resetQuiz: () => void;
  loadQuizById: (id: string) => Quiz | null;
  clearOldQuizzes: () => void;
}

const STORAGE_KEY = 'study-buddy-quiz-store';
const RETENTION_DAYS = 30;

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuiz: null,
      quizHistory: [],

      // Set current quiz (new quiz)
      setCurrentQuiz: (quizData) => {
        const quiz: Quiz = {
          ...quizData,
          id: nanoid(),
          createdAt: new Date(),
          userAnswers: new Array(quizData.questions.length).fill(null),
          score: null,
          completedAt: null,
        };

        set({ currentQuiz: quiz });
      },

      // Submit answer for a question
      submitAnswer: (questionIndex, answer) => {
        const { currentQuiz } = get();
        if (!currentQuiz) return;

        const updatedAnswers = [...currentQuiz.userAnswers];
        updatedAnswers[questionIndex] = answer;

        // Check if answer is correct
        const question = currentQuiz.questions[questionIndex];
        const isCorrect = checkAnswer(question, answer);

        // Update question with user answer and correctness
        const updatedQuestions = currentQuiz.questions.map((q, idx) => {
          if (idx === questionIndex) {
            return {
              ...q,
              userAnswer: answer,
              isCorrect,
            };
          }
          return q;
        });

        set({
          currentQuiz: {
            ...currentQuiz,
            userAnswers: updatedAnswers,
            questions: updatedQuestions,
          },
        });
      },

      // Calculate score
      calculateScore: () => {
        const { currentQuiz } = get();
        if (!currentQuiz) return 0;

        const correctAnswers = currentQuiz.questions.filter(
          (q) => q.isCorrect === true
        ).length;

        return Math.round((correctAnswers / currentQuiz.questions.length) * 100);
      },

      // Complete quiz and save to history
      completeQuiz: () => {
        const { currentQuiz, quizHistory } = get();
        if (!currentQuiz) return;

        const score = get().calculateScore();
        const completedQuiz: Quiz = {
          ...currentQuiz,
          score,
          completedAt: new Date(),
        };

        set({
          currentQuiz: completedQuiz,
          quizHistory: [completedQuiz, ...quizHistory],
        });
      },

      // Reset current quiz
      resetQuiz: () => {
        set({ currentQuiz: null });
      },

      // Load quiz by ID from history
      loadQuizById: (id) => {
        const { quizHistory } = get();
        return quizHistory.find((quiz) => quiz.id === id) || null;
      },

      // Clear quizzes older than retention period
      clearOldQuizzes: () => {
        const { quizHistory } = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

        const filteredHistory = quizHistory.filter((quiz) => {
          const quizDate = new Date(quiz.createdAt);
          return quizDate > cutoffDate;
        });

        if (filteredHistory.length !== quizHistory.length) {
          set({ quizHistory: filteredHistory });
        }
      },
    }),
    {
      name: STORAGE_KEY,
      // Custom serialization for dates
      partialize: (state) => ({
        currentQuiz: state.currentQuiz,
        quizHistory: state.quizHistory,
      }),
    }
  )
);

// Helper function to check if answer is correct
function checkAnswer(question: Question, userAnswer: string): boolean {
  const correct = question.correctAnswer.toLowerCase().trim();
  const user = userAnswer.toLowerCase().trim();

  switch (question.type) {
    case 'multiple-choice':
      // For multiple choice, just match the letter (A, B, C, D)
      return user === correct;

    case 'true-false':
      // For true/false, match the boolean value
      return user === correct || user === correct.substring(0, 1); // Allow 't' or 'f'

    case 'short-answer':
    case 'fill-blank':
      // For text answers, check if user answer contains the correct answer
      // or vice versa (flexible matching)
      return (
        user === correct ||
        user.includes(correct) ||
        correct.includes(user)
      );

    default:
      return false;
  }
}

// Auto-cleanup on load
if (typeof window !== 'undefined') {
  // Run cleanup when store is initialized
  setTimeout(() => {
    useQuizStore.getState().clearOldQuizzes();
  }, 1000);
}
