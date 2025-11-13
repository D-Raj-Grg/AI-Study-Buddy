"use client"

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ComplexityLevel } from '@/types/explainer';

export default function ExplainPage() {
  const [topic, setTopic] = useState('');
  const [complexity, setComplexity] = useState<ComplexityLevel>('intermediate');
  const [context, setContext] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExplain = useCallback(async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError('');
    setExplanation('');

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          complexity,
          context: context.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate explanation');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });

        // Parse the data stream format
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Text chunk
            try {
              const jsonStr = line.slice(2);
              const parsed = JSON.parse(jsonStr);
              if (parsed) {
                accumulatedText += parsed;
                setExplanation(accumulatedText);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate explanation');
    } finally {
      setIsLoading(false);
    }
  }, [topic, complexity, context]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Explain Any Concept
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Get clear, comprehensive explanations powered by AI
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 mb-8">
              <div className="space-y-6">
                {/* Topic Input */}
                <div>
                  <Label htmlFor="topic" className="text-base font-semibold mb-2 block">
                    What do you want to understand?
                  </Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., Quantum entanglement, The French Revolution, How neural networks learn, Photosynthesis..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="min-h-[100px] text-base resize-none"
                    maxLength={200}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-slate-500">
                    <span>Be as specific as you like</span>
                    <span>{topic.length}/200</span>
                  </div>
                </div>

                {/* Complexity Level */}
                <div>
                  <Label htmlFor="complexity" className="text-base font-semibold mb-2 block">
                    Complexity Level
                  </Label>
                  <Select value={complexity} onValueChange={(value) => setComplexity(value as ComplexityLevel)} disabled={isLoading}>
                    <SelectTrigger id="complexity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - Simple, easy-to-understand</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Balanced depth and clarity</SelectItem>
                      <SelectItem value="advanced">Advanced - In-depth, technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Optional Context */}
                <div>
                  <Label htmlFor="context" className="text-base font-semibold mb-2 block">
                    Additional Context (Optional)
                  </Label>
                  <Textarea
                    id="context"
                    placeholder="Any specific aspect you want to focus on or prior knowledge you have..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="min-h-[80px] text-base resize-none"
                    maxLength={1000}
                    disabled={isLoading}
                  />
                  <div className="flex justify-end mt-2 text-sm text-slate-500">
                    <span>{context.length}/1000</span>
                  </div>
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
                  onClick={handleExplain}
                  disabled={isLoading || !topic.trim()}
                  className="w-full h-12 text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Explanation...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Explain This Concept
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Explanation Output */}
          {(explanation || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800">
                <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {topic}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 capitalize">
                    {complexity} level explanation
                  </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {isLoading && !explanation ? (
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating your explanation...</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                      {explanation}
                      {isLoading && (
                        <span className="inline-block w-2 h-5 ml-1 bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          >
            {[
              { label: 'Real-time Streaming', desc: 'See explanations as they generate' },
              { label: 'Adaptive Complexity', desc: 'Choose your learning level' },
              { label: 'Comprehensive', desc: 'Detailed with examples' },
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
