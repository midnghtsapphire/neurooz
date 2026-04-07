# Neurooz — Technical Blueprint

## System Overview
Neurooz is an ADHD-specific productivity and financial guardian web app.

**Stack:** Vite 5 + React 18 + TypeScript 5 (strict) | Tailwind CSS 3 + NativeWind patterns | Supabase (Postgres + Auth + Storage + Edge Functions) | TanStack Query v5 | Radix UI | Framer Motion | Zod | Vitest

## Module Boundaries

### `/src/modules/oz-engine/`
Cognitive mode detection, history, and adaptive UI system.
- `detection.ts` — `detectCognitiveMode()` pure function
- `history.ts` — `useModeHistory()`, `computeModeTimeSummary()`
- `context.tsx` — `OzEngineProvider`, `useOzEngine()`
- `components/CognitiveModeWrapper.tsx` — data-mode attribute injector
- `components/CognitiveModeSelector.tsx` — manual mode picker

### `/src/pages/`
Route-level page components. Each maps 1:1 to a React Router route in `App.tsx`.

### `/src/hooks/`
React Query hooks for all Supabase CRUD operations. Naming convention: `use-{resource}.ts`

### `/src/components/`
Shared UI components. Radix UI primitives in `/ui/`, domain components at root.

### `/supabase/functions/`
Deno edge functions for Stripe billing (create-checkout, check-subscription).

### `/supabase/migrations/`
Timestamped SQL migrations. All schema changes go through migrations — no manual Supabase UI edits.

## Data Flow
```
User Action → React Component → TanStack Query hook → Supabase JS client → Supabase Postgres (RLS enforced)
                                                    ↓
                                           Supabase Edge Function (Stripe billing)
```

## Routing Map
| Path | Page | Description |
|------|------|-------------|
| `/` | Index | Main dashboard |
| `/tasks` | TaskDashboard | Task management hub |
| `/tasks/today` | ShortList | Today's 1-5 priority tasks |
| `/tasks/someday` | LongList | Future/backlog tasks |
| `/tasks/calendar` | Calendar | Calendar view |
| `/tasks/routines` | Routines | Morning/evening checklists |
| `/cognitive-growth` | CognitiveGrowth | Mode history + insights |
| `/oz-engine` | OzEngine | Oz character + mode system |
| `/impulse-control` | ImpulseControl | 24-hour financial holds |
| `/medication-tracker` | MedicationTracker | Medication correlation |
| `/rewards` | RewardsDashboard | Gamification dashboard |
| `/auth` | Auth | Sign in / sign up |
| `/pricing` | Pricing | Subscription tiers |
| `/admin/docs/*` | Admin docs | Internal documentation |

## Environment Variables
See `.env.example` for all required keys.

## Testing
- Unit tests: `npm test` (Vitest)
- Type check: `npm run typecheck`
- Lint: `npm run lint`
- All three must pass before merging to main.
