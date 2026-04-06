# Neurooz Audit & Improvement Plan

## Sources Reviewed
- **Neurooz repository**: all top-level files, `/src` pages and components (task system, docs, Oz Engine, Epstein page), Supabase functions under `/supabase/functions`, SQL schema in `supabase_feedback_schema.sql`, public assets/patches, build artifacts, and tooling configs.
- **Docs already in repo**: `AGENTS.md`, `IMPLEMENTATION_AUDIT.md`, admin docs pages (`src/pages/Overview.tsx`, `Implementation.tsx`, `Database.tsx`, `CodeExamples.tsx`, `Deployment.tsx`, `Research.tsx`, `Changelog.tsx`).
- **Missing references**: could not find `revvel-standards` or `growlingeyes` folders or files; add or link them so requirements can be satisfied.

## Current State Snapshot
- Stack: Vite + React 18 + TypeScript, Tailwind, Radix UI, TanStack Query, Supabase client, Stripe edge functions (`supabase/functions/*`), heavy UI asset set, and Lovable scaffolding.
- Features present: Brain Dump with AI action extraction, 4-list ADHD task pages (TaskDashboard, ShortList, LongList, Routines, CalendarPage), Oz Engine gamification, extensive admin documentation UI, Stripe checkout/customer portal functions, donation/tax/finance pages, and an investigative Epstein content page with media.
- Deployment aids: downloadable patch files in `public/patches`, deployment instructions in `src/pages/Deployment.tsx`, and a prebuilt bundle (`neurooz-deploy.zip`).
- Quality signals: build succeeds (`npm run build`), but linting reports 115 errors/warnings (mostly `any` types, hook rules, lint config issues). No test script exists. No `.env.example` is present.

## Compliance & Documentation Actions (make Neurooz “compliant and fully documented”)
1) **Define environment contract**  
   - Add `.env.example` listing required keys (Supabase URL/ANON/SERVICE_ROLE, Stripe secret/webhook signing secrets, optional OpenAI/local LLM keys, analytics flags).
   - Document expected runtime for Supabase functions (Deno) and frontend (`VITE_` prefixes), and where secrets are used (`supabase/functions/create-checkout/index.ts`, `supabase/functions/check-subscription/index.ts`, `supabase/functions/customer-portal/index.ts`, `supabase/functions/customer-portal/index.ts`, `src/integrations/supabase/client`).
2) **Security & privacy**  
   - Review public Epstein content in `src/pages/Epstein.tsx` and `/public/articles/*` for legal/privacy exposure; add explicit disclaimers, sourcing, and moderation controls before launch.  
   - Ensure RLS policies exist for new tables (tasks/routines/gamification); if migrations are only in patch files, convert to Supabase SQL migrations and verify policies.  
   - Replace `*` CORS in edge functions with allowed origins; log sensitive data minimally; switch `@ts-ignore` to `@ts-expect-error` and avoid `any` in hooks that touch user data.
3) **Documentation completeness**  
   - Merge admin docs content with a CONTRIBUTING/OPERATIONS guide summarizing how to apply patches, run Supabase migrations, and seed data.  
   - Keep a single source of truth for roadmap (update `IMPLEMENTATION_AUDIT.md` with current status and link to this audit).  
   - Add architectural diagram (routing map + data flow) and dependency graph to `/docs` or `/public`.
4) **Governance & accessibility**  
   - Audit content for ADA alignment; ensure ARIA labels and keyboard paths are present on interactive components (`src/components`), and enable prefers-reduced-motion fallbacks (Framer Motion heavy pages like `src/pages/Epstein.tsx`).  
   - Add privacy/terms links in navbar/footer; ensure analytics is opt-in and documented.

## Codebase Improvement Plan (prioritized)
1) **Stabilize build quality**  
   - Fix lint baseline: remove `any`, clean hook dependency warnings, address `@ts-ignore`, replace `require()` in `tailwind.config.ts`, and resolve unused/empty blocks (`src/hooks/use-cognitive-load.ts`, `src/hooks/use-drift-detection.ts`).  
   - Introduce a small test harness (Vitest + Testing Library) for critical flows: BrainDump parsing, task CRUD hooks, Oz gamification calculator. (No tests currently.)
2) **Data correctness & migrations**  
   - Move patch-based SQL into versioned migrations (`supabase/migrations`) and add checks that task/gamification tables exist; create seed scripts for demo data.  
   - Add type-safe Supabase client definitions and Zod schemas for API boundaries (`src/lib/import-validation.ts` currently uses `any`).
3) **Feature completeness**  
   - Wire task/routine/gamification pages to Supabase (currently mostly UI). Ensure `use-tasks`/`use-routines` write/read the correct tables and enforce the 4-list constraints server-side.  
   - Implement notification delivery (browser push/email) and calendar sync (Google) as outlined in `IMPLEMENTATION_AUDIT.md`.  
   - Add image handling via `expo-image` equivalent or optimized `<img>` usage for musician-style assets.
4) **Performance & UX**  
   - Code-split large bundles (current `dist/assets/index-Dx_aVtdq.js` ≈ 2.4MB); add route-level lazy loading and manual chunks.  
   - Optimize heavy pages (Epstein, Oz Engine, TornadoAlley) with memoization and reduced animation cost; leverage React Query caching windows.  
   - Add offline/low-connectivity handling for task capture.
5) **Ops & reliability**  
   - Add CI with lint + typecheck + build gates; optional preview deploy.  
   - Add observability hooks (Sentry/OpenTelemetry-compatible tracing) and feature flags for experimental pages.  
   - Include backup/retention plan for Supabase storage and database (RLS + backups).

## Detailed Plan of Code Changes (actionable next steps)
- **Tooling & safety**
  - Add `.env.example` and enforce `.env` in `.gitignore`; add `npm test` script placeholder (Vitest) and `npm run typecheck` using `tsc --noEmit`.
  - Configure ESLint overrides for Supabase functions (Deno) and tighten TypeScript strictness in `tsconfig.json` if feasible.
- **Database & server**
  - Convert SQL from patch/migration notes into `supabase/migrations/*.sql` (tasks, routines, gamification, notifications, user preferences).  
  - Update Supabase edge functions to validate inputs (Zod) and restrict CORS origins; log with structured metadata.  
  - Add webhook handler for Stripe subscription status and link it to `notifications` table.
- **Frontend features**
  - Finalize data plumbing in `src/hooks/use-tasks.ts` and related pages (`src/pages/TaskDashboard.tsx`, `ShortList.tsx`, `LongList.tsx`, `Calendar.tsx`, `Routines.tsx`) with Supabase CRUD + optimistic updates + error toasts.  
  - Connect BrainDump action items to task creation (CTA already present) and add linkbacks to projects.  
  - Add notification center UI and quiet-hours/preferences screen; wire Oz messages (`src/utils/ozMessages.ts`) to real triggers.
- **Quality & accessibility**
  - Resolve lint items highlighted in `npm run lint`, focusing on hook rules and `any` removal (`src/components/BrainDumpDialog.tsx`, `KanbanBoard.tsx`, `ProjectCompletionScorer.tsx`, `use-device-sensors.ts`, etc.).  
  - Add integration tests for BrainDump → Task flow and gamification level progression; add a11y smoke tests for key routes.  
  - Provide ARIA/keyboard support and reduced-motion variants on animated pages (Epstein, TornadoAlley).

## Why agents may not be “shipping apps” & how to fix it
- **Observed blockers**: missing test script, failing lint baseline (115 issues), unclear environment contract (no `.env.example`), reliance on external patch files in `/public/patches` instead of merged code, and large scope across finance/ADHD/gamification/investigative content.  
- **Process fixes**:
  1. Create a **ready-to-run template**: `.env.example`, `npm test` scaffold, and a short `CONTRIBUTING.md` with run/lint/build steps.  
  2. **Automate gates**: CI for lint + typecheck + build; block merges without green checks.  
  3. **Reduce ambiguity**: keep a single living roadmap (update `IMPLEMENTATION_AUDIT.md` + this plan) and mark experimental pages as optional.  
  4. **Bundle patch content** directly into main to avoid manual `git apply` steps.  
  5. **Small PRs with checklists**: enforce reviewer checklist (env variables, migrations, tests, a11y, perf).  
  6. **Add seeds/demo data** so features can be verified quickly without external setup.

## Blue-Ocean / Cutting-Edge Differentiators
- **Adaptive cognitive load engine**: Use on-device signals (motion via `use-device-sensors.ts`) plus session behavior to modulate UI density, delay notifications, and auto-suggest “dopamine break” tasks.  
- **Contextual co-pilot**: Local/offline-friendly LLM (Llama/OLLaMa) for task rewrites, calendar negotiation, and financial guardrails; cache embeddings client-side for privacy.  
- **Rhythmic scheduling**: Circadian-aware planner that shifts task slots based on sleep/medication data (user-provided) and adds prep/transition buffers; syncs to Google/Apple calendars.  
- **Energy-saving/green coding**: Lazy-load heavy visuals, use responsive images, and schedule background syncs to low-CPU windows; track CO₂ savings in `GardenRewards` and surface to users.  
- **Social accountability loops**: Opt-in “wizard mentor” nudges, buddy checks, and streak sharing with privacy controls; leverage Web Push + email.  
- **Financial guardian layer**: Real-time purchase intent detection (ImpulseControl page) tied to bank/sync APIs with friction steps (cool-down timers, alternative recommendations).

## Quick Wins (1–2 day sprint)
- Add `.env.example`, CONTRIBUTING blurb, and CI skeleton.  
- Merge patch-based code into main repo structure; remove dependency on manual `git apply`.  
- Fix highest-impact lint errors (hook order in `src/components/OzEngine/VoidEvent.tsx`, `any` in task hooks/components).  
- Add basic Vitest + RTL setup with one test (BrainDump → task conversion).  
- Introduce route-based lazy loading for `/epstein`, `/tornado-alley`, `/oz-engine`, `/tasks/*` to cut bundle size.
