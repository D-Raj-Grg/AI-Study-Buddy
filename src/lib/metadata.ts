/**
 * Shared metadata configuration for SEO optimization
 * Use these constants to maintain consistency across pages
 */

export const SITE_CONFIG = {
  name: 'Study Buddy',
  description: 'Transform any topic into interactive quizzes, flashcards, and crystal-clear explanations. Study smarter with AI-powered learning tools.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-study-buddy.vercel.app',
  ogImage: '/og-image.svg',
  creator: '@studybuddy',
} as const;

export const DEFAULT_KEYWORDS = [
  'AI study tool',
  'quiz generator',
  'flashcards',
  'study companion',
  'AI learning',
  'educational AI',
  'exam preparation',
  'study helper',
  'concept explainer',
  'spaced repetition',
] as const;

// Page-specific metadata generators
export function generatePageMetadata(
  title: string,
  description?: string,
  image?: string
) {
  return {
    title: `${title} | ${SITE_CONFIG.name}`,
    description: description || SITE_CONFIG.description,
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description: description || SITE_CONFIG.description,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image || SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_CONFIG.name}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_CONFIG.name}`,
      description: description || SITE_CONFIG.description,
      images: [image || SITE_CONFIG.ogImage],
      creator: SITE_CONFIG.creator,
    },
  };
}
