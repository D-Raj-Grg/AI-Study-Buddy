import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export interface Bookmark {
  id: string;
  topic: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
  createdAt: Date;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (topic: string, complexity: 'beginner' | 'intermediate' | 'advanced', explanation: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (explanation: string) => boolean;
  searchBookmarks: (query: string) => Bookmark[];
  cleanOldBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (topic, complexity, explanation) => {
        const bookmark: Bookmark = {
          id: nanoid(),
          topic,
          complexity,
          explanation,
          createdAt: new Date(),
        };
        set({ bookmarks: [bookmark, ...get().bookmarks] });
      },

      removeBookmark: (id) => {
        set({ bookmarks: get().bookmarks.filter((b) => b.id !== id) });
      },

      isBookmarked: (explanation) => {
        return get().bookmarks.some((b) => b.explanation === explanation);
      },

      searchBookmarks: (query) => {
        if (!query.trim()) return get().bookmarks;

        const lowerQuery = query.toLowerCase();
        return get().bookmarks.filter(
          (b) =>
            b.topic.toLowerCase().includes(lowerQuery) ||
            b.explanation.toLowerCase().includes(lowerQuery)
        );
      },

      cleanOldBookmarks: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filteredBookmarks = get().bookmarks.filter((b) => {
          const bookmarkDate = new Date(b.createdAt);
          return bookmarkDate > thirtyDaysAgo;
        });

        if (filteredBookmarks.length !== get().bookmarks.length) {
          set({ bookmarks: filteredBookmarks });
        }
      },
    }),
    {
      name: 'study-buddy-bookmarks',
    }
  )
);
