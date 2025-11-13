"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Difficulty, QuestionType } from '@/types/quiz';
import { useQuizStore } from '@/store/useQuizStore';

export default function NewQuizPage() {
  const router = useRouter();
  const setCurrentQuiz = useQuizStore((state) => state.setCurrentQuiz);

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['multiple-choice', 'true-false']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const characterCount = topic.length;
  const maxCharacters = 500;

  const toggleQuestionType = (type: QuestionType) => {
    if (questionTypes.includes(type)) {
      // Don't allow removing the last type
      if (questionTypes.length > 1) {
        setQuestionTypes(questionTypes.filter((t) => t !== type));
      }
    } else {
      setQuestionTypes([...questionTypes, type]);
    }
  };

  const handleGenerateQuiz = async () => {
    // Validation
    if (!topic.trim()) {
      setError('Please enter a topic to study');
      return;
    }

    if (topic.trim().length < 3) {
      setError('Topic must be at least 3 characters');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          difficulty,
          questionCount,
          questionTypes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();

      // Save to store
      setCurrentQuiz({
        topic: topic.trim(),
        difficulty,
        questions: data.questions,
      });

      // Navigate to quiz interface
      router.push('/quiz/take');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-purple-100 dark:from-blue-950 dark:to-purple-950 opacity-50" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Generate Your Quiz
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Enter any topic and let AI create a personalized quiz for you
            </p>
          </div>

          {/* Quiz Generator Form */}
          <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="space-y-6">
              {/* Topic Input */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  What do you want to study?
                </label>
                <Textarea
                  id="topic"
                  placeholder="e.g., Photosynthesis, World War II, Python Programming, Shakespeare's Macbeth..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-[120px] text-base"
                  maxLength={maxCharacters}
                  disabled={isGenerating}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">
                    Be specific for better questions
                  </span>
                  <span className={`text-xs ${characterCount > maxCharacters * 0.9 ? 'text-orange-600' : 'text-slate-500'}`}>
                    {characterCount}/{maxCharacters}
                  </span>
                </div>
              </div>

              {/* Difficulty Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      disabled={isGenerating}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div>
                <label htmlFor="count" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Number of Questions
                </label>
                <Select
                  value={questionCount.toString()}
                  onValueChange={(value) => setQuestionCount(parseInt(value))}
                  disabled={isGenerating}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 questions</SelectItem>
                    <SelectItem value="10">10 questions</SelectItem>
                    <SelectItem value="15">15 questions</SelectItem>
                    <SelectItem value="20">20 questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                  Question Types
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'multiple-choice' as QuestionType, label: 'Multiple Choice', icon: '📝' },
                    { type: 'true-false' as QuestionType, label: 'True/False', icon: '✓✗' },
                    { type: 'short-answer' as QuestionType, label: 'Short Answer', icon: '✍️' },
                    { type: 'fill-blank' as QuestionType, label: 'Fill in Blank', icon: '___' },
                  ].map(({ type, label, icon }) => (
                    <button
                      key={type}
                      onClick={() => toggleQuestionType(type)}
                      disabled={isGenerating}
                      className={`py-3 px-4 rounded-lg font-medium text-left transition-all ${
                        questionTypes.includes(type)
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-xl mr-2">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Select at least one type (selected: {questionTypes.length})
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerateQuiz}
                disabled={isGenerating || !topic.trim()}
                className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Generating Your Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-5 h-5" />
                    Generate Quiz
                  </>
                )}
              </Button>

              {isGenerating && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-slate-500"
                >
                  This usually takes 3-5 seconds...
                </motion.p>
              )}
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: '🎯', title: 'Personalized', desc: 'Questions tailored to your topic' },
              { icon: '⚡', title: 'Instant', desc: 'Generated in seconds' },
              { icon: '💡', title: 'Educational', desc: 'Learn from explanations' },
            ].map((feature) => (
              <Card key={feature.title} className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur border-slate-200 dark:border-slate-800 text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
