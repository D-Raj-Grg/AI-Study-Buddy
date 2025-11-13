# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Study Buddy is an AI-powered study companion built with Next.js 16 (App Router), TypeScript, and OpenAI. The app transforms any topic into interactive quizzes, flashcards, and explanations.

**Current Status**: Phase 1 (Foundation) Complete - See TASKS.md for detailed progress tracking.

## Essential Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Build & Production
npm run build        # Production build (must pass before commits)
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint (must pass before commits)
```

**Important**: Always run `npm run lint` and `npm run build` before committing. Both must pass.

## Project Architecture

### App Router Structure

```
src/app/
├── (marketing)/        # Future: Marketing pages group
├── dashboard/          # Future: User dashboard
├── quiz/
│   ├── new/           # Quiz generator form
│   └── [id]/          # Quiz taking interface + results
├── flashcards/
│   ├── new/           # Flashcard generator
│   └── [id]/          # Flashcard study interface
├── explain/           # Concept explainer
└── api/
    ├── quiz/generate/      # Quiz generation API route
    ├── flashcards/generate/ # Flashcard generation API route
    └── explain/            # Explanation API route
```

### State Management (Zustand)

State is managed with Zustand stores in `src/store/`:
- `useQuizStore.ts` - Quiz state, history, current quiz
- `useFlashcardStore.ts` - Flashcard decks, progress tracking
- `useStudyStore.ts` - Global study stats, preferences

**Pattern**: All stores persist to localStorage for session continuity.

### Component Organization

```
src/components/
├── ui/              # shadcn/ui base components (don't modify directly)
├── ai-elements/     # AI-specific UI patterns (from @ai-elements/all)
├── quiz/            # Quiz-specific components
├── flashcards/      # Flashcard-specific components
├── dashboard/       # Dashboard components
├── timer/           # Pomodoro timer components
├── logo.tsx         # Brand logo component
├── mode-toggle.tsx  # Dark/light theme toggle
└── theme-provider.tsx # Theme context provider
```

**Key Conventions**:
- `ui/*` components are from shadcn/ui - modify via `npx shadcn@latest add <component>`
- `ai-elements/*` are third-party, handle type errors with `as any` when needed (see confirmation.tsx, tool.tsx for examples)
- Custom components go in feature-specific folders (`quiz/`, `flashcards/`, etc.)

### Styling & Theming

- **CSS Framework**: Tailwind CSS v4
- **Theme System**: next-themes with system preference detection
- **Design Tokens**: Uses Tailwind's design system
- **Fonts**: System fonts only (Google Fonts blocked in environment)

**Important**: Always use system fonts (`font-sans`, `font-mono`). Do not attempt to import Google Fonts.

### API Integration

OpenAI integration will be in `src/lib/`:
- `openai.ts` - OpenAI client configuration
- `prompts.ts` - Prompt templates for quiz/flashcard/explanation generation

**Pattern**: Use GPT-4o-mini for cost efficiency. All API routes return structured JSON.

## Key Files & Their Purpose

- **PRD.md** - Product Requirements Document (source of truth for features)
- **PLANNING.md** - Development roadmap and technical planning
- **TASKS.md** - Detailed task breakdown with checkboxes (update as you complete tasks)
- **components.json** - shadcn/ui configuration
- **manifest.json** - PWA manifest (already configured)

## Development Workflow

### Adding New Features

1. Check TASKS.md for current phase and next tasks
2. Update task checkboxes in TASKS.md as you complete work
3. Follow the data models defined in PRD.md (Section 3.3)
4. Use Zustand for state management
5. Ensure mobile responsiveness (test with Chrome DevTools)
6. Run lint and build before committing

### Working with shadcn/ui

```bash
# Add a new shadcn component
npx shadcn@latest add <component-name>

# Example
npx shadcn@latest add dialog
```

Components will be added to `src/components/ui/`. Do not manually edit these files.

### Type Errors in Third-Party Components

The `ai-elements` and some shadcn components may have TypeScript errors due to version mismatches. **Approved patterns**:

```typescript
// For state comparisons with extended values
if ((state as any) !== "approval-requested") { ... }

// For Record types with flexible keys
const labels: Record<string, string> = { ... }
```

See `src/components/ai-elements/confirmation.tsx` and `tool.tsx` for examples.

### Animation Patterns

- Use Framer Motion for complex animations
- Micro-interactions: hover effects, scale transforms
- Loading states: Use AI Elements' shimmer/loader components
- Page transitions: fade + slide (300ms duration)

### Environment Variables

Required environment variables (add to `.env.local`):
```
OPENAI_API_KEY=sk-...
```

**Never commit** `.env.local` to git (already in .gitignore).

## Project-Specific Patterns

### Quiz Generation Flow

1. User inputs topic in `/quiz/new`
2. Form sends request to `/api/quiz/generate`
3. API calls OpenAI with prompt template
4. Returns structured JSON with questions
5. Store quiz in Zustand + localStorage
6. Redirect to `/quiz/[id]` for quiz taking
7. Submit answers → calculate score → redirect to results

### Data Persistence

All study data is stored in localStorage:
- Quiz history (30-day retention)
- Flashcard progress
- User preferences
- Study statistics

**Pattern**: Implement cleanup logic to remove data older than 30 days.

### OpenAI API Calls

**Pattern**:
```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",  // Cost-effective choice
  temperature: 0.7,
  response_format: { type: "json_object" },  // For structured outputs
  max_tokens: 2000,
  messages: [{ role: "user", content: prompt }]
});
```

Always handle errors and implement retry logic for failed requests.

## Testing Strategy

**Current Status**: No tests yet (planned for Phase 2)

When implementing tests:
- Unit tests: Quiz logic, answer validation, score calculation
- E2E tests: Use Playwright for full user flows
- Target coverage: >80%

## Common Issues & Solutions

### Build Errors

**Issue**: Google Fonts fetch fails
**Solution**: System fonts only. Already configured in layout.tsx.

**Issue**: TypeScript errors in ai-elements
**Solution**: Use type assertions (`as any`) - this is an approved pattern.

**Issue**: Lint errors in third-party components
**Solution**: These are acceptable. Focus on fixing errors in `src/app/` and custom components.

### Theme Issues

**Issue**: Theme flashing on load
**Solution**: Ensure `suppressHydrationWarning` is on `<html>` tag and ThemeProvider has `disableTransitionOnChange`.

## Performance Targets

- Initial page load: < 2s
- Quiz generation: < 5s
- Flashcard generation: < 6s
- Explanation response: < 4s
- Lighthouse score: > 90

## Documentation Cross-Reference

- **Feature Requirements**: See PRD.md → Section 2 (Core Features)
- **Technical Specs**: See PRD.md → Section 3 (Technical Requirements)
- **Design Guidelines**: See PRD.md → Section 4 (User Experience & Design)
- **Implementation Plan**: See PLANNING.md
- **Task Tracking**: See TASKS.md (update checkboxes as work progresses)
- **Data Models**: See PRD.md → Section 3.3

## Branch Strategy

**Current Branch**: `claude/setup-nextjs-shadcn-dependencies-011CV5Cmk9m4UpTF8eR9bJeb`

All development happens on feature branches prefixed with `claude/`. Push to this branch when work is complete.

---

**Last Updated**: November 13, 2025
**Maintained By**: Development Team
