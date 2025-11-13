"use client"

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  X,
  Eye,
  EyeOff,
  Bell,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTimerStore, type TimerMode } from '@/store/useTimerStore';

export function PomodoroTimer() {
  const {
    mode,
    status,
    timeRemaining,
    totalTime,
    currentPomodoro,
    settings,
    isFocusMode,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setMode,
    setTimeRemaining,
    completeSession,
    updateSettings,
    toggleFocusMode,
    getTodaySessions,
    getTotalStudyTime,
  } = useTimerStore();

  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  // Timer completion handler - defined before useEffect
  const handleTimerComplete = useCallback(() => {
    // Show notification
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: mode === 'pomodoro' ? 'Great work! Time for a break.' : 'Break over! Ready to focus?',
        icon: '/icon-192x192.png',
      });
    }

    // Play sound (optional - placeholder)
    if (settings.soundEnabled) {
      // In a real implementation, you would play an audio file here
      console.log('🔔 Timer complete sound');
    }

    completeSession();
  }, [mode, settings, completeSession]);

  // Timer tick logic
  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);

      // Timer completed
      if (timeRemaining <= 1) {
        handleTimerComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, timeRemaining, handleTimerComplete, setTimeRemaining]);

  // Load today's sessions on mount
  useEffect(() => {
    getTodaySessions();
    getTotalStudyTime();
  }, [getTodaySessions, getTotalStudyTime]);

  // Request notification permission
  useEffect(() => {
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.notificationsEnabled]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const getModeLabel = (m: TimerMode): string => {
    switch (m) {
      case 'pomodoro':
        return 'Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  const getModeColor = (m: TimerMode): string => {
    switch (m) {
      case 'pomodoro':
        return 'from-red-500 to-orange-500';
      case 'shortBreak':
        return 'from-green-500 to-emerald-500';
      case 'longBreak':
        return 'from-blue-500 to-cyan-500';
    }
  };

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    setShowSettings(false);
  };

  const todaySessionsCount = getTodaySessions();
  const totalStudyTimeSeconds = getTotalStudyTime();
  const totalStudyTimeMinutes = Math.floor(totalStudyTimeSeconds / 60);

  return (
    <>
      <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getModeColor(mode)} p-2.5 shadow-lg`}>
              <Timer className="w-full h-full text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Pomodoro Timer
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {todaySessionsCount} sessions today · {totalStudyTimeMinutes}m studied
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFocusMode}
              title={isFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
            >
              {isFocusMode ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-8">
          {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode(m)}
              disabled={status === 'running'}
              className={mode === m ? `bg-gradient-to-r ${getModeColor(m)} text-white` : ''}
            >
              {getModeLabel(m)}
            </Button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative mb-8">
          {/* Progress Ring */}
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-200 dark:text-slate-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
              transform="rotate(-90 100 100)"
              initial={false}
              animate={{ strokeDashoffset: `${2 * Math.PI * 90 * (1 - getProgress() / 100)}` }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={mode === 'pomodoro' ? '#ef4444' : mode === 'shortBreak' ? '#10b981' : '#3b82f6'} />
                <stop offset="100%" stopColor={mode === 'pomodoro' ? '#f97316' : mode === 'shortBreak' ? '#059669' : '#06b6d4'} />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                key={timeRemaining}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 tabular-nums"
              >
                {formatTime(timeRemaining)}
              </motion.div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {status === 'running' ? 'In Progress' : status === 'paused' ? 'Paused' : 'Ready to Start'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={resetTimer}
            disabled={status === 'idle' && timeRemaining === totalTime}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button
            size="lg"
            onClick={status === 'running' ? pauseTimer : startTimer}
            className={`w-32 bg-gradient-to-r ${getModeColor(mode)} hover:opacity-90 text-white shadow-lg`}
          >
            {status === 'running' ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={skipTimer}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Current Pomodoro Count */}
        {mode === 'pomodoro' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Session #{currentPomodoro + 1} · Next break in{' '}
              <span className="font-semibold">
                {settings.longBreakInterval - (currentPomodoro % settings.longBreakInterval)}
              </span>{' '}
              pomodoros
            </p>
          </div>
        )}
      </Card>

      {/* Settings Dialog */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Timer Settings
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Duration Settings */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      Duration (minutes)
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">
                          Pomodoro
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="60"
                          value={tempSettings.pomodoroDuration}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              pomodoroDuration: parseInt(e.target.value) || 25,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">
                          Short Break
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={tempSettings.shortBreakDuration}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              shortBreakDuration: parseInt(e.target.value) || 5,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">
                          Long Break
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="60"
                          value={tempSettings.longBreakDuration}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              longBreakDuration: parseInt(e.target.value) || 15,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">
                          Long Break Interval (after # pomodoros)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={tempSettings.longBreakInterval}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              longBreakInterval: parseInt(e.target.value) || 4,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Auto-start Settings */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      Auto-start
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.autoStartBreaks}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              autoStartBreaks: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Auto-start breaks
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.autoStartPomodoros}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              autoStartPomodoros: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Auto-start pomodoros
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      Notifications
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.notificationsEnabled}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              notificationsEnabled: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Enable notifications
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.soundEnabled}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              soundEnabled: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded"
                        />
                        {tempSettings.soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Enable sound
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setTempSettings(settings);
                        setShowSettings(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      onClick={handleSaveSettings}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
