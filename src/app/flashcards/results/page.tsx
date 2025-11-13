"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, Check, X, MinusCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFlashcardStore } from '@/store/useFlashcardStore';

export default function FlashcardResultsPage() {
  const router = useRouter();
  const flashcardSets = useFlashcardStore((state) => state.flashcardSets);

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const latestSet = flashcardSets[0]; // Most recent set

  useEffect(() => {
    if (!latestSet) {
      router.push('/flashcards/new');
      return;
    }

    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Show confetti for high mastery
    if (latestSet.masteryPercentage >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [latestSet, router]);

  if (!latestSet) {
    return null;
  }

  const knowCount = latestSet.cards.filter((c) => c.status === 'know').length;
  const learningCount = latestSet.cards.filter((c) => c.status === 'learning').length;
  const dontKnowCount = latestSet.cards.filter((c) => c.status === 'dont-know').length;
  const totalCards = latestSet.cards.length;

  const getMasteryMessage = () => {
    const mastery = latestSet.masteryPercentage;
    if (mastery >= 90) return { text: 'Excellent Mastery! 🌟', color: 'text-green-600 dark:text-green-400' };
    if (mastery >= 70) return { text: 'Great Progress! 🎉', color: 'text-blue-600 dark:text-blue-400' };
    if (mastery >= 50) return { text: 'Good Start! 💪', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'Keep Practicing! 📚', color: 'text-orange-600 dark:text-orange-400' };
  };

  const message = getMasteryMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 md:p-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 shadow-xl text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${message.color}`}>
                {message.text}
              </h1>

              <div className="my-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                >
                  {latestSet.masteryPercentage}%
                </motion.div>
                <p className="text-xl text-slate-600 dark:text-slate-300 mt-4">
                  Mastery Level
                </p>
              </div>

              <Progress value={latestSet.masteryPercentage} className="h-3 mb-8" />

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{knowCount}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know It</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <MinusCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{learningCount}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Learning</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <X className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{dontKnowCount}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Don&apos;t Know</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/flashcards/new')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Create New Set
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Topic Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">You studied</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {latestSet.topic}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {totalCards} flashcards reviewed
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
