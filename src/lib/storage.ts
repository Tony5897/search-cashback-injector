/**
 * Type-safe wrappers around chrome.storage.local with TTL-based expiry.
 *
 * Extracted from background/index.ts so the cache logic is testable in
 * isolation (mock chrome.storage.local via vi.stubGlobal in tests).
 */

interface CacheEntry<T> {
  readonly value: T
  readonly expiresAt: number
}

/**
 * Reads a cached value by key. Returns null if the key is missing or the
 * entry has expired.
 */
export async function storageGet<T>(key: string): Promise<T | null> {
  const stored = await chrome.storage.local.get(key)
  const raw: unknown = stored[key]

  if (raw === undefined || raw === null) return null

  const entry = raw as CacheEntry<T>
  if (Date.now() > entry.expiresAt) return null

  return entry.value
}

/**
 * Writes a value under the given key with a TTL.
 * The entry expires at `Date.now() + ttlMs`.
 */
export async function storageSet(
  key: string,
  value: unknown,
  ttlMs: number,
): Promise<void> {
  const entry: CacheEntry<unknown> = {
    value,
    expiresAt: Date.now() + ttlMs,
  }
  await chrome.storage.local.set({ [key]: entry })
}
