import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerSettings {
  pomodoroDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // After how many pomodoros
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface TimerSession {
  id: string;
  mode: TimerMode;
  duration: number; // in seconds
  completedAt: Date;
}

interface TimerStore {
  // Current timer state
  mode: TimerMode;
  status: TimerStatus;
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  currentPomodoro: number;

  // Settings
  settings: TimerSettings;

  // Session history
  sessions: TimerSession[];
  todaySessions: number;

  // Focus mode
  isFocusMode: boolean;

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  setMode: (mode: TimerMode) => void;
  setTimeRemaining: (seconds: number) => void;
  completeSession: () => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  toggleFocusMode: () => void;
  getTodaySessions: () => number;
  getTotalStudyTime: () => number;
  cleanOldSessions: () => void;
}

const defaultSettings: TimerSettings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  notificationsEnabled: true,
  soundEnabled: true,
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'pomodoro',
      status: 'idle',
      timeRemaining: 25 * 60, // 25 minutes in seconds
      totalTime: 25 * 60,
      currentPomodoro: 0,
      settings: defaultSettings,
      sessions: [],
      todaySessions: 0,
      isFocusMode: false,

      startTimer: () => {
        set({ status: 'running' });
      },

      pauseTimer: () => {
        set({ status: 'paused' });
      },

      resetTimer: () => {
        const { mode, settings } = get();
        const duration = mode === 'pomodoro'
          ? settings.pomodoroDuration
          : mode === 'shortBreak'
          ? settings.shortBreakDuration
          : settings.longBreakDuration;

        set({
          status: 'idle',
          timeRemaining: duration * 60,
          totalTime: duration * 60,
        });
      },

      skipTimer: () => {
        const { mode, currentPomodoro, settings } = get();

        if (mode === 'pomodoro') {
          // After pomodoro, go to break
          const nextPomodoro = currentPomodoro + 1;
          const isLongBreak = nextPomodoro % settings.longBreakInterval === 0;
          const nextMode = isLongBreak ? 'longBreak' : 'shortBreak';
          const duration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration;

          set({
            mode: nextMode,
            status: settings.autoStartBreaks ? 'running' : 'idle',
            currentPomodoro: nextPomodoro,
            timeRemaining: duration * 60,
            totalTime: duration * 60,
          });
        } else {
          // After break, go to pomodoro
          set({
            mode: 'pomodoro',
            status: settings.autoStartPomodoros ? 'running' : 'idle',
            timeRemaining: settings.pomodoroDuration * 60,
            totalTime: settings.pomodoroDuration * 60,
          });
        }
      },

      setMode: (mode) => {
        const { settings } = get();
        const duration = mode === 'pomodoro'
          ? settings.pomodoroDuration
          : mode === 'shortBreak'
          ? settings.shortBreakDuration
          : settings.longBreakDuration;

        set({
          mode,
          status: 'idle',
          timeRemaining: duration * 60,
          totalTime: duration * 60,
        });
      },

      setTimeRemaining: (seconds) => {
        set({ timeRemaining: seconds });
      },

      completeSession: () => {
        const { mode, totalTime } = get();

        const session: TimerSession = {
          id: `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          mode,
          duration: totalTime,
          completedAt: new Date(),
        };

        set((state) => ({
          sessions: [session, ...state.sessions],
          todaySessions: mode === 'pomodoro' ? state.todaySessions + 1 : state.todaySessions,
        }));

        // Automatically move to next session
        get().skipTimer();
      },

      updateSettings: (newSettings) => {
        const { settings, mode } = get();
        const updatedSettings = { ...settings, ...newSettings };

        // If duration changed and timer is idle, update time remaining
        const currentDuration = mode === 'pomodoro'
          ? updatedSettings.pomodoroDuration
          : mode === 'shortBreak'
          ? updatedSettings.shortBreakDuration
          : updatedSettings.longBreakDuration;

        set((state) => ({
          settings: updatedSettings,
          ...(state.status === 'idle' && {
            timeRemaining: currentDuration * 60,
            totalTime: currentDuration * 60,
          }),
        }));
      },

      toggleFocusMode: () => {
        set((state) => ({ isFocusMode: !state.isFocusMode }));
      },

      getTodaySessions: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return get().sessions.filter((s) => {
          const sessionDate = new Date(s.completedAt);
          sessionDate.setHours(0, 0, 0, 0);
          return s.mode === 'pomodoro' && sessionDate.getTime() === today.getTime();
        }).length;
      },

      getTotalStudyTime: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return get().sessions
          .filter((s) => {
            const sessionDate = new Date(s.completedAt);
            sessionDate.setHours(0, 0, 0, 0);
            return s.mode === 'pomodoro' && sessionDate.getTime() === today.getTime();
          })
          .reduce((total, s) => total + s.duration, 0);
      },

      cleanOldSessions: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filteredSessions = get().sessions.filter((s) => {
          const sessionDate = new Date(s.completedAt);
          return sessionDate > thirtyDaysAgo;
        });

        if (filteredSessions.length !== get().sessions.length) {
          set({ sessions: filteredSessions });
        }
      },
    }),
    {
      name: 'study-buddy-timer',
    }
  )
);
