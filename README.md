# Neurooz

<!-- AUTO-PACKAGE-BADGES:START -->

<!-- AUTO-PACKAGE-BADGES:END -->

**ADHD-specific productivity and financial guardian platform** powered by the Oz Engine™ — real-time cognitive mode adaptation meets Financial Guardian protection.

> Built with Vite + TypeScript + React + shadcn-ui + Tailwind + Supabase.

## Quick start

```bash
git clone https://github.com/midnghtsapphire/neurooz.git
cd neurooz
cp .env.example .env
npm ci
npm run dev
# → http://localhost:8080
```

See [`.env.example`](./.env.example) for Supabase, Stripe, and OpenRouter variables. The app boots with placeholder Supabase credentials when unset (features that need a live project degrade gracefully).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (port 8080) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests (single run) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest + v8 coverage |
| `npm run check` | typecheck + lint + test |
| `npm run deploy` | `gh-pages` publish of `dist/` |

## Test

| Suite / feature | Status | How to verify |
|-----------------|--------|---------------|
| Unit tests (Oz Engine detection + mode history) | ✅ | `npm test` |
| Impulse detection utilities | ✅ | `npm test` → `src/utils/__tests__/impulseDetection.test.ts` |
| Typecheck | ✅ | `npm run typecheck` |
| Lint | ✅ | `npm run lint` |
| Production build | ✅ | `npm run build` |
| CI workflow | ✅ | `.github/workflows/ci.yml` on every PR |
| Homepage (local) | ✅ | `npm run dev` → http://localhost:8080 |
| Cognitive Growth dashboard | ✅ | http://localhost:8080/cognitive-growth |
| Impulse Control | ✅ | http://localhost:8080/impulse-control |
| Production deploy | ⏳ | Configure Vercel/GitHub Pages + live Supabase project |

## Review jury (required workflows)

| Workflow | File |
|----------|------|
| CI (typecheck / lint / test / build) | `.github/workflows/ci.yml` |
| Security Gatekeeper | `.github/workflows/gatekeeper.yml` |
| OpenRouter AI PR review | `.github/workflows/ai-pr-review-openrouter.yml` |
| Jules PR reviewer | `.github/workflows/jules-pr-reviewer.yml` |
| Semgrep SAST | `.github/workflows/semgrep.yml` |
| CodeQL | `.github/workflows/codeql.yml` |

## Documentation

| Resource | Description |
|----------|-------------|
| [OVERVIEW.md](./OVERVIEW.md) | Product pillars, stack, monetization |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Branch conventions, secrets, kill switch |
| [docs/](./docs/README.md) | Full documentation index |
| [Design System](./docs/design/NEUROOZ_URBAN_OZ_THEME_SPEC.md) | Urban Oz theme, cognitive mode CSS |
| [Product Backlog](./docs/planning/NEUROOZ_SCRUM_BACKLOG.md) | Sprint plans and acceptance criteria |
| [Architecture](./docs/architecture/NEUROOZ_DARE_LOG.md) | DARE + RAID logs |
| [Blue Ocean Research](./docs/NEUROOZ_BLUE_OCEAN_RESEARCH.md) | Competitive differentiation |
| [Implementation Audit](./IMPLEMENTATION_AUDIT.md) | Built vs still needed |
| [SHIP_STATUS.md](./SHIP_STATUS.md) | Live workstream board |
| [NEUROOZ_AUDIT_PLAN.md](./NEUROOZ_AUDIT_PLAN.md) | Compliance roadmap |

## Tech stack

- Vite 5 + React 18 + TypeScript 5
- Tailwind CSS + shadcn/ui (Radix)
- TanStack Query
- Supabase (Auth / DB / Storage / Edge Functions)
- Stripe subscriptions
- Vitest + happy-dom
- Framer Motion + Recharts

## Deployment

**Preferred:** connect this repo to Vercel (framework preset: Vite) and set the env vars from `.env.example`.

**GitHub Pages alternative:**

```bash
npm run build
npm run deploy   # publishes dist/ via gh-pages
```

Production URL (once configured): `https://neurooz.vercel.app` (or the custom domain on the GitHub Pages / Vercel project).

## License

See [LICENSE](./LICENSE).
