# ASSUMPTIONS.md — neurooz

> Assumptions made by agents during autonomous work. Each entry includes rationale and risk level.
> Humans: review and confirm/override. Agents: check before making conflicting assumptions.

## How This Differs from DECISIONS.md

- **DECISIONS.md** = deliberate choices made by humans or confirmed by humans
- **ASSUMPTIONS.md** = educated guesses made by agents to keep working without blocking on humans

When an assumption is confirmed by a human, move it to DECISIONS.md and remove it from here.

## Active Assumptions

| ID | Assumption | Risk | Agent | Date | Context |
|---|---|---|---|---|---|
| A-001 | Sprint 2 is Financial Guardian (Tin Man theme) | Low | Devin | 2026-04-25 | Per roadmap in AGENTS.md |
| A-002 | Modern Oz character images are not yet in the repo | Low | Devin | 2026-04-25 | Audrey said "I will find them, it might take a minute" |
| A-003 | Supabase project exists but credentials not yet shared | Medium | Devin | 2026-04-25 | App stubbed for it, auth page exists |

## Risk Levels

- **Low** — Easy to change later, no data loss, no cost if wrong
- **Medium** — Requires some rework if wrong, but recoverable
- **High** — Could cause data loss, security issues, or significant rework. Should have been escalated.
