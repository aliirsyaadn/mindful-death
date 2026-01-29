# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

MindfulDeath is a Next.js 14 App Router application for life expectancy visualization and goal tracking, targeting Indonesian users. It's entirely client-side with localStorage persistence (no backend).

### Key Directories

- `src/app/` - Next.js App Router pages (page.tsx files are client components with `"use client"`)
- `src/components/ui/` - Reusable UI primitives (button, card, input, progress)
- `src/components/countdown/` - LiveCountdown component for real-time display
- `src/lib/` - Core logic:
  - `calculator.ts` - Life expectancy calculations using Indonesian BPS 2023 data
  - `storage.ts` - localStorage wrapper with `mindfuldeath_user_data` key
  - `constants.ts` - Life stages, goal categories, defaults
  - `research-data.ts` - Indonesian health statistics and lifestyle factors
- `src/types/index.ts` - All TypeScript interfaces (UserData, Goal, AssessmentData, LifeEstimate)

### Data Flow

1. User enters birthdate + gender on home page (`/`)
2. `calculateLifeExpectancy()` computes estimates from Indonesian data
3. UserData stored in localStorage via `saveUserData()`
4. Dashboard and other pages read via `getUserData()`

### Important Patterns

- All pages use `"use client"` directive for interactivity
- Components check `mounted` state before rendering to avoid hydration mismatches
- `isBrowser()` guard for localStorage access
- Calculations use Indonesian-specific data (BPS 2023: male 69.9, female 73.8 years)

### Technology Stack

- **Framework**: Next.js 14.2 with App Router
- **Styling**: Tailwind CSS with custom theme (primary: #18181B, secondary: #EF4444, accent: #22C55E)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **i18n**: next-intl (Indonesian language)

### Key Types

```typescript
type PlanType = 'death' | 'retirement'
type Gender = 'male' | 'female'
type LifeStage = 'muda' | 'produktif' | 'mapan' | 'prapensiun' | 'pensiun'
type GoalCategory = 'karir' | 'keluarga' | 'kesehatan' | 'keuangan' | 'spiritual' | 'pendidikan' | 'pengalaman' | 'warisan'
```
