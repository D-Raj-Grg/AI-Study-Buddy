"use client"

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            We encountered an unexpected error. Don&apos;t worry, your data is safe.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-auto max-h-48 text-red-600 dark:text-red-400">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              size="lg"
              variant="outline"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Home
            </Button>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-500 mt-6">
            If the problem persists, please refresh the page
          </p>
        </div>
      </Card>
    </div>
  );
}
