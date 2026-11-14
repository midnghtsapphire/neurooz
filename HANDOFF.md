# Neurooz — Agent Handoff Document

_Last updated: 2026-11-14 — SEO and GitHub Pages availability_

## 2026-11-14 — SEO and local deploy (draft, not merged)

- Canonical production URL is https://neurooz.com.
- Primary host is Cloudflare Pages: `npm run deploy:cf` (Wrangler direct upload, not GitHub).
- Failover is a DigitalOcean droplet: `npm run deploy:do` (local rsync). DNS switch is in DEPLOY.md.
- Nameservers today are ns45.domaincontrol.com and ns46.domaincontrol.com at GoDaddy.
- `.github/workflows/deploy.yml` Actions job is commented out (`if: false`). Deploys run on Audrey's machine.
- `public/CNAME` stays. It is only for GitHub Pages, which is not the host.
- Home page still renders when Supabase env vars are missing or the session call hangs.

## Current Sprint Status
- **Sprint 0** (Foundation): ✅ DONE — docs, CI, env contract, CHANGELOG, BLUEPRINT
- **Sprint 1** (Oz Engine Core): ✅ DONE — cognitive mode detection, CognitiveModeWrapper, OzEngineProvider, CognitiveGrowth dashboard, 27 tests
- **Sprint 2** (Financial Guardian): 🔴 NEXT

## Next Sprint: Sprint 2 — Financial Guardian
See `docs/planning/NEUROOZ_SCRUM_BACKLOG.md` Sprint 2 section.

**Primary tasks:**
1. S2-001: Create `/src/modules/financial/` module structure
2. S2-002: Implement Plaid Link integration (or stub with local bank data if Plaid keys unavailable)
3. S2-003: Build transaction sync and categorization
4. S2-004: Implement impulse spending detection algorithm
5. S2-005: Build "Tin Man" financial health dashboard at `/financial`
6. S2-006: Create spending alert notification system
7. S2-007: "Emerald City" savings goals
8. S2-008: Bill reminder with priority detection
9. S2-009: Encrypt Plaid tokens (AES-256-GCM or env-var key)
10. S2-010: Tests for financial module

## Infrastructure

<!-- 2026-11-14: the droplet notes below are historical Actions/on-server context. Production host is Cloudflare Pages. The droplet is the failover, run with npm run deploy:do. See DEPLOY.md. -->
- **Hosting:** DigitalOcean Droplet (IP TBD — set in GitHub secrets as `DEPLOY_HOST`)
- **Process manager:** PM2
- **Web server:** Nginx (config at `nginx.conf`)
- **Deploy:** `npm run build` → rsync dist/ to droplet → nginx serves static files
- **Database:** Supabase (project URL in `VITE_SUPABASE_URL`)
- **Edge functions:** `supabase/functions/` (Deno runtime, deployed via `supabase functions deploy`)

## Known Issues / Lint Debt
- 115 lint warnings (mostly `any` types and hook dependency arrays)
- Priority files to fix: `BrainDumpDialog.tsx`, `KanbanBoard.tsx`, `use-cognitive-load.ts`, `OzEngine/VoidEvent.tsx`
- Epstein page (`src/pages/Epstein.tsx`) — review for legal/privacy exposure before launch

## How to Run
```bash
cp .env.example .env  # fill in real values
npm install
npm run dev           # localhost:5173
npm test              # 27 tests should pass
npm run typecheck     # should report 0 errors (fix App.tsx duplicate imports first)
npm run build         # should produce dist/
```

## Key Files
- `AGENTS.md` — AI agent universal instructions
- `IMPLEMENTATION_AUDIT.md` — what's built vs missing
- `NEUROOZ_AUDIT_PLAN.md` — audit findings and improvement plan
- `docs/planning/NEUROOZ_SCRUM_BACKLOG.md` — full sprint plan
- `docs/planning/NEUROOZ_IMPROVEMENT_PLAN.md` — 85 compliance gaps
- `src/modules/oz-engine/` — Sprint 1 deliverable
- `supabase/migrations/` — 30+ migrations

## Definition of Done (per Sprint)
1. Zero TypeScript errors (`npm run typecheck`)
2. Unit tests passing (`npm test`)
3. Build succeeds (`npm run build`)
4. CHANGELOG.md updated
5. HANDOFF.md updated
6. Feature works per acceptance criteria
