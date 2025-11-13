import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Flashcard, FlashcardSet, CardStatus } from '@/types/flashcard';

interface FlashcardStore {
  // State
  currentSet: FlashcardSet | null;
  flashcardSets: FlashcardSet[];
  currentCardIndex: number;

  // Actions
  setCurrentSet: (data: { topic: string; cards: Omit<Flashcard, 'id' | 'status' | 'reviewCount'>[] }) => void;
  updateCardStatus: (cardId: string, status: CardStatus) => void;
  nextCard: () => void;
  previousCard: () => void;
  goToCard: (index: number) => void;
  shuffleCards: () => void;
  resetCurrentSet: () => void;
  completeSet: () => void;
  calculateMastery: () => number;
  cleanOldSets: () => void;
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => ({
      currentSet: null,
      flashcardSets: [],
      currentCardIndex: 0,

      setCurrentSet: (data) => {
        const cards: Flashcard[] = data.cards.map((card) => ({
          ...card,
          id: nanoid(),
          status: 'not-studied' as CardStatus,
          reviewCount: 0,
        }));

        const newSet: FlashcardSet = {
          id: nanoid(),
          topic: data.topic,
          cards,
          createdAt: new Date(),
          masteryPercentage: 0,
        };

        set({
          currentSet: newSet,
          currentCardIndex: 0,
        });
      },

      updateCardStatus: (cardId, status) => {
        const currentSet = get().currentSet;
        if (!currentSet) return;

        const updatedCards = currentSet.cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                status,
                lastReviewed: new Date(),
                reviewCount: card.reviewCount + 1,
              }
            : card
        );

        const updatedSet = {
          ...currentSet,
          cards: updatedCards,
          masteryPercentage: get().calculateMastery(),
          lastStudied: new Date(),
        };

        set({ currentSet: updatedSet });
      },

      nextCard: () => {
        const currentSet = get().currentSet;
        if (!currentSet) return;

        const currentIndex = get().currentCardIndex;
        if (currentIndex < currentSet.cards.length - 1) {
          set({ currentCardIndex: currentIndex + 1 });
        }
      },

      previousCard: () => {
        const currentIndex = get().currentCardIndex;
        if (currentIndex > 0) {
          set({ currentCardIndex: currentIndex - 1 });
        }
      },

      goToCard: (index) => {
        const currentSet = get().currentSet;
        if (!currentSet) return;

        if (index >= 0 && index < currentSet.cards.length) {
          set({ currentCardIndex: index });
        }
      },

      shuffleCards: () => {
        const currentSet = get().currentSet;
        if (!currentSet) return;

        const shuffled = [...currentSet.cards].sort(() => Math.random() - 0.5);
        set({
          currentSet: { ...currentSet, cards: shuffled },
          currentCardIndex: 0,
        });
      },

      resetCurrentSet: () => {
        const currentSet = get().currentSet;
        if (!currentSet) return;

        const resetCards = currentSet.cards.map((card) => ({
          ...card,
          status: 'not-studied' as CardStatus,
          reviewCount: 0,
        }));

        set({
          currentSet: { ...currentSet, cards: resetCards, masteryPercentage: 0 },
          currentCardIndex: 0,
        });
      },

      completeSet: () => {
        const currentSet = get().currentSet;
        if (!currentSet) return;

        const masteryPercentage = get().calculateMastery();
        const completedSet = {
          ...currentSet,
          masteryPercentage,
          lastStudied: new Date(),
        };

        const existingIndex = get().flashcardSets.findIndex(
          (set) => set.id === currentSet.id
        );

        const updatedSets =
          existingIndex >= 0
            ? get().flashcardSets.map((set, idx) =>
                idx === existingIndex ? completedSet : set
              )
            : [completedSet, ...get().flashcardSets];

        set({
          flashcardSets: updatedSets,
          currentSet: null,
          currentCardIndex: 0,
        });

        // Cleanup old sets
        get().cleanOldSets();
      },

      calculateMastery: () => {
        const currentSet = get().currentSet;
        if (!currentSet || currentSet.cards.length === 0) return 0;

        const knowCount = currentSet.cards.filter(
          (card) => card.status === 'know'
        ).length;

        return Math.round((knowCount / currentSet.cards.length) * 100);
      },

      cleanOldSets: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filteredSets = get().flashcardSets.filter((set) => {
          const setDate = new Date(set.createdAt);
          return setDate > thirtyDaysAgo;
        });

        if (filteredSets.length !== get().flashcardSets.length) {
          set({ flashcardSets: filteredSets });
        }
      },
    }),
    {
      name: 'study-buddy-flashcard-store',
    }
  )
);
