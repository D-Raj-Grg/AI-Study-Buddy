"use client"

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, BookOpen, Lightbulb, TrendingUp, Target, Calendar, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useDashboardStore } from '@/store/useDashboardStore'; // Reserved for future use
import { useQuizStore } from '@/store/useQuizStore';
import { useFlashcardStore } from '@/store/useFlashcardStore';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Lazy load Pomodoro Timer for better initial page load
const PomodoroTimer = dynamic(() => import('@/components/timer/pomodoro-timer').then(mod => ({ default: mod.PomodoroTimer })), {
  ssr: false,
  loading: () => <div className="h-32 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl" />
});

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'quiz' | 'flashcard' | 'explanation'>('all');

  // Dashboard store (reserved for future use)
  // const studySessions = useDashboardStore((state) => state.studySessions);
  // const totalStudyTime = useDashboardStore((state) => state.totalStudyTime);
  // const getRecentSessions = useDashboardStore((state) => state.getRecentSessions);
  // const getTotalQuizzes = useDashboardStore((state) => state.getTotalQuizzes);
  // const getAverageQuizScore = useDashboardStore((state) => state.getAverageQuizScore);
  // const getTotalFlashcards = useDashboardStore((state) => state.getTotalFlashcards);
  // const getFlashcardMastery = useDashboardStore((state) => state.getFlashcardMastery);

  // Other stores
  const quizHistory = useQuizStore((state) => state.quizHistory);
  const flashcardSets = useFlashcardStore((state) => state.flashcardSets);
  const bookmarks = useBookmarkStore((state) => state.bookmarks);

  // Calculate stats
  const totalQuizzes = quizHistory.length;
  const averageScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((sum, q) => sum + (q.score || 0), 0) / quizHistory.length)
    : 0;
  const totalFlashcardSets = flashcardSets.length;
  const averageMastery = flashcardSets.length > 0
    ? Math.round(flashcardSets.reduce((sum, s) => sum + (s.masteryPercentage || 0), 0) / flashcardSets.length)
    : 0;

  // Filtered history
  const allHistory = [
    ...quizHistory.map((q) => ({
      id: q.id,
      type: 'quiz' as const,
      topic: q.topic,
      timestamp: new Date(q.completedAt || q.createdAt),
      score: q.score,
      details: { questionsCount: q.questions.length, difficulty: q.difficulty },
    })),
    ...flashcardSets.map((f) => ({
      id: f.id,
      type: 'flashcard' as const,
      topic: f.topic,
      timestamp: new Date(f.lastStudied || f.createdAt),
      score: f.masteryPercentage,
      details: { cardsCount: f.cards.length },
    })),
    ...bookmarks.map((b) => ({
      id: b.id,
      type: 'explanation' as const,
      topic: b.topic,
      timestamp: new Date(b.createdAt),
      details: { complexity: b.complexity },
    })),
  ];

  const filteredHistory = allHistory
    .filter((item) => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (searchQuery && !item.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  // Animated counter hook
  const useAnimatedCounter = (target: number, duration = 1000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, [target, duration]);
    return count;
  };

  const animatedQuizzes = useAnimatedCounter(totalQuizzes);
  const animatedScore = useAnimatedCounter(averageScore);
  const animatedFlashcards = useAnimatedCounter(totalFlashcardSets);
  const animatedMastery = useAnimatedCounter(averageMastery);

  const stats = [
    {
      label: 'Total Quizzes',
      value: animatedQuizzes,
      icon: Brain,
      gradient: 'from-blue-500 to-cyan-500',
      suffix: '',
    },
    {
      label: 'Avg Quiz Score',
      value: animatedScore,
      icon: Target,
      gradient: 'from-green-500 to-emerald-500',
      suffix: '%',
    },
    {
      label: 'Flashcard Sets',
      value: animatedFlashcards,
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-500',
      suffix: '',
    },
    {
      label: 'Avg Mastery',
      value: animatedMastery,
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      suffix: '%',
    },
  ];

  const quickActions = [
    {
      label: 'New Quiz',
      description: 'Generate a quiz on any topic',
      icon: Brain,
      gradient: 'from-blue-500 to-cyan-500',
      href: '/quiz/new',
    },
    {
      label: 'Create Flashcards',
      description: 'Make flashcards to study',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-500',
      href: '/flashcards/new',
    },
    {
      label: 'Ask Question',
      description: 'Get an explanation',
      icon: Lightbulb,
      gradient: 'from-emerald-500 to-teal-500',
      href: '/explain',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return Brain;
      case 'flashcard':
        return BookOpen;
      case 'explanation':
        return Lightbulb;
      default:
        return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'flashcard':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'explanation':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Study Dashboard
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Track your progress and continue learning
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5 flex items-center justify-center`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                          {stat.value}{stat.suffix}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}>
                    <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} p-2.5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-full h-full text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                            {action.label}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {action.description}
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Pomodoro Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Focus Timer
            </h2>
            <PomodoroTimer />
          </motion.div>

          {/* Recent Activity & Topic History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Topic History
                  </h2>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Search topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48"
                    />
                    <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | 'quiz' | 'flashcard' | 'explanation')}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="flashcard">Flashcard</SelectItem>
                        <SelectItem value="explanation">Explain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {filteredHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <p className="text-slate-600 dark:text-slate-400">
                      {searchQuery ? 'No matching topics found' : 'No study history yet'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                      {searchQuery ? 'Try a different search term' : 'Start studying to see your history here'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredHistory.map((item, index) => {
                      const Icon = getTypeIcon(item.type);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {item.topic}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {item.timestamp.toLocaleDateString()} · {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                {item.type === 'quiz' && item.details && 'questionsCount' in item.details && ` · ${item.details.questionsCount} questions`}
                                {item.type === 'flashcard' && item.details && 'cardsCount' in item.details && ` · ${item.details.cardsCount} cards`}
                                {item.type === 'quiz' && item.details && 'difficulty' in item.details && ` · ${item.details.difficulty}`}
                                {item.type === 'explanation' && item.details && 'complexity' in item.details && ` · ${item.details.complexity}`}
                              </p>
                            </div>
                            {'score' in item && item.score !== undefined && (
                              <div className="text-right">
                                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                  {item.score}%
                                </p>
                                <p className="text-xs text-slate-500">
                                  {item.type === 'quiz' ? 'Score' : 'Mastery'}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Study Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Study Insights
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Quiz Performance</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{averageScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${averageScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Flashcard Mastery</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{averageMastery}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${averageMastery}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {allHistory.length}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Total Sessions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {bookmarks.length}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Saved Explanations
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Motivational Card */}
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <h3 className="text-lg font-bold mb-2">Keep it up!</h3>
                <p className="text-sm opacity-90 mb-4">
                  You&apos;re making great progress. Consistency is key to mastering any subject.
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push('/quiz/new')}
                >
                  Start Learning
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
