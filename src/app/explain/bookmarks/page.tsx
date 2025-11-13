"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkCheck, Search, Trash2, ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookmarksPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const searchBookmarks = useBookmarkStore((state) => state.searchBookmarks);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);

  const filteredBookmarks = searchQuery ? searchBookmarks(searchQuery) : bookmarks;

  const handleRemove = (id: string) => {
    removeBookmark(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => router.push('/explain')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explainer
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl">
                <BookmarkCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                  Saved Explanations
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">
                  {bookmarks.length} {bookmarks.length === 1 ? 'explanation' : 'explanations'} saved
                </p>
              </div>
            </div>

            {/* Search Bar */}
            {bookmarks.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search bookmarks by topic or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            )}
          </motion.div>

          {/* Bookmarks List */}
          {filteredBookmarks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-12 text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
                <BookmarkCheck className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {searchQuery ? 'No bookmarks found' : 'No saved explanations yet'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Save explanations by clicking the star icon on any AI response'}
                </p>
                <Link href="/explain">
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    Start Exploring
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredBookmarks.map((bookmark, index) => (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        {/* Star Icon */}
                        <div className="flex-shrink-0 mt-1">
                          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {bookmark.topic}
                              </h3>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 capitalize">
                                {bookmark.complexity} level · {new Date(bookmark.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(bookmark.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="prose prose-slate dark:prose-invert max-w-none">
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                              {bookmark.explanation}
                            </div>
                          </div>

                          <Button
                            variant="link"
                            className="mt-3 px-0 text-emerald-600 hover:text-emerald-700"
                            onClick={() => {
                              // Expand to show full explanation
                              const element = document.getElementById(`bookmark-${bookmark.id}`);
                              element?.classList.toggle('line-clamp-4');
                            }}
                          >
                            Show {document.getElementById(`bookmark-${bookmark.id}`)?.classList.contains('line-clamp-4') ? 'more' : 'less'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Stats */}
          {bookmarks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { label: 'Total Saved', value: bookmarks.length },
                { label: 'Beginner', value: bookmarks.filter((b) => b.complexity === 'beginner').length },
                { label: 'Advanced', value: bookmarks.filter((b) => b.complexity === 'advanced').length },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="p-4 text-center bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                >
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {stat.label}
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
