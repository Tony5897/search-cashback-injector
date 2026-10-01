# Local verification record

October 1, 2026. Baseline: `1f3c79b6ee43d2cfaf63297ccef3191e45a83eb0`.
Results apply to the local review patch on `feat/reviewable-repository`, not the
unchanged baseline or published store package. Record and retest the resulting
commit when publishing.

Node 22.23.2, npm 10.9.8, macOS arm64:

```sh
npm ci
npm run ci
npm run test:coverage
npx playwright install chromium
npm run test:browser
npm run package
npm audit
```

Passed: clean install, type-check, lint, 68 unit tests, production build, extension
browser integration, ZIP generation. The browser test also passed three repeated
runs. Coverage is restricted to `src/lib/**/*.ts`: 93% statements, 87.83% branches,
100% functions, 96% lines. It excludes content/worker entrypoints; their integration
is tested separately with actual extension messaging and controlled search fixtures.

The fixture checks Nike/Target detection, cache writes, repeated DOM updates without
duplicate banners, and unknown-merchant no-offer behavior. It is not a universal
live-Google compatibility claim. All offers are synthetic; no payout is supported.

Updated development tooling has zero reported npm advisories at review time.
Vite stays on major 6; Vitest/coverage move together to patched major 4. A clear
audit does not establish complete security. Source version 0.3.0 and a local ZIP
do not imply store publication; store-listing source copy is ready for separate review.
