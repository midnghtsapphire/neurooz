# DECISIONS.md — neurooz

> Shared decision log for all agents and humans working in this repo.
> Before asking a human a question, check here first. If your question is already answered, use that answer.
> If you make an assumption, document it here so other agents don't contradict you.

## How to Use This File

**For agents:**
1. Before asking the human a clarifying question, check if it's already answered here.
2. If information is missing and the decision is **reversible**, make the most reasonable assumption, add it below as `[ASSUMED]`, and continue working.
3. If the decision is **irreversible** (e.g., deleting data, publishing to production, spending money), escalate to the human.
4. When a human confirms or overrides an assumption, update the status to `[CONFIRMED]` or `[OVERRIDDEN]`.

**For humans:**
- Review `[ASSUMED]` entries periodically. Confirm or override them.
- Add decisions here when you make them so agents don't re-ask.

## Decisions

### Architecture & Stack

| ID | Decision | Status | Date | Rationale |
|---|---|---|---|---|
| D-001 | Vite + React + TypeScript + shadcn-ui + Tailwind + Supabase | [CONFIRMED] | 2026-04-25 | Established stack |
| D-002 | Dev server on port 8080 (not 5173) | [CONFIRMED] | 2026-04-25 | Vite config specifies 8080 |
| D-003 | App renders without Supabase credentials using placeholder fallback | [CONFIRMED] | 2026-04-25 | console.warn when missing, doesn't crash |

### Theme & UX

| ID | Decision | Status | Date | Rationale |
|---|---|---|---|---|
| D-010 | Wizard of Oz theming throughout | [CONFIRMED] | 2026-04-25 | Core brand identity |
| D-011 | Tornado button always visible for overwhelm recovery | [CONFIRMED] | 2026-04-25 | Critical for ADHD racing thoughts — must never be hidden |
| D-012 | Brain Dump is the #1 priority feature | [CONFIRMED] | 2026-04-25 | Per Audrey: "the brain dump module is critical to me" |
| D-013 | Munchkin helper (bottom-right) for quick notes | [CONFIRMED] | 2026-04-25 | Small brain dump or reminders |
| D-014 | Cowardly Lion exercises must be deaf-friendly | [CONFIRMED] | 2026-04-25 | Audrey's daughter is deaf |
