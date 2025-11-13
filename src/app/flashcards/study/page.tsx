"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, X, Check, MinusCircle, BookOpen, Shuffle as ShuffleIcon, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFlashcardStore } from '@/store/useFlashcardStore';
import { CardStatus, StudyMode } from '@/types/flashcard';

export default function FlashcardStudyPage() {
  const router = useRouter();
  const currentSet = useFlashcardStore((state) => state.currentSet);
  const currentCardIndex = useFlashcardStore((state) => state.currentCardIndex);
  const studyMode = useFlashcardStore((state) => state.studyMode);
  const updateCardStatus = useFlashcardStore((state) => state.updateCardStatus);
  const nextCard = useFlashcardStore((state) => state.nextCard);
  const previousCard = useFlashcardStore((state) => state.previousCard);
  const setStudyMode = useFlashcardStore((state) => state.setStudyMode);
  const completeSet = useFlashcardStore((state) => state.completeSet);

  const [isFlipped, setIsFlipped] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    // Redirect if no flashcard set
    if (!currentSet) {
      router.push('/flashcards/new');
    }
  }, [currentSet, router]);

  useEffect(() => {
    // Reset flip state when card changes
    setIsFlipped(false);
    setShowControls(false);
    setSwipeOffset({ x: 0, y: 0 });
    setIsSwiping(false);
  }, [currentCardIndex]);

  if (!currentSet) {
    return null;
  }

  const currentCard = currentSet.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / currentSet.cards.length) * 100;
  const reviewedCount = currentSet.cards.filter((c) => c.status !== 'not-studied').length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowControls(true);
    }
  };

  const handleStatusUpdate = (status: CardStatus) => {
    updateCardStatus(currentCard.id, status);
    setShowControls(false);

    // Auto-advance to next card
    setTimeout(() => {
      if (currentCardIndex < currentSet.cards.length - 1) {
        nextCard();
      } else {
        // All cards reviewed
        completeSet();
        router.push('/flashcards/results');
      }
    }, 300);
  };

  const handleModeChange = (mode: StudyMode) => {
    setStudyMode(mode);
    setIsFlipped(false);
    setShowControls(false);
  };

  const handleFinish = () => {
    completeSet();
    router.push('/flashcards/results');
  };

  // Touch handlers for swipe gestures
  const minSwipeDistance = 50; // minimum distance for a swipe

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;

    const deltaX = currentX - touchStart.x;
    const deltaY = currentY - touchStart.y;

    // Update visual offset for feedback
    setSwipeOffset({ x: deltaX, y: deltaY });
    setTouchEnd({ x: currentX, y: currentY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsSwiping(false);
      setSwipeOffset({ x: 0, y: 0 });
      return;
    }

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Only act on swipes if card is flipped
    if (isFlipped) {
      // Horizontal swipes (left/right)
      if (absX > absY && absX > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right = Know It
          handleStatusUpdate('know');
        } else {
          // Swipe left = Don't Know
          handleStatusUpdate('dont-know');
        }
      }
      // Vertical swipe up
      else if (absY > minSwipeDistance && deltaY < 0) {
        // Swipe up = Learning
        handleStatusUpdate('learning');
      }
    }

    // Reset
    setTouchStart(null);
    setTouchEnd(null);
    setSwipeOffset({ x: 0, y: 0 });
    setIsSwiping(false);
  };

  // In quiz mode, show controls only after flipping
  // In study/shuffle mode, show controls after first flip
  const shouldShowControls = studyMode === 'quiz' ? isFlipped && showControls : showControls;

  // Calculate swipe feedback
  const getSwipeFeedback = () => {
    if (!isSwiping || !isFlipped) return null;

    const absX = Math.abs(swipeOffset.x);
    const absY = Math.abs(swipeOffset.y);

    if (absX > absY && absX > 30) {
      if (swipeOffset.x > 0) {
        return { text: 'Know It', color: 'text-green-500', icon: Check };
      } else {
        return { text: "Don't Know", color: 'text-red-500', icon: X };
      }
    } else if (absY > 30 && swipeOffset.y < 0) {
      return { text: 'Learning', color: 'text-yellow-500', icon: MinusCircle };
    }

    return null;
  };

  const swipeFeedback = getSwipeFeedback();

  const modes = [
    { id: 'study' as StudyMode, label: 'Study', icon: BookOpen, description: 'Review all cards sequentially' },
    { id: 'shuffle' as StudyMode, label: 'Shuffle', icon: ShuffleIcon, description: 'Random order review' },
    { id: 'quiz' as StudyMode, label: 'Quiz', icon: Brain, description: 'Test yourself without hints' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Mode Selector */}
          <div className="mb-8">
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {modes.map((mode) => {
                const Icon = mode.icon;
                const isActive = studyMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-2">
              {modes.find(m => m.id === studyMode)?.description}
            </p>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {currentSet.topic}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Card {currentCardIndex + 1} of {currentSet.cards.length} · {reviewedCount} reviewed
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFinish}
            >
              <Home className="w-4 h-4 mr-2" />
              Finish
            </Button>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2 mb-8" />

          {/* Flashcard */}
          <div className="mb-8 relative">
            <div
              className="relative w-full h-[400px] cursor-pointer perspective-1000"
              onClick={handleFlip}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                  x: isSwiping ? swipeOffset.x : 0,
                  y: isSwiping ? swipeOffset.y : 0,
                }}
                transition={
                  isSwiping
                    ? { duration: 0 }
                    : { duration: 0.6, type: 'spring', stiffness: 100 }
                }
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of card */}
                <Card
                  className="absolute w-full h-full flex items-center justify-center p-8 bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <div className="text-center">
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-4">
                      FRONT
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {currentCard.front}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
                      {studyMode === 'quiz' ? 'Click to reveal answer' : 'Click to flip'}
                    </p>
                  </div>
                </Card>

                {/* Back of card */}
                <Card
                  className="absolute w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-purple-600"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="text-center text-white">
                    <p className="text-sm font-semibold mb-4 opacity-90">
                      BACK
                    </p>
                    <p className="text-xl md:text-2xl leading-relaxed">
                      {currentCard.back}
                    </p>
                    <p className="text-sm opacity-75 mt-6">
                      Click to flip back
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Swipe Feedback Indicator */}
            <AnimatePresence>
              {swipeFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                >
                  <div className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700">
                    {React.createElement(swipeFeedback.icon, {
                      className: `w-12 h-12 ${swipeFeedback.color}`,
                    })}
                    <p className={`text-lg font-bold ${swipeFeedback.color}`}>
                      {swipeFeedback.text}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Buttons (shown after flipping) */}
          <AnimatePresence>
            {shouldShowControls && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-3 gap-4 mb-8"
              >
                <Button
                  onClick={() => handleStatusUpdate('dont-know')}
                  className="h-16 bg-red-500 hover:bg-red-600 text-white"
                >
                  <X className="w-5 h-5 mr-2" />
                  Don&apos;t Know
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('learning')}
                  className="h-16 bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <MinusCircle className="w-5 h-5 mr-2" />
                  Still Learning
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('know')}
                  className="h-16 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Know It
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={previousCard}
              disabled={currentCardIndex === 0}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div className="flex gap-1">
              {currentSet.cards.map((card, index) => (
                <div
                  key={card.id}
                  className={`w-2 h-2 rounded-full ${
                    index === currentCardIndex
                      ? 'bg-purple-600 w-3'
                      : card.status === 'know'
                      ? 'bg-green-500'
                      : card.status === 'learning'
                      ? 'bg-yellow-500'
                      : card.status === 'dont-know'
                      ? 'bg-red-500'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextCard}
              disabled={currentCardIndex === currentSet.cards.length - 1}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Mobile Swipe Hint */}
          {isFlipped && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4 sm:hidden">
              💡 Tip: Swipe right (Know), left (Don&apos;t Know), or up (Learning)
            </p>
          )}

          {/* Keyboard Hints */}
          <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border">Space</kbd> to flip ·
              <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border mx-2">←</kbd>
              <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border">→</kbd> to navigate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
