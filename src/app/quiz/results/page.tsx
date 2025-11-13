"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuizStore } from '@/store/useQuizStore';

export default function QuizResultsPage() {
  const router = useRouter();
  const currentQuiz = useQuizStore((state) => state.currentQuiz);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const [showConfetti, setShowConfetti] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  // Set window size on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  // Handle redirect and confetti
  useEffect(() => {
    // Redirect if no quiz
    if (!currentQuiz || currentQuiz.score === null) {
      router.push('/quiz/new');
      return;
    }

    // Show confetti for good scores (only once)
    if (!hasShownConfetti && currentQuiz.score >= 70) {
      setShowConfetti(true);
      setHasShownConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentQuiz, router, hasShownConfetti]);

  if (!currentQuiz || currentQuiz.score === null) {
    return null;
  }

  const score = currentQuiz.score;
  const correctCount = currentQuiz.questions.filter((q) => q.isCorrect).length;
  const totalQuestions = currentQuiz.questions.length;

  const getScoreMessage = () => {
    if (score >= 90) return { text: 'Outstanding! 🌟', color: 'text-green-600 dark:text-green-400' };
    if (score >= 70) return { text: 'Great Job! 🎉', color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 50) return { text: 'Good Effort! 💪', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'Keep Practicing! 📚', color: 'text-orange-600 dark:text-orange-400' };
  };

  const scoreMessage = getScoreMessage();

  const toggleQuestion = (index: number) => {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter((i) => i !== index));
    } else {
      setExpandedQuestions([...expandedQuestions, index]);
    }
  };

  const handleRetry = () => {
    resetQuiz();
    router.push('/quiz/new');
  };

  const handleHome = () => {
    resetQuiz();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
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
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${scoreMessage.color}`}>
                {scoreMessage.text}
              </h1>

              <div className="my-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
                >
                  {score}%
                </motion.div>
                <p className="text-xl text-slate-600 dark:text-slate-300 mt-4">
                  {correctCount} out of {totalQuestions} correct
                </p>
              </div>

              <Progress value={score} className="h-3 mb-8" />

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Topic</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{currentQuiz.topic}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Difficulty</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{currentQuiz.difficulty}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Questions</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{totalQuestions}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Another Quiz
                </Button>
                <Button variant="outline" onClick={handleHome}>
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Review Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Review Your Answers
            </h2>

            <div className="space-y-4">
              {currentQuiz.questions.map((question, index) => (
                <Card key={index} className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          question.isCorrect
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {question.isCorrect ? (
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                            Question {index + 1}: {question.question}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-sm">
                              {question.type.replace('-', ' ')}
                            </span>
                            {question.isCorrect ? (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm font-medium">
                                Correct
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm font-medium">
                                Incorrect
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedQuestions.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {expandedQuestions.includes(index) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50/50 dark:bg-slate-800/50"
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Answer:</p>
                          <p className={`font-medium ${
                            question.isCorrect
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-red-700 dark:text-red-300'
                          }`}>
                            {question.userAnswer}
                          </p>
                        </div>

                        {!question.isCorrect && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Correct Answer:</p>
                            <p className="font-medium text-green-700 dark:text-green-300">
                              {question.correctAnswer}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Explanation:</p>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
