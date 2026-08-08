# Neurooz — Overview

**Neurooz** is an ADHD-specific productivity and financial guardian platform powered by the **Oz Engine™**.

## Problem

ADHD adults juggle impulse spending, task switching, and executive-function dips across the day. Existing tools cover either productivity *or* money — not both, and not with real-time cognitive-mode adaptation.

## Solution

| Pillar | What it does |
|--------|--------------|
| **Oz Engine™** | Detects cognitive mode (flow / power / recovery / creative) from time-of-day + load signals and restyles the UI |
| **Financial Guardian** | Impulse purchase scoring, 24-hour hold windows, character-guided interventions |
| **Brain Dump / Tornado Alley** | Capture chaotic thoughts; AI extracts action items |
| **Yellow Brick Road** | Kanban + short-list focus for today |
| **Gamification** | Dopamine-aware rewards, streaks, Oz character feedback |

## Stack

- **Frontend:** Vite + React 18 + TypeScript + Tailwind + shadcn/ui
- **Data:** Supabase (Auth, Postgres, Storage, Edge Functions)
- **Payments:** Stripe (via Supabase functions)
- **AI:** OpenRouter (edge functions for brain-dump / chat)
- **Tests:** Vitest + happy-dom
- **CI jury:** CI + Gatekeeper + OpenRouter + Jules + Semgrep + CodeQL

## Monetization path

Freemium SaaS (Starter / Pro / Business / Enterprise Stripe prices) + ADHD-adjacent affiliate partners (therapy, budgeting). Target contribution toward the org $10k/mo → $10M/3yr prime directive.

## Related docs

- [README](./README.md) — setup, test matrix, deploy
- [CONTRIBUTING](./CONTRIBUTING.md) — branch/PR/review conventions
- [SHIP_STATUS](./SHIP_STATUS.md) — live workstream board
- [IMPLEMENTATION_AUDIT](./IMPLEMENTATION_AUDIT.md) — built vs missing
- [docs/](./docs/README.md) — design, architecture, backlog
