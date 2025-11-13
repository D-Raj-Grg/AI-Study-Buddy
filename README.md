# 🧠 AI Study Buddy

Your AI-powered study companion for smarter learning. Transform any topic into interactive quizzes, flashcards, and clear explanations.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## ✨ Features

### 🎯 AI Quiz Generator
- Generate custom quizzes from any topic
- 4 question types: Multiple Choice, True/False, Short Answer, Fill-in-the-Blank
- 3 difficulty levels: Easy, Medium, Hard
- Instant feedback with explanations
- Confetti celebrations for high scores
- Quiz history with 30-day retention

### 📚 Smart Flashcards
- Auto-generate interactive flashcards
- Beautiful 3D flip animations
- 3 study modes: Study, Shuffle, Quiz
- Mobile swipe gestures (left/right/up)
- Progress tracking with mastery percentage
- Spaced repetition ready

### 💡 Concept Explainer
- Get clear explanations for complex topics
- 3 complexity levels: Beginner, Intermediate, Advanced
- Real-time streaming responses
- Follow-up questions with context
- Bookmark favorite explanations
- Related topics suggestions

### 📊 Study Dashboard
- Comprehensive progress tracking
- Animated stats cards
- Topic history with search and filters
- Quick action buttons
- Study insights with progress bars

### ⏱️ Pomodoro Timer
- Focus timer with 25/5/15 minute cycles
- Customizable durations
- Browser notifications
- Session tracking
- Focus mode toggle
- Auto-start options

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/AI-Study-Buddy.git
cd AI-Study-Buddy
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

4. **Run the development server**
```bash
pnpm dev
# or
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── quiz/generate/    # Quiz generation endpoint
│   │   ├── flashcards/generate/  # Flashcard generation
│   │   └── explain/          # Explanation endpoint
│   ├── dashboard/            # Study dashboard
│   ├── quiz/                 # Quiz pages (new, take, results)
│   ├── flashcards/           # Flashcard pages (new, study, results)
│   ├── explain/              # Explainer & bookmarks
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── timer/                # Pomodoro timer
│   └── error-boundary.tsx    # Error boundary
├── store/                    # Zustand state stores
│   ├── useQuizStore.ts
│   ├── useFlashcardStore.ts
│   ├── useBookmarkStore.ts
│   ├── useDashboardStore.ts
│   └── useTimerStore.ts
├── types/                    # TypeScript type definitions
└── lib/                      # Utilities and configurations
    ├── openai.ts             # OpenAI client
    └── prompts.ts            # AI prompt templates
```

## 🛠️ Tech Stack

### Core
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + @ai-elements/all

### State & Data
- **State Management**: Zustand with persist middleware
- **Data Storage**: localStorage (30-day retention)
- **AI Provider**: OpenAI GPT-4o-mini

### Features
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Streaming**: Vercel AI SDK
- **Theme**: next-themes (dark/light mode)

## 🎨 Design System

The app uses a carefully crafted design system:

- **Colors**: Sky, Indigo, Emerald, Purple gradients
- **Typography**: System fonts for optimal performance
- **Spacing**: Consistent 8px grid
- **Animations**: Smooth 300ms transitions
- **Shadows**: Layered depth with backdrop blur

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
NEXT_PUBLIC_BASE_URL=https://your-domain.com  # For sitemap
```

## 📦 Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Type checking
pnpm type-check   # Run TypeScript compiler
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add `OPENAI_API_KEY` environment variable
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/AI-Study-Buddy)

### Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Docker
- Any Node.js hosting

## 🎯 Usage Guide

### Creating a Quiz

1. Navigate to "New Quiz"
2. Enter your topic (e.g., "Photosynthesis")
3. Select difficulty and question count
4. Choose question types
5. Click "Generate Quiz"
6. Take the quiz and view results

### Studying Flashcards

1. Go to "Create Flashcards"
2. Enter topic and card count
3. Generate flashcards
4. Choose study mode (Study/Shuffle/Quiz)
5. Use flip animations or swipe gestures
6. Mark cards as Know It/Learning/Don't Know

### Getting Explanations

1. Visit "Explain Any Concept"
2. Enter your question
3. Select complexity level
4. View streaming explanation
5. Ask follow-up questions
6. Bookmark important explanations

## 🏗️ Development

### Code Quality

- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (recommended)
- **Type Safety**: Strict TypeScript
- **Git Hooks**: Pre-commit linting (optional)

### Best Practices

1. Always run `pnpm lint` before committing
2. Keep components under 300 lines
3. Use TypeScript interfaces for all data
4. Persist important state with Zustand
5. Add error boundaries for features
6. Test on mobile devices

### Adding New Features

1. Define types in `src/types/`
2. Create Zustand store if needed
3. Build UI components
4. Add API route if required
5. Update TASKS.md
6. Test thoroughly

## 📊 Performance

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: ~ 200kb gzipped

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
```bash
pnpm type-check  # Check for type errors
```

**OpenAI API errors**
- Verify API key in `.env.local`
- Check API quota/limits
- Ensure key has proper permissions

**Animations not working**
- Check Framer Motion version compatibility
- Verify browser supports CSS transforms

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint` and `pnpm build`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI streaming
- [OpenAI](https://openai.com/) - AI models
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](#)
- 🐦 Twitter: [@studybuddy](#)

## 🗺️ Roadmap

- [ ] PDF upload for quiz generation
- [ ] Study groups and collaboration
- [ ] Mobile app (React Native)
- [ ] Voice mode for audio learning
- [ ] Achievement system with badges
- [ ] Advanced spaced repetition algorithm

---

**Built with ❤️ for learners everywhere**
