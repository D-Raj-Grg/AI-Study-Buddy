import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StudySession {
  id: string;
  type: 'quiz' | 'flashcard' | 'explanation';
  topic: string;
  score?: number;
  duration?: number; // in minutes
  timestamp: Date;
  details?: {
    questionsCount?: number;
    cardsCount?: number;
    difficulty?: string;
    complexity?: string;
  };
}

interface DashboardStore {
  studySessions: StudySession[];
  totalStudyTime: number; // in minutes

  // Actions
  addStudySession: (session: Omit<StudySession, 'id' | 'timestamp'>) => void;
  incrementStudyTime: (minutes: number) => void;
  getRecentSessions: (limit?: number) => StudySession[];
  getSessionsByType: (type: 'quiz' | 'flashcard' | 'explanation') => StudySession[];
  getTotalQuizzes: () => number;
  getAverageQuizScore: () => number;
  getTotalFlashcards: () => number;
  getFlashcardMastery: () => number;
  cleanOldSessions: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      studySessions: [],
      totalStudyTime: 0,

      addStudySession: (session) => {
        const newSession: StudySession = {
          ...session,
          id: `${session.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };
        set((state) => ({
          studySessions: [newSession, ...state.studySessions],
        }));
      },

      incrementStudyTime: (minutes) => {
        set((state) => ({
          totalStudyTime: state.totalStudyTime + minutes,
        }));
      },

      getRecentSessions: (limit = 5) => {
        const sessions = get().studySessions;
        return sessions
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
      },

      getSessionsByType: (type) => {
        return get().studySessions.filter((s) => s.type === type);
      },

      getTotalQuizzes: () => {
        return get().studySessions.filter((s) => s.type === 'quiz').length;
      },

      getAverageQuizScore: () => {
        const quizSessions = get().studySessions.filter((s) => s.type === 'quiz' && s.score !== undefined);
        if (quizSessions.length === 0) return 0;
        const totalScore = quizSessions.reduce((sum, s) => sum + (s.score || 0), 0);
        return Math.round(totalScore / quizSessions.length);
      },

      getTotalFlashcards: () => {
        const flashcardSessions = get().studySessions.filter((s) => s.type === 'flashcard');
        return flashcardSessions.reduce((sum, s) => sum + (s.details?.cardsCount || 0), 0);
      },

      getFlashcardMastery: () => {
        const flashcardSessions = get().studySessions.filter((s) => s.type === 'flashcard' && s.score !== undefined);
        if (flashcardSessions.length === 0) return 0;
        const totalMastery = flashcardSessions.reduce((sum, s) => sum + (s.score || 0), 0);
        return Math.round(totalMastery / flashcardSessions.length);
      },

      cleanOldSessions: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filteredSessions = get().studySessions.filter((session) => {
          const sessionDate = new Date(session.timestamp);
          return sessionDate > thirtyDaysAgo;
        });

        if (filteredSessions.length !== get().studySessions.length) {
          set({ studySessions: filteredSessions });
        }
      },
    }),
    {
      name: 'study-buddy-dashboard',
    }
  )
);
