# PerkPop Git Branching Strategy

## Branch Hierarchy

```
origin/main          ←── production-ready, tagged releases only
    │
origin/develop       ←── integration branch, all work lands here first
    │
    ├── feature/*    ←── new capabilities
    ├── fix/*        ←── bug fixes that aren't urgent
    ├── hotfix/*     ←── urgent production fixes (branches off main)
    ├── chore/*      ←── builds, config, deps, store listing, tooling
    └── release/*    ←── release-candidate stabilization (optional)
```

---

## Branch Definitions

| Branch | Purpose | Branches from | Merges into |
|---|---|---|---|
| `main` | Shipped code. Every commit is a release tag. | — | — |
| `develop` | Living integration branch. Reflects next release state. | `main` (once) | `main` via release or hotfix |
| `feature/*` | New user-facing capability. | `develop` | `develop` |
| `fix/*` | Non-urgent bug fix. | `develop` | `develop` |
| `hotfix/*` | Emergency production patch. | `main` | `main` **and** `develop` |
| `chore/*` | Maintenance: deps, build, CI, store assets. | `develop` | `develop` |
| `release/*` | Release-candidate freeze and final QA. | `develop` | `main` **and** `develop` |

---

## Visual Flow

```
main     ─────────────────────────────────────────────────────────► (v0.3.x → v0.4.0)
              ▲                                         ▲
              │  merge + tag                            │  merge + tag
              │                                         │
develop  ─────┼──────────────────────────────────────── ─────────►
              │       ▲           ▲           ▲
              │       │ merge     │ merge     │ merge
              │       │           │           │
feature/merchant-api ─┘           │           │
                        fix/banner-flicker ───┘           │
                                             chore/cws-store-listing-fix ─┘


hotfix/* flow (emergency only):

main     ─────────────────────────┬──────────────────────────────►
                                  │◄── merge + tag (hotfix)
hotfix/  ─────────────────────────┘
                                  │
develop  ─────────────────────────┴──────────────────────────────►
                                  ▲── also merge hotfix here
```

---

## Naming Conventions

```
feature/  → new capability
  feature/merchant-api-integration
  feature/offer-tooltip-ui
  feature/serp-position-tracking

fix/      → non-urgent bug fix
  fix/banner-z-index-overlap
  fix/storage-cache-expiry
  fix/serp-selector-update

hotfix/   → urgent production patch (branches off main)
  hotfix/csp-violation-crash
  hotfix/manifest-permission-error

chore/    → build, config, deps, CI, store assets
  chore/cws-store-listing-fix
  chore/update-vite-5
  chore/add-playwright-tests

release/  → release stabilization (optional, use for complex releases)
  release/0.4.0
```

---

## Day-to-Day Workflow

### Starting a new feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
# ... do work ...
git push -u origin feature/your-feature-name
# Open PR: feature/your-feature-name → develop
```

### Fixing a bug

```bash
git checkout develop
git pull origin develop
git checkout -b fix/describe-the-bug
# ... do work ...
git push -u origin fix/describe-the-bug
# Open PR: fix/describe-the-bug → develop
```

### Emergency production hotfix

```bash
git checkout main
git pull origin main
git checkout -b hotfix/describe-the-issue
# ... fix the issue ...
git push -u origin hotfix/describe-the-issue
# Open PR 1: hotfix/describe-the-issue → main  (tag a patch version on merge)
# Open PR 2: hotfix/describe-the-issue → develop  (keep develop in sync)
```

### Releasing to the Chrome Web Store

```bash
# Option A — simple release (no stabilization needed)
git checkout main
git merge --no-ff develop
git tag -a v0.4.0 -m "Release v0.4.0"
git push origin main --tags
npm run build && npm run package
# Upload zip to CWS dashboard

# Option B — release branch (if you need a freeze period)
git checkout develop
git checkout -b release/0.4.0
# bump version in manifest.json + package.json, update CHANGELOG
git push -u origin release/0.4.0
# Open PR: release/0.4.0 → main  (tag on merge)
# Open PR: release/0.4.0 → develop  (sync back)
```

---

## Commit Message Format

Follow Conventional Commits:

```
<type>(<scope>): <short summary>

Types:
  feat     — new feature
  fix      — bug fix
  chore    — build, deps, tooling, store assets
  refactor — code restructure, no behavior change
  docs     — documentation only
  test     — tests only
  style    — formatting, no logic change
  perf     — performance improvement

Examples:
  feat(content): add tooltip on cashback badge hover
  fix(serp): update result selector for Google UI refresh
  chore(store): update CWS description for policy compliance
  hotfix(manifest): add missing host permission for google.co.uk
```

---

## CI Behavior per Branch

| Branch pattern | CI runs | Auto-build artifact | CWS deploy |
|---|---|---|---|
| `main` | typecheck, lint, test, build | yes (7-day retention) | manual upload |
| `develop` | typecheck, lint, test, build | yes (7-day retention) | no |
| `feature/*` | typecheck, lint, test, build | yes (7-day retention) | no |
| `fix/*` | typecheck, lint, test, build | yes (7-day retention) | no |
| `hotfix/*` | typecheck, lint, test, build | yes (7-day retention) | no |
| `chore/*` | typecheck, lint, test, build | yes (7-day retention) | no |
| `release/*` | typecheck, lint, test, build | yes (7-day retention) | no |

CI is defined in [.github/workflows/ci.yml](.github/workflows/ci.yml). All branches run the full suite on push and on PRs targeting `main` or `develop`.

---

## Branch Protection (Recommended GitHub Settings)

### `main`
- Require PR before merging (no direct pushes)
- Require at least 1 approving review
- Require status checks to pass: `typecheck`, `lint`, `test`, `build`
- Require branches to be up to date before merging

### `develop`
- Require PR before merging (no direct pushes)
- Require status checks to pass: `typecheck`, `lint`, `test`, `build`

Configure at: **GitHub → Settings → Branches → Add branch ruleset**

---

## Current Branch State

```
origin/main          v0.3.0 — CWS submission (Unlisted resubmission in progress)
origin/develop       synced with main, ready for next development cycle
```

### What's next after v0.3.0 ships

Branch from `develop` for any of these:

```
feature/merchant-registry-expansion    add more cashback merchants
feature/offer-tooltip                  richer inline UI on hover
feature/analytics-opt-in              opt-in usage metrics
fix/google-serp-selector-drift         keep up with Google UI changes
chore/playwright-e2e-tests             add end-to-end test coverage
chore/merchant-data-pipeline           automate offer rate updates
```
