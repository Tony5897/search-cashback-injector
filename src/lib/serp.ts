import { extractDomain } from '@/lib/domains'

/**
 * Extracts and normalizes the merchant domain from a single Google Search
 * result element.
 *
 * Handles two href shapes produced by Google:
 *   1. Direct absolute URL — `https://www.amazon.com/dp/...`
 *   2. Google redirect    — `/url?q=https://amazon.com/...&sa=U&...`
 *
 * Returns null for:
 *   - Elements with no anchor
 *   - Anchors with missing or empty href
 *   - Google-internal links (google.com and all TLD variants)
 *   - Non-HTTP(S) destinations (delegated to extractDomain)
 *
 * Pure function — all logic uses URL / URLSearchParams APIs available in
 * both browser and Node environments.
 */
export function extractResultDomain(resultEl: Element): string | null {
  const anchor = resultEl.querySelector('a[href]')
  if (!anchor) return null

  const href = anchor.getAttribute('href')
  if (!href) return null

  // Resolve the actual destination URL from Google redirect wrappers.
  const resolved = resolveHref(href)
  if (!resolved) return null

  const domain = extractDomain(resolved)
  if (!domain) return null

  // Filter out Google-internal links — google.com and all ccTLD variants
  // (google.co.uk, google.fr, google.de, etc.) as well as subdomains
  // (maps.google.com, accounts.google.com, ...).
  if (isGoogleDomain(domain)) return null

  return domain
}

/**
 * If the href is a Google redirect (/url?q=... or ...google.com/url?q=...),
 * returns the value of the `q` parameter. Otherwise returns the href as-is.
 */
function resolveHref(href: string): string | null {
  const isRedirect =
    href.startsWith('/url?') ||
    href.startsWith('/url?') ||
    href.includes('/url?q=')

  if (!isRedirect) return href

  // Extract the query string portion.
  const qIndex = href.indexOf('?')
  if (qIndex === -1) return null

  const params = new URLSearchParams(href.slice(qIndex))
  return params.get('q')
}

/**
 * Returns true for google.com, google.<ccTLD>, and any subdomain of those.
 */
function isGoogleDomain(domain: string): boolean {
  // Exact match — normalizeDomain already stripped www./m.
  if (domain === 'google.com') return true

  // Subdomain of google.com (e.g. maps.google.com → stripped to maps.google.com)
  if (domain.endsWith('.google.com')) return true

  // Google ccTLDs: google.co.uk, google.fr, google.de, google.com.au, etc.
  // Pattern: "google." followed by 2+ chars, with optional .XX suffix
  if (/^google\.[a-z]{2,}(\.[a-z]{2,})?$/.test(domain)) return true

  return false
}
