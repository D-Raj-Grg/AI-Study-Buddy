import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Study Buddy - Your AI-Powered Study Companion",
  description: "Transform any topic into interactive quizzes, flashcards, and crystal-clear explanations. Study smarter with AI-powered learning tools.",
  keywords: [
    "AI study tool",
    "quiz generator",
    "flashcards",
    "study companion",
    "AI learning",
    "educational AI",
    "exam preparation",
    "study helper",
    "concept explainer",
    "spaced repetition",
  ],
  authors: [{ name: "Study Buddy" }],
  creator: "Study Buddy",
  publisher: "Study Buddy",
  applicationName: "Study Buddy",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studybuddy.ai",
    siteName: "Study Buddy",
    title: "Study Buddy - Your AI-Powered Study Companion",
    description: "Transform any topic into interactive quizzes, flashcards, and crystal-clear explanations. Study smarter with AI-powered learning tools.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Study Buddy - AI-Powered Study Companion",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Study Buddy - Your AI-Powered Study Companion",
    description: "Transform any topic into interactive quizzes, flashcards, and crystal-clear explanations. Study smarter with AI.",
    images: ["/og-image.svg"],
    creator: "@studybuddy",
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
  },

  // Manifest
  manifest: "/manifest.json",

  // Additional metadata
  metadataBase: new URL("https://studybuddy.ai"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },

  // Theme color
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0EA5E9" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
