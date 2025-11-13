"use client"

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, BookOpen, Send, RotateCcw, Star, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ComplexityLevel } from '@/types/explainer';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  topic?: string;
  complexity?: ComplexityLevel;
  relatedTopics?: string[];
}

export default function ExplainPage() {
  const [topic, setTopic] = useState('');
  const [complexity, setComplexity] = useState<ComplexityLevel>('intermediate');
  const [context, setContext] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Bookmark store
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked);
  const bookmarks = useBookmarkStore((state) => state.bookmarks);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, currentResponse]);

  const handleExplain = useCallback(async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError('');
    setCurrentResponse('');

    // Add user message to conversation
    const userMessage: Message = {
      role: 'user',
      content: topic.trim(),
      topic: topic.trim(),
      complexity,
    };
    setConversation([userMessage]);

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
                setCurrentResponse(accumulatedText);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Add assistant response to conversation
      const assistantMessage: Message = {
        role: 'assistant',
        content: accumulatedText,
      };
      setConversation((prev) => [...prev, assistantMessage]);
      setCurrentResponse('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate explanation');
    } finally {
      setIsLoading(false);
    }
  }, [topic, complexity, context]);

  const handleFollowUp = useCallback(async () => {
    if (!followUpQuestion.trim()) return;

    setIsLoading(true);
    setError('');
    setCurrentResponse('');

    // Add user follow-up question to conversation
    const userMessage: Message = {
      role: 'user',
      content: followUpQuestion.trim(),
    };
    setConversation((prev) => [...prev, userMessage]);
    setFollowUpQuestion('');

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: followUpQuestion.trim(),
          complexity,
          context: `Previous conversation:\n${conversation.map((m) => `${m.role === 'user' ? 'Question' : 'Answer'}: ${m.content}`).join('\n\n')}`,
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

        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const jsonStr = line.slice(2);
              const parsed = JSON.parse(jsonStr);
              if (parsed) {
                accumulatedText += parsed;
                setCurrentResponse(accumulatedText);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Add assistant response to conversation
      const assistantMessage: Message = {
        role: 'assistant',
        content: accumulatedText,
      };
      setConversation((prev) => [...prev, assistantMessage]);
      setCurrentResponse('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate explanation');
    } finally {
      setIsLoading(false);
    }
  }, [followUpQuestion, complexity, conversation]);

  const handleClearConversation = () => {
    setConversation([]);
    setCurrentResponse('');
    setError('');
    setTopic('');
    setContext('');
    setFollowUpQuestion('');
  };

  const handleToggleBookmark = (message: Message) => {
    const bookmarkForMessage = bookmarks.find((b) => b.explanation === message.content);

    if (bookmarkForMessage) {
      removeBookmark(bookmarkForMessage.id);
    } else {
      const topicText = message.topic || conversation.find((m) => m.topic)?.topic || 'Explanation';
      const complexityLevel = message.complexity || conversation.find((m) => m.complexity)?.complexity || complexity;
      addBookmark(topicText, complexityLevel, message.content);
    }
  };

  // Generate related topics based on the main topic
  const generateRelatedTopics = (mainTopic: string): string[] => {
    // Simple keyword-based related topics generation
    // In a production app, this could be enhanced with AI-generated suggestions
    return [
      `Practical applications of ${mainTopic}`,
      `History and evolution of ${mainTopic}`,
      `Common misconceptions about ${mainTopic}`,
      `Advanced concepts in ${mainTopic}`,
    ];
  };

  const handleRelatedTopicClick = (relatedTopic: string) => {
    setTopic(relatedTopic);
    // Scroll to top to show the input form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // If conversation exists, clear it to start fresh
    if (conversation.length > 0) {
      handleClearConversation();
    }
    // Auto-focus on topic input would be nice but requires a ref
  };

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
            {/* View Bookmarks Button */}
            {bookmarks.length > 0 && (
              <div className="flex justify-end mb-4">
                <Link href="/explain/bookmarks">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <BookmarkCheck className="w-4 h-4" />
                    View Bookmarks ({bookmarks.length})
                  </Button>
                </Link>
              </div>
            )}

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

          {/* Input Form - Only show if no conversation started */}
          {conversation.length === 0 && (
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
          )}

          {/* Conversation Thread */}
          {conversation.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Clear Conversation Button */}
              <div className="flex justify-end mb-4">
                <Button
                  onClick={handleClearConversation}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Conversation
                </Button>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                <AnimatePresence>
                  {conversation.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`p-6 ${
                          message.role === 'user'
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 ml-8'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mr-8'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === 'user'
                                ? 'bg-emerald-600 dark:bg-emerald-700'
                                : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <Sparkles className="w-4 h-4 text-white" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                {message.role === 'user' ? 'Your Question' : 'AI Explanation'}
                              </p>
                              {/* Bookmark Button for Assistant Messages */}
                              {message.role === 'assistant' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleBookmark(message)}
                                  className="flex items-center gap-1 h-7 px-2 -mt-1"
                                >
                                  {isBookmarked(message.content) ? (
                                    <>
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-xs">Saved</span>
                                    </>
                                  ) : (
                                    <>
                                      <Star className="w-4 h-4" />
                                      <span className="text-xs">Save</span>
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                            {message.topic && (
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1 capitalize">
                                {message.complexity} level
                              </p>
                            )}
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                              <div className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Current streaming response */}
                {currentResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mr-8">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                            AI Explanation
                          </p>
                          <div className="prose prose-slate dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                              {currentResponse}
                              <span className="inline-block w-2 h-5 ml-1 bg-emerald-500 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                <div ref={conversationEndRef} />
              </div>

              {/* Related Topics */}
              {!isLoading && conversation.length > 0 && conversation.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800">
                    <h3 className="text-base font-semibold mb-3 text-slate-900 dark:text-slate-100">
                      Related Topics to Explore
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {generateRelatedTopics(conversation[0].topic || topic).map((relatedTopic, index) => (
                        <button
                          key={index}
                          onClick={() => handleRelatedTopicClick(relatedTopic)}
                          className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-sm font-medium"
                        >
                          {relatedTopic}
                        </button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Follow-up Question Input */}
              {!isLoading && conversation.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800">
                    <Label htmlFor="followup" className="text-base font-semibold mb-2 block">
                      Have a follow-up question?
                    </Label>
                    <div className="flex gap-3">
                      <Textarea
                        id="followup"
                        placeholder="Ask for clarification, examples, or dig deeper into any aspect..."
                        value={followUpQuestion}
                        onChange={(e) => setFollowUpQuestion(e.target.value)}
                        className="min-h-[80px] text-base resize-none flex-1"
                        maxLength={200}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleFollowUp();
                          }
                        }}
                      />
                      <Button
                        onClick={handleFollowUp}
                        disabled={!followUpQuestion.trim()}
                        className="h-auto px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </Card>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Features Grid - Only show if no conversation */}
          {conversation.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
            >
              {[
                { label: 'Real-time Streaming', desc: 'See explanations as they generate' },
                { label: 'Adaptive Complexity', desc: 'Choose your learning level' },
                { label: 'Follow-up Questions', desc: 'Dig deeper with continuous dialogue' },
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
          )}
        </div>
      </div>
    </div>
  );
}
