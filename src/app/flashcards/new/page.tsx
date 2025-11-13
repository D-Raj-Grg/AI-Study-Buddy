"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFlashcardStore } from '@/store/useFlashcardStore';

export default function NewFlashcardsPage() {
  const router = useRouter();
  const setCurrentSet = useFlashcardStore((state) => state.setCurrentSet);

  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateFlashcards = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          cardCount: parseInt(cardCount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate flashcards');
      }

      // Store flashcards in Zustand
      setCurrentSet({
        topic: topic.trim(),
        cards: data.cards,
      });

      // Redirect to study page
      router.push('/flashcards/study');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Create Flashcards
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Generate AI-powered flashcards to master any topic
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800">
              <div className="space-y-6">
                {/* Topic Input */}
                <div>
                  <Label htmlFor="topic" className="text-base font-semibold mb-2 block">
                    What do you want to study?
                  </Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., JavaScript Promises, French Vocabulary, Organic Chemistry Reactions, World War II..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="min-h-[120px] text-base resize-none"
                    maxLength={500}
                    disabled={isGenerating}
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-slate-500">
                    <span>Be specific for better results</span>
                    <span>{topic.length}/500</span>
                  </div>
                </div>

                {/* Card Count */}
                <div>
                  <Label htmlFor="cardCount" className="text-base font-semibold mb-2 block">
                    Number of Flashcards
                  </Label>
                  <Select value={cardCount} onValueChange={setCardCount} disabled={isGenerating}>
                    <SelectTrigger id="cardCount">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 cards</SelectItem>
                      <SelectItem value="10">10 cards</SelectItem>
                      <SelectItem value="15">15 cards</SelectItem>
                      <SelectItem value="20">20 cards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateFlashcards}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Flashcards...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Flashcards
                    </>
                  )}
                </Button>

                {/* Info Text */}
                <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                  AI will create high-quality flashcards covering key concepts
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          >
            {[
              { label: 'Flip to Study', desc: 'Interactive card flipping' },
              { label: 'Track Progress', desc: 'Know/Learning/Don\'t Know' },
              { label: 'Multiple Modes', desc: 'Study, Shuffle, Quiz' },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-4 text-center bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {feature.label}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {feature.desc}
                </p>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
