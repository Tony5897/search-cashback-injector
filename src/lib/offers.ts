import type { Merchant, Offer, FallbackData } from './types'
import { findMerchant } from './merchants'
import { normalizeDomain } from './domains'
import fallbackData from '../../data/fallback.json'

const fallback = fallbackData as FallbackData

/**
 * Resolve an offer from the in-memory merchant registry.
 * Returns null if the domain is not a registered merchant.
 */
export function resolveFromRegistry(domain: string): Offer | null {
  const merchant = findMerchant(domain)
  if (!merchant) return null
  return buildOffer(merchant)
}

/**
 * Resolve an offer from the fallback JSON data.
 * Returns null if the domain has no fallback entry.
 */
export function resolveFromFallback(domain: string): Offer | null {
  const normalized = normalizeDomain(domain)
  const entry = fallback.offers.find(o => o.domain === normalized)
  if (!entry) return null

  const synthetic: Merchant = {
    id: normalized.replace(/\.\w+$/, ''),
    name: entry.label.replace(/^Earn .+? cashback at /, ''),
    domains: [normalized],
    cashbackPercent: entry.cashbackPercent,
    category: 'unknown',
  }

  return {
    merchant: synthetic,
    label: entry.label,
    cashbackPercent: entry.cashbackPercent,
    source: 'fallback',
  }
}

/**
 * Main resolution chain. Checks registry first, then fallback.
 * Returns null if no offer is available for the given domain.
 */
export function resolveOffer(domain: string): Offer | null {
  return resolveFromRegistry(domain) ?? resolveFromFallback(domain)
}

/** Build an Offer from a matched Merchant, sourced as 'registry'. */
function buildOffer(merchant: Merchant): Offer {
  const entry = fallback.offers.find(o => merchant.domains.includes(o.domain))
  return {
    merchant,
    label: entry?.label ?? `Earn ${String(merchant.cashbackPercent)}% cashback at ${merchant.name}`,
    cashbackPercent: entry?.cashbackPercent ?? merchant.cashbackPercent,
    source: 'registry',
  }
}
