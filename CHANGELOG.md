# Changelog

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
