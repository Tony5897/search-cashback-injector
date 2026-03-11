import { describe, it, expect } from 'vitest'
import { findMerchant, MERCHANT_REGISTRY } from '@/lib/merchants'

describe('findMerchant', () => {
  it('finds a known merchant by exact domain', () => {
    const merchant = findMerchant('amazon.com')
    expect(merchant).not.toBeNull()
    expect(merchant?.name).toBe('Amazon')
  })

  it('normalizes www prefix before matching', () => {
    expect(findMerchant('www.amazon.com')?.name).toBe('Amazon')
  })

  it('is case-insensitive', () => {
    expect(findMerchant('AMAZON.COM')?.name).toBe('Amazon')
  })

  it('returns null for an unsupported domain', () => {
    expect(findMerchant('example.com')).toBeNull()
  })

  it('returns the correct cashback rate for a matched merchant', () => {
    expect(findMerchant('nike.com')?.cashbackRate).toBe('4%')
  })

  it('registry contains at least 5 merchants', () => {
    expect(MERCHANT_REGISTRY.length).toBeGreaterThanOrEqual(5)
  })
})
