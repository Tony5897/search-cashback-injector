import { describe, it, expect, vi, beforeEach } from 'vitest'
import { storageGet, storageSet } from '@/lib/storage'

// ---------------------------------------------------------------------------
// chrome.storage.local mock
// ---------------------------------------------------------------------------

const mockStore: Record<string, unknown> = {}

const chromeMock = {
  storage: {
    local: {
      get: vi.fn(async (key: string) => ({ [key]: mockStore[key] })),
      set: vi.fn(async (items: Record<string, unknown>) => {
        Object.assign(mockStore, items)
      }),
    },
  },
}

beforeEach(() => {
  vi.stubGlobal('chrome', chromeMock)
  // Clear the in-memory store and reset call history between tests.
  for (const key of Object.keys(mockStore)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete mockStore[key]
  }
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// storageGet
// ---------------------------------------------------------------------------

describe('storageGet', () => {
  it('returns null when the key does not exist in storage', async () => {
    expect(await storageGet('offer:missing.com')).toBeNull()
  })

  it('returns null when the entry has expired', async () => {
    mockStore['offer:old.com'] = {
      value: { offer: null },
      expiresAt: Date.now() - 1_000, // expired 1 second ago
    }
    expect(await storageGet('offer:old.com')).toBeNull()
  })

  it('returns the stored value when the entry is still fresh', async () => {
    const value = { offer: null }
    mockStore['offer:fresh.com'] = {
      value,
      expiresAt: Date.now() + 60_000, // expires in 1 minute
    }
    expect(await storageGet('offer:fresh.com')).toEqual(value)
  })

  it('passes the generic type through — returned value matches stored shape', async () => {
    const merchant = { domain: 'amazon.com', name: 'Amazon', cashbackRate: '3%', category: 'retail' }
    const offer = { merchant, label: 'Earn 3% cashback at Amazon', rate: '3%' }
    const value = { offer }
    mockStore['offer:amazon.com'] = { value, expiresAt: Date.now() + 3_600_000 }

    const result = await storageGet<typeof value>('offer:amazon.com')
    expect(result?.offer.rate).toBe('3%')
  })
})

// ---------------------------------------------------------------------------
// storageSet
// ---------------------------------------------------------------------------

describe('storageSet', () => {
  it('writes an entry with the correct { value, expiresAt } structure', async () => {
    const value = { offer: null }
    await storageSet('offer:test.com', value, 3_600_000)

    const entry = mockStore['offer:test.com'] as { value: unknown; expiresAt: number }
    expect(entry).toBeDefined()
    expect(entry.value).toEqual(value)
    expect(typeof entry.expiresAt).toBe('number')
  })

  it('sets expiresAt to approximately Date.now() + ttlMs', async () => {
    const ttlMs = 3_600_000 // 1 hour
    const before = Date.now()
    await storageSet('offer:timing.com', {}, ttlMs)
    const after = Date.now()

    const entry = mockStore['offer:timing.com'] as { expiresAt: number }
    expect(entry.expiresAt).toBeGreaterThanOrEqual(before + ttlMs)
    expect(entry.expiresAt).toBeLessThanOrEqual(after + ttlMs)
  })
})
