"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuizStore } from '@/store/useQuizStore';
import { Question } from '@/types/quiz';

export default function TakeQuizPage() {
  const router = useRouter();
  const currentQuiz = useQuizStore((state) => state.currentQuiz);
  const submitAnswer = useQuizStore((state) => state.submitAnswer);
  const completeQuiz = useQuizStore((state) => state.completeQuiz);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Redirect if no quiz
    if (!currentQuiz) {
      router.push('/quiz/new');
    }
  }, [currentQuiz, router]);

  if (!currentQuiz) {
    return null;
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
  const hasAnswered = currentQuiz.userAnswers[currentQuestionIndex] !== null;

  const handleAnswerSelect = (answer: string) => {
    if (!hasAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    submitAnswer(currentQuestionIndex, selectedAnswer);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Complete quiz and go to results
      completeQuiz();
      router.push('/quiz/results');
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(currentQuiz.userAnswers[currentQuestionIndex - 1] || '');
      setShowFeedback(true); // Show feedback for already answered questions
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {currentQuiz.topic}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentQuiz.difficulty.charAt(0).toUpperCase() + currentQuiz.difficulty.slice(1)} Level
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Question</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {currentQuestionIndex + 1} / {currentQuiz.questions.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 shadow-xl">
                {/* Question */}
                <div className="mb-8">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {currentQuestion.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Answer Options */}
                <div className="space-y-3 mb-8">
                  {renderAnswerInput(currentQuestion, selectedAnswer, hasAnswered, handleAnswerSelect, setSelectedAnswer)}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {showFeedback && hasAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-6 rounded-lg ${
                        currentQuestion.isCorrect
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {currentQuestion.isCorrect ? (
                          <Check className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-semibold mb-2 ${
                            currentQuestion.isCorrect
                              ? 'text-green-900 dark:text-green-100'
                              : 'text-red-900 dark:text-red-100'
                          }`}>
                            {currentQuestion.isCorrect ? 'Correct!' : 'Incorrect'}
                          </p>
                          {!currentQuestion.isCorrect && (
                            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                              Correct answer: {currentQuestion.correctAnswer}
                            </p>
                          )}
                          <p className={`text-sm ${
                            currentQuestion.isCorrect
                              ? 'text-green-800 dark:text-green-200'
                              : 'text-red-800 dark:text-red-200'
                          }`}>
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {!hasAnswered ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isLastQuestion ? 'View Results' : 'Next Question'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function renderAnswerInput(
  question: Question,
  selectedAnswer: string,
  hasAnswered: boolean,
  handleAnswerSelect: (answer: string) => void,
  setSelectedAnswer: (answer: string) => void
) {
  switch (question.type) {
    case 'multiple-choice':
      return question.options?.map((option, index) => {
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        const isSelected = selectedAnswer === letter;
        const isCorrect = question.correctAnswer === letter;
        const showResult = hasAnswered;

        return (
          <button
            key={index}
            onClick={() => handleAnswerSelect(letter)}
            disabled={hasAnswered}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              showResult && isCorrect
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : showResult && isSelected && !isCorrect
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
            } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="font-semibold mr-3">{letter}.</span>
            {option.replace(/^[A-D]\.\s*/, '')}
          </button>
        );
      });

    case 'true-false':
      return ['True', 'False'].map((option) => {
        const isSelected = selectedAnswer === option;
        const isCorrect = question.correctAnswer === option;
        const showResult = hasAnswered;

        return (
          <button
            key={option}
            onClick={() => handleAnswerSelect(option)}
            disabled={hasAnswered}
            className={`w-full p-6 text-center rounded-lg border-2 text-lg font-semibold transition-all ${
              showResult && isCorrect
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : showResult && isSelected && !isCorrect
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
            } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {option}
          </button>
        );
      });

    case 'short-answer':
    case 'fill-blank':
      return (
        <textarea
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.target.value)}
          disabled={hasAnswered}
          placeholder="Type your answer here..."
          className="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg min-h-[100px] focus:border-blue-500 focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
        />
      );

    default:
      return null;
  }
}
