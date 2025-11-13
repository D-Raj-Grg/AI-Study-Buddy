/**
 * Performance optimization utilities
 */

// Debounce function for search inputs and other frequent updates
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll handlers and resize events
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy load images with intersection observer
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string
): () => void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        observer.unobserve(img);
      }
    });
  });

  observer.observe(img);

  return () => observer.disconnect();
}

// Measure component render performance (dev only)
export function measurePerformance(
  componentName: string,
  callback: () => void
): void {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(`[Performance] ${componentName}: ${(end - start).toFixed(2)}ms`);
  } else {
    callback();
  }
}

// Check if device prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Web Vitals reporting helper (for analytics)
export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function reportWebVitals(metric: WebVitalsMetric): void {
  // Log in development, send to analytics in production
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric);
  } else {
    // Send to analytics service (Vercel Analytics will handle this automatically)
    // This is just a placeholder for custom analytics
  }
}
