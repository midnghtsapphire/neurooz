# Contributing to Neurooz

Thanks for helping ship Neurooz — the ADHD productivity & Financial Guardian platform.

## Branch conventions

| Prefix | Use |
|--------|-----|
| `feat/` | New user-facing feature |
| `fix/` | Bug fix |
| `chore/` | Tooling, deps, docs-only |
| `fleet-maintenance/` | Org-wide standards sweeps from revvel-standards |
| `security/` | Vulnerability remediation |

Use Conventional Commits for commit messages and PR titles:

```text
feat(oz-engine): detect creative mode in afternoon window
fix(gatekeeper): allow scheduled secret scans on main
chore(deps): bump vitest
```

## Local setup

```bash
git clone https://github.com/midnghtsapphire/neurooz.git
cd neurooz
cp .env.example .env   # fill Supabase / Stripe placeholders as needed
npm ci
npm run dev            # http://localhost:8080
```

## Quality gates (run before every PR)

```bash
npm run typecheck
npm run lint
npm test
npm run build
# or all of the above:
npm run check && npm run build
```

CI (`.github/workflows/ci.yml`) runs the same gates on every PR to `main`.

## Review jury

Every non-draft PR is reviewed by:

| Workflow | Role |
|----------|------|
| `ci.yml` | Typecheck, lint, unit tests, production build |
| `gatekeeper.yml` | Third-party artifact audit + secret scan |
| `ai-pr-review-openrouter.yml` | OpenRouter AI rewrite suggestions (advisory) |
| `jules-pr-reviewer.yml` | Jules design/correctness review |
| `semgrep.yml` | SAST (secrets + security-audit ERROR gate) |
| `codeql.yml` | CodeQL for `javascript-typescript` + `actions` |

Put `[skip-review]` in the PR title only for emergency docs-only hotfixes. Prefer fixing findings over skipping.

### Secrets used by review workflows

| Secret | Required for | Notes |
|--------|--------------|-------|
| `OPENROUTER_API_KEY` | OpenRouter AI PR review | Skip with warning if unset |
| `JULES_API_KEY` | Jules PR reviewer | Skip with success status if unset |
| `ADMIN_GITHUB_TOKEN` | Optional higher rate-limit bucket | Falls back to `GITHUB_TOKEN` |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | CI build | Placeholders OK for compile-only |

Never put secrets in argv, commit messages, or workflow logs. Prefer `--token-stdin` / env injection.

## Kill switch

If an automated review lane is thrashing:

1. Add the `jules-override` label to bypass Jules only, **or**
2. Temporarily disable the workflow via the Actions UI (do not delete the file), **or**
3. Open a WR on `midnghtsapphire/revvel-standards` so the fleet can remediate.

## Definition of done

- [ ] Tests cover the change (or a written reason why not)
- [ ] `npm run check` is green locally
- [ ] No new secrets, Lovable/third-party scaffolding, or placeholder URLs
- [ ] PR title is Conventional Commits
- [ ] Linked issue uses `Closes #N` when applicable
