import { describe, it, expect } from 'vitest'
import { extractDomain, normalizeDomain } from '@/lib/domains'

describe('normalizeDomain', () => {
  it('strips www prefix', () => {
    expect(normalizeDomain('www.amazon.com')).toBe('amazon.com')
  })

  it('strips m prefix', () => {
    expect(normalizeDomain('m.amazon.com')).toBe('amazon.com')
  })

  it('lowercases the result', () => {
    expect(normalizeDomain('Amazon.COM')).toBe('amazon.com')
  })

  it('leaves plain domains unchanged', () => {
    expect(normalizeDomain('amazon.com')).toBe('amazon.com')
  })
})

describe('extractDomain', () => {
  it('extracts and normalizes domain from https URL', () => {
    expect(extractDomain('https://www.amazon.com/dp/B09G9FPHY6')).toBe('amazon.com')
  })

  it('extracts domain from http URL', () => {
    expect(extractDomain('http://walmart.com/products')).toBe('walmart.com')
  })

  it('returns null for invalid URLs', () => {
    expect(extractDomain('not-a-url')).toBeNull()
  })

  it('returns null for ftp protocol', () => {
    expect(extractDomain('ftp://files.example.com')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(extractDomain('')).toBeNull()
  })
})
