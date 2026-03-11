import { findMerchant } from '@/lib/merchants'
import { buildOffer } from '@/lib/offers'
import type { ExtensionMessage, OfferResponse } from '@/lib/types'

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

chrome.runtime.onMessage.addListener(
  (message: unknown, _sender, sendResponse) => {
    // Narrow the unknown message before casting — avoids always-false condition.
    if (
      typeof message !== 'object' ||
      message === null ||
      (message as { type?: string }).type !== 'RESOLVE_OFFER'
    ) {
      return false
    }

    const msg = message as ExtensionMessage

    resolveOffer(msg.payload.domain)
      .then(sendResponse)
      .catch((err: unknown) => {
        console.error('[cashback] offer resolution failed', err)
        sendResponse({ offer: null } satisfies OfferResponse)
      })

    // Return true to keep the message channel open for the async response.
    return true
  },
)

async function resolveOffer(domain: string): Promise<OfferResponse> {
  const cacheKey = `offer:${domain}`
  const cached = await readCache<OfferResponse>(cacheKey)
  if (cached) return cached

  const merchant = findMerchant(domain)
  const result: OfferResponse = { offer: merchant ? buildOffer(merchant) : null }

  if (result.offer) {
    await writeCache(cacheKey, result, CACHE_TTL_MS)
  }

  return result
}

async function readCache<T>(key: string): Promise<T | null> {
  const stored = await chrome.storage.local.get(key)
  const entry = stored[key] as { value: T; expiresAt: number } | undefined
  if (!entry || Date.now() > entry.expiresAt) return null
  return entry.value
}

async function writeCache(key: string, value: unknown, ttlMs: number): Promise<void> {
  await chrome.storage.local.set({
    [key]: { value, expiresAt: Date.now() + ttlMs },
  })
}
