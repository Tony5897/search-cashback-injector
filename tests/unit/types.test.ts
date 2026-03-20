import { describe, it, expect } from 'vitest'
import { isExtensionMessage, isOfferResponse } from '@/lib/types'

// ---------------------------------------------------------------------------
// isExtensionMessage
// ---------------------------------------------------------------------------

describe('isExtensionMessage', () => {
  it('returns true for a valid ExtensionMessage', () => {
    const msg = { type: 'RESOLVE_OFFER', payload: { domain: 'amazon.com' } }
    expect(isExtensionMessage(msg)).toBe(true)
  })

  it('returns false for null', () => {
    expect(isExtensionMessage(null)).toBe(false)
  })

  it('returns false for a string', () => {
    expect(isExtensionMessage('hello')).toBe(false)
  })

  it('returns false when type is wrong', () => {
    expect(isExtensionMessage({ type: 'WRONG', payload: { domain: 'x.com' } })).toBe(false)
  })

  it('returns false when payload is missing', () => {
    expect(isExtensionMessage({ type: 'RESOLVE_OFFER' })).toBe(false)
  })

  it('returns false when payload.domain is not a string', () => {
    expect(isExtensionMessage({ type: 'RESOLVE_OFFER', payload: { domain: 42 } })).toBe(false)
  })

  it('returns false when payload is null', () => {
    expect(isExtensionMessage({ type: 'RESOLVE_OFFER', payload: null })).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// isOfferResponse
// ---------------------------------------------------------------------------

describe('isOfferResponse', () => {
  it('returns true for { offer: null }', () => {
    expect(isOfferResponse({ offer: null })).toBe(true)
  })

  it('returns true for a valid offer object', () => {
    const response = {
      offer: {
        merchant: { id: 'nike', name: 'Nike', domains: ['nike.com'], cashbackPercent: 4, category: 'apparel' },
        label: 'Earn 4% cashback at Nike',
        cashbackPercent: 4,
        source: 'registry',
      },
    }
    expect(isOfferResponse(response)).toBe(true)
  })

  it('returns false for null', () => {
    expect(isOfferResponse(null)).toBe(false)
  })

  it('returns false for a string', () => {
    expect(isOfferResponse('not-a-response')).toBe(false)
  })

  it('returns false when offer key is missing', () => {
    expect(isOfferResponse({})).toBe(false)
  })

  it('returns false when offer.label is not a string', () => {
    expect(isOfferResponse({ offer: { label: 42, cashbackPercent: 4 } })).toBe(false)
  })

  it('returns false when offer.cashbackPercent is not a number', () => {
    expect(isOfferResponse({ offer: { label: 'Test', cashbackPercent: '4%' } })).toBe(false)
  })
})
