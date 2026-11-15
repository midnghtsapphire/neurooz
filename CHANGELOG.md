# Changelog

## [Unreleased]

### Added
- SEO shell for https://neurooz.com: title, description, canonical URL, Open Graph, Twitter card, JSON-LD, sitemap, and robots.txt
- Per-route titles for the main public pages, and a landing heading that states the ADHD / neurodivergent problem
- App error boundary, session timeout when Supabase is missing or down, and content-hashed build assets
- Local deploy scripts: `deploy:cf` (Cloudflare Pages) and `deploy:do` (DigitalOcean rsync). See DEPLOY.md
- Standard review jury workflows: OpenRouter AI PR review, Jules, Semgrep SAST, CodeQL
- CONTRIBUTING.md and OVERVIEW.md
- Dependabot for npm and GitHub Actions
- Vitest coverage for Financial Guardian impulse detection utilities

### Changed
- Canonical production URL in the README and package.json homepage is https://neurooz.com
- GitHub Actions deploy job commented out (2026-11-14). Deploys are local
- `@vitejs/plugin-react-swc` bumped to v4 so `npm ci` resolves with Vite 8
- README refreshed (removed Lovable boilerplate; added Test matrix and scripts table)
- Bumped `vite` to v6 and `react-router-dom` to v7 to clear npm audit findings

### Security
- `npm audit` now reports 0 vulnerabilities



All notable changes to Neurooz are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [Unreleased]

## [0.2.0] — 2026-04-06 — Sprint 1: Oz Engine Core
### Added
- CognitiveMode type extended with "creative" mode
- `detectCognitiveMode()` rule-based detection engine (7 time windows, load overrides)
- `getCognitiveModeDataAttr()` CSS data attribute mapper
- `useCognitiveModeDetection()` React hook (refreshes every minute)
- `CognitiveModeWrapper` component with Urban Oz CSS variable injection
- `useModeHistory` hook — localStorage mode transition log (capped at 200 entries)
- `computeModeTimeSummary()` pure function for time-in-mode analytics
- `OzEngineProvider` wired into App.tsx as global context
- Cognitive Growth Dashboard page at `/cognitive-growth`
- Vitest configured — 27 tests passing (19 detection + 8 mode history)
- 10 docs ported from revvel-standards into `docs/` directory

## [0.1.0] — 2026-03-01 — Sprint 0: Foundation
### Added
- Brain Dump system with AI processing, file upload, Supabase storage
- Projects system with hooks and pages
- ImpulseControl, MedicationTracker, RewardsDashboard ADHD features
- Task management pages: TaskDashboard, ShortList, LongList, Calendar, Routines
- Supabase migrations (30+ migrations)
- Oz Engine character system foundation
- Full Pricing page with 5 tiers
- Urban Oz theme and index.css cognitive mode CSS variables
- IMPLEMENTATION_AUDIT.md, NEUROOZ_AUDIT_PLAN.md, AGENTS.md
