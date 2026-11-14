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
| A-004 | Canonical origin is https://neurooz.com with no www, and Vite base stays `/` | Low | cloud agent | 2026-11-14 | Owner instruction. Host is Cloudflare Pages, not a project-pages subpath |
| A-005 | Deploys run on Audrey's machine. This agent did not run Wrangler or rsync | Medium | cloud agent | 2026-11-14 | Either command would publish or copy to a live host before review |
| A-006 | sitemap.xml lists every static route in App.tsx, including legacy tax and admin paths | Low | cloud agent | 2026-11-14 | A test fails if a static route is missing from the sitemap |
| A-007 | GoDaddy nameservers ns45/ns46.domaincontrol.com are still authoritative until Audrey changes them | Low | cloud agent | 2026-11-14 | Stated in the 2026-11-14 deploy instruction. DEPLOY.md covers both DNS options |

## Risk Levels

- **Low** — Easy to change later, no data loss, no cost if wrong
- **Medium** — Requires some rework if wrong, but recoverable
- **High** — Could cause data loss, security issues, or significant rework. Should have been escalated.
