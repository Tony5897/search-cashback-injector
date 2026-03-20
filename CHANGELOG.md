# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-03-20

### Added
- Merchant `id` slug for stable cache keys and future analytics
- Multi-domain support (`domains: string[]`) per merchant entry
- Offer source tracking (`registry` | `cache` | `fallback`) on every resolved offer
- Typed interfaces for fallback data (`FallbackEntry`, `FallbackData`)
- Runtime type guards: `isExtensionMessage`, `isOfferResponse`
- `chrome.runtime.lastError` handling in content script message passing
- MutationObserver cleanup via `pagehide` listener (prevents memory leaks)
- Offer resolution chain in `offers.ts` with registry → fallback priority
- `:host` rule in banner CSS for proper Shadow DOM outer spacing
- `tests/unit/offers.test.ts` — 10 tests covering resolution chain
- `tests/unit/types.test.ts` — 14 tests covering type guard validation
- Dist artifact verification step in CI pipeline

### Changed
- `Merchant.cashbackRate` (string) → `Merchant.cashbackPercent` (number)
- `Merchant.domain` (string) → `Merchant.domains` (string array)
- `Offer.rate` (string) → `Offer.cashbackPercent` (number)
- Offer resolution logic moved from `background/index.ts` to `offers.ts`
- Background service worker simplified to orchestration-only role
- `fallback.json` entries migrated from `rate` string to `cashbackPercent` number

### Removed
- Duplicate backup files (`logger 2.ts`, `serp 2.ts`, `storage 2.ts`)
- Unsafe `as` type casts on message boundaries

## [0.1.0] - 2026-03-19

### Added
- Initial release: SERP merchant detection with Shadow DOM cashback banners
- 20-merchant registry across retail, electronics, apparel, sports, home, travel, food, gaming, and beauty categories
- Google redirect URL resolution (`/url?q=` handling)
- Structured logger with namespace prefixing (`createLogger`)
- TTL-based `chrome.storage.local` caching via generic `storageGet`/`storageSet`
- SERP domain extraction module with Google-internal domain filtering
- Dual-pass Vite build (ES module background + IIFE content script)
- CI pipeline: typecheck, lint, test, build, artifact upload
- 42 unit tests across 5 test files
