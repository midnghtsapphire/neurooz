# SHIP_STATUS.md — neurooz

> Machine-readable status of every workstream. Updated by humans and agents.
> Audited weekly by `ship-status-audit.yml`. Nothing sits in limbo.

## Terminal States Reference

| Artifact Type | Terminal States |
|---|---|
| Proposal | `shipped`, `rejected`, `superseded` |
| Bug | `fixed-deployed`, `wontfix-documented` |
| Feature | `deployed`, `cancelled-documented` |
| Research | `published`, `abandoned-documented` |
| Decision (ADR) | `accepted`, `rejected`, `superseded` |
| Refactor | `completed`, `abandoned-documented` |

## Active Workstreams

| ID | Artifact | Type | Status | Owner | Deadline | Last Touched | Notes |
|---|---|---|---|---|---|---|---|
| NZ-001 | Oz Engine™ cognitive mode detection | feature | active | @midnghtsapphire | none | 2026-04-25 | Sprint 0-1 complete, Focus/Creative/Executive/Rest modes working |
| NZ-002 | Brain Dump + Tornado Alley | feature | active | @midnghtsapphire | none | 2026-04-25 | UI working, needs Supabase for persistence |
| NZ-003 | Kanban board (Yellow Brick Road) | feature | active | @midnghtsapphire | none | 2026-04-25 | Basic board exists, needs life/work categories |
| NZ-004 | Impulse Control module | feature | active | @midnghtsapphire | none | 2026-04-25 | Amazon cart-parking pattern |
| NZ-005 | Breathing exercises + grounding | feature | active | @midnghtsapphire | none | 2026-04-25 | 4 techniques working (Box, 4-7-8, Calm, Deep Relaxation) |
| NZ-006 | Supabase integration | feature | blocked | @midnghtsapphire | none | 2026-04-25 | Needs credentials; app runs with placeholder fallback |
| NZ-007 | Auth page branding | bug | active | @midnghtsapphire | none | 2026-04-25 | Still says "NomadTaxes" instead of Neurooz |
| NZ-008 | Financial Guardian (Sprint 2) | feature | active | @midnghtsapphire | none | 2026-04-25 | Next sprint per roadmap |
| NZ-009 | Creative asset pipeline (logo, favicon, app icons) | feature | active | @midnghtsapphire | none | 2026-04-25 | Modern Oz characters exist, need logo/favicon |
| NZ-010 | Ship Everything structure | feature | implementing | @midnghtsapphire | none | 2026-04-25 | This PR |

## Completed / Terminal

| ID | Artifact | Type | Terminal State | Date | Notes |
|---|---|---|---|---|---|
| NZ-100 | Fix 92 lint errors | bug | fixed-deployed | 2026-04-25 | PR #11 merged |
| NZ-101 | Fix Supabase client crash | bug | fixed-deployed | 2026-04-25 | PR #11 — placeholder fallback + console.warn |
| NZ-102 | AGENTS.md Sessiono→Neurooz | bug | fixed-deployed | 2026-04-25 | PR #11 |
| NZ-103 | StickyNotesInbox category data loss | bug | fixed-deployed | 2026-04-25 | PR #11 |
| NZ-104 | ProjectCompletionScorer empty updates | bug | fixed-deployed | 2026-04-25 | PR #11 |
| NZ-105 | Tailwind animate plugin loading | bug | fixed-deployed | 2026-04-25 | PR #11 |
| NZ-106 | Focus score badge display | bug | fixed-deployed | 2026-04-25 | PR #11 |
| NZ-107 | VoidEvent animation phase reset | bug | fixed-deployed | 2026-04-25 | PR #11 |
| NZ-108 | Scheduled TruffleHog secret scan | bug | fixed-deployed | 2026-07-01 | Removed forced base/head inputs so scheduled gatekeeper scans no longer fail when both refs resolve to main |
| NZ-109 | Fleet maintenance review jury + docs | feature | completed | @copilot | 2026-08-08 | WR #16830 — OpenRouter/Jules/Semgrep/CodeQL + CONTRIBUTING + impulse tests |
