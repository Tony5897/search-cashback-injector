# Search Cashback Injector

A Manifest V3 browser extension that detects supported merchant links on Google Search results pages and injects lightweight cashback alerts inline with search results.

This project is designed as a portfolio-grade engineering build focused on modern browser extension architecture, safe DOM injection, configuration-driven merchant handling, and production-minded frontend discipline.

## Why This Project Exists

Shoppers often begin their buying journey on search engines before they ever visit a merchant site. This project explores how a browser extension can surface cashback value at that exact moment of decision by detecting supported merchants in search results and presenting a small, non-intrusive cashback banner inline.

The goal is not to build a full loyalty platform. The goal is to build a clean, technically credible proof-of-concept that demonstrates:

- Manifest V3 extension architecture
- content script + service worker messaging
- safe, isolated UI injection
- configuration-driven merchant detection
- caching and fallback handling
- testing and CI/CD discipline

## MVP Scope

Version 1 is intentionally narrow.

### In scope

- Chrome extension using Manifest V3
- Google Search results pages only
- Detection of a small set of supported merchant domains
- Inline cashback banner injection near matching search results
- Mock or fallback cashback offer data
- Background service worker for offer lookup and caching
- Local caching with `chrome.storage.local`
- Unit tests and CI workflow

### Out of scope for V1

- Real cashback network integrations
- Merchant account linking
- Checkout coupon auto-apply
- Full analytics dashboard
- Multi-browser support beyond initial architecture planning
- Partner theming UI
- Production-grade payout or affiliate infrastructure

## Core Product Idea

When a user searches on Google and a supported merchant appears in organic results, the extension identifies the merchant domain and injects a subtle cashback indicator next to that result.

Example:

- Search: `running shoes`
- Google result includes: `example-merchant.com`
- Extension detects supported merchant
- Banner appears: `Earn 4% cashback`

## Architecture Overview

This project uses a clean Manifest V3 separation of concerns:

### 1. Content Script

Runs on Google Search result pages and is responsible for:

- detecting result links
- normalizing merchant domains
- deciding where injection should happen
- requesting offer data from the background service worker
- rendering the cashback banner into the page

### 2. Background Service Worker

Handles extension-side logic and is responsible for:

- processing requests from the content script
- resolving offers for supported merchants
- reading and writing cache entries
- returning normalized offer data
- serving fallback data when needed

### 3. Merchant Registry

A configuration-driven merchant registry defines:

- merchant name
- supported domains
- cashback percentage
- UI label text
- optional metadata for future extensibility

### 4. Injected UI Layer

A lightweight banner is injected into supported results using an isolated DOM strategy so host page styles do not break the injected UI and injected styles do not leak into the page.

## Tech Stack

| Layer | Technology |
|---|---|
| Extension Platform | Chrome Manifest V3 |
| Language | TypeScript |
| Bundler | Vite |
| Content/UI Rendering | Vanilla DOM APIs |
| Style Isolation | Shadow DOM |
| Background Logic | MV3 Service Worker |
| Storage | `chrome.storage.local` |
| Testing | Vitest |
| E2E Testing (planned) | Playwright |
| CI | GitHub Actions |

## Initial Feature Set

- Google Search result detection
- Merchant domain normalization
- Supported merchant matching
- Inline cashback banner injection
- Background message passing
- Cached offer lookup
- Fallback JSON-based mock offers
- Lightweight test coverage
- CI pipeline for lint, type-check, test, and build

## Project Structure

```text
search-cashback-injector/
├── .github/
│   └── workflows/
│       └── ci.yml
├── data/
│   └── fallback.json
├── public/
│   └── icons/
├── src/
│   ├── background/
│   │   └── index.ts
│   ├── content/
│   │   └── index.ts
│   ├── lib/
│   │   ├── domains.ts
│   │   ├── merchants.ts
│   │   ├── offers.ts
│   │   └── types.ts
│   └── styles/
│       └── banner.css
├── tests/
│   ├── unit/
│   └── e2e/
├── manifest.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```
