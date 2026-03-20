import { resolveOffer } from '@/lib/offers'
import { createLogger } from '@/lib/logger'
import { storageGet, storageSet } from '@/lib/storage'
import type { ExtensionMessage, OfferResponse } from '@/lib/types'

const log = createLogger('background')
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

    handleResolveOffer(msg.payload.domain)
      .then(sendResponse)
      .catch((err: unknown) => {
        log.error('offer resolution failed', err)
        sendResponse({ offer: null } satisfies OfferResponse)
      })

    // Return true to keep the message channel open for the async response.
    return true
  },
)

async function handleResolveOffer(domain: string): Promise<OfferResponse> {
  const cacheKey = `offer:${domain}`
  const cached = await storageGet<OfferResponse>(cacheKey)

  if (cached) {
    log.debug('cache hit', { domain })
    return cached
  }

  log.debug('cache miss', { domain })
  const offer = resolveOffer(domain)
  const result: OfferResponse = { offer }

  if (offer) {
    await storageSet(cacheKey, result, CACHE_TTL_MS)
    log.info('offer resolved', { domain, cashbackPercent: offer.cashbackPercent, source: offer.source })
  }

  return result
}
