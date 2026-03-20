import { describe, it, expect } from 'vitest'
import { resolveOffer, resolveFromRegistry, resolveFromFallback } from '@/lib/offers'

// ---------------------------------------------------------------------------
// resolveFromRegistry
// ---------------------------------------------------------------------------

describe('resolveFromRegistry', () => {
  it('returns an offer with source "registry" for a known merchant', () => {
    const offer = resolveFromRegistry('nike.com')
    expect(offer).not.toBeNull()
    expect(offer?.source).toBe('registry')
    expect(offer?.cashbackPercent).toBe(4)
  })

  it('returns null for an unknown domain', () => {
    expect(resolveFromRegistry('nonexistent-store.com')).toBeNull()
  })

  it('normalizes www-prefixed domains', () => {
    const offer = resolveFromRegistry('www.amazon.com')
    expect(offer).not.toBeNull()
    expect(offer?.merchant.id).toBe('amazon')
  })

  it('includes the merchant object on the resolved offer', () => {
    const offer = resolveFromRegistry('target.com')
    expect(offer?.merchant.name).toBe('Target')
    expect(offer?.merchant.domains).toContain('target.com')
  })
})

// ---------------------------------------------------------------------------
// resolveFromFallback
// ---------------------------------------------------------------------------

describe('resolveFromFallback', () => {
  it('returns an offer with source "fallback" for a domain in fallback.json', () => {
    const offer = resolveFromFallback('amazon.com')
    expect(offer).not.toBeNull()
    expect(offer?.source).toBe('fallback')
  })

  it('returns null for a domain not in fallback.json', () => {
    expect(resolveFromFallback('nonexistent-store.com')).toBeNull()
  })

  it('builds a synthetic merchant from fallback data', () => {
    const offer = resolveFromFallback('sephora.com')
    expect(offer?.merchant.id).toBe('sephora')
    expect(offer?.merchant.domains).toContain('sephora.com')
    expect(offer?.cashbackPercent).toBe(4)
  })
})

// ---------------------------------------------------------------------------
// resolveOffer (chained)
// ---------------------------------------------------------------------------

describe('resolveOffer', () => {
  it('returns an offer for a known registry domain', () => {
    const offer = resolveOffer('nike.com')
    expect(offer).not.toBeNull()
    expect(offer?.cashbackPercent).toBe(4)
  })

  it('registry takes priority — source is "registry" for domains in both', () => {
    const offer = resolveOffer('amazon.com')
    expect(offer?.source).toBe('registry')
  })

  it('returns null for a completely unknown domain', () => {
    expect(resolveOffer('random-unknown.com')).toBeNull()
  })
})
