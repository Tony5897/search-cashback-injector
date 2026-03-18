import { describe, it, expect } from 'vitest'
import { extractResultDomain } from '@/lib/serp'

/**
 * Builds a minimal mock Element whose only behaviour is to return a single
 * anchor with the supplied href from querySelector('a[href]').
 *
 * Pure object — no DOM API needed (node test environment).
 */
function makeEl(href: string | null): Element {
  const anchor =
    href !== null
      ? { getAttribute: () => href }
      : null
  return {
    querySelector: () => anchor,
  } as unknown as Element
}

/** Element with no anchor child at all. */
function makeElNoAnchor(): Element {
  return { querySelector: () => null } as unknown as Element
}

describe('extractResultDomain', () => {
  it('returns domain from a direct absolute https link', () => {
    expect(extractResultDomain(makeEl('https://amazon.com/dp/B09G9FPHY6'))).toBe('amazon.com')
  })

  it('strips www. from a direct link', () => {
    expect(extractResultDomain(makeEl('https://www.amazon.com/dp/B09'))).toBe('amazon.com')
  })

  it('strips m. from a direct link', () => {
    expect(extractResultDomain(makeEl('https://m.bestbuy.com/products'))).toBe('bestbuy.com')
  })

  it('resolves domain from a Google /url?q= redirect', () => {
    const href = '/url?q=https://nike.com/shoes&sa=U&ved=abc'
    expect(extractResultDomain(makeEl(href))).toBe('nike.com')
  })

  it('resolves domain from a full google.com/url?q= redirect', () => {
    const href = 'https://www.google.com/url?q=https://target.com/deals&sa=U'
    expect(extractResultDomain(makeEl(href))).toBe('target.com')
  })

  it('returns null for a google.com internal link', () => {
    expect(extractResultDomain(makeEl('https://www.google.com/search?q=laptops'))).toBeNull()
  })

  it('returns null for a google.co.uk ccTLD link', () => {
    expect(extractResultDomain(makeEl('https://www.google.co.uk/search?q=test'))).toBeNull()
  })

  it('returns null when no anchor element is present in the result', () => {
    expect(extractResultDomain(makeElNoAnchor())).toBeNull()
  })

  it('returns null when the anchor href is an empty string', () => {
    expect(extractResultDomain(makeEl(''))).toBeNull()
  })

  it('returns null when getAttribute("href") returns null', () => {
    expect(extractResultDomain(makeEl(null))).toBeNull()
  })

  it('correctly extracts domain from a link that includes a path', () => {
    expect(extractResultDomain(makeEl('https://www.walmart.com/browse/electronics'))).toBe('walmart.com')
  })

  it('returns null for a maps.google.com subdomain link', () => {
    expect(extractResultDomain(makeEl('https://maps.google.com/maps?q=coffee'))).toBeNull()
  })
})
