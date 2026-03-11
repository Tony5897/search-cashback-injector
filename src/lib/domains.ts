/**
 * Extracts and normalizes the hostname from a URL.
 * Returns null for invalid URLs or non-HTTP(S) protocols.
 */
export function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return normalizeDomain(parsed.hostname)
  } catch {
    return null
  }
}

/**
 * Strips common prefixes (www., m.) and lowercases.
 */
export function normalizeDomain(domain: string): string {
  return domain.replace(/^(?:www\.|m\.)/, '').toLowerCase()
}
