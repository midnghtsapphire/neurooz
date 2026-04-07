# Revvel Standards Applied to Neurooz

These standards from [midnghtsapphire/revvel-standards](https://github.com/midnghtsapphire/revvel-standards) govern Neurooz development.

## Applied Standards

| Standard | Source | Neurooz Notes |
|----------|--------|---------------|
| [TESTING_STANDARD.md](https://github.com/midnghtsapphire/revvel-standards/blob/main/TESTING_STANDARD.md) | revvel-standards | Vitest unit tests required; 90%+ coverage on critical modules |
| [SECURITY_STANDARD.md](https://github.com/midnghtsapphire/revvel-standards/blob/main/SECURITY_STANDARD.md) | revvel-standards | AES-256-GCM for Plaid tokens; RLS on all tables; no `*` CORS |
| [ACCESSIBILITY_STANDARD.md](https://github.com/midnghtsapphire/revvel-standards/blob/main/ACCESSIBILITY_STANDARD.md) | revvel-standards | 7 mandatory accessibility modes (see Sprint 4) |
| [DEPLOYMENT_STANDARD.md](https://github.com/midnghtsapphire/revvel-standards/blob/main/DEPLOYMENT_STANDARD.md) | revvel-standards | DigitalOcean Droplet + Nginx + PM2 + GitHub Actions |
| [CODE_REVIEW_STANDARD.md](https://github.com/midnghtsapphire/revvel-standards/blob/main/CODE_REVIEW_STANDARD.md) | revvel-standards | PR checklist: env vars, migrations, tests, a11y, perf |
| [DATABASE_ARCHITECTURE_STANDARD.md](https://github.com/midnghtsapphire/revvel-standards/blob/main/DATABASE_ARCHITECTURE_STANDARD.md) | revvel-standards | All schema changes via `supabase/migrations/`; RLS required |
| [SEO_METADATA_STANDARD.md](https://github.com/midnghtsapphire/revvel-standards/blob/main/SEO_METADATA_STANDARD.md) | revvel-standards | Schema.org JSON-LD + Open Graph (Sprint 5) |
| [RUNBOOK_STANDARD.md](https://github.com/midnghtsapphire/revvel-standards/blob/main/RUNBOOK_STANDARD.md) | revvel-standards | HANDOFF.md serves as the Neurooz runbook |

## Compliance Checklist
See [NEUROOZ_COMPLIANCE_CHECKLIST.md](../planning/NEUROOZ_COMPLIANCE_CHECKLIST.md) for current status.
