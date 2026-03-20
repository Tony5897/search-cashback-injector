import { isOfferResponse } from '@/lib/types'
import type { ExtensionMessage, OfferResponse } from '@/lib/types'
import { createLogger } from '@/lib/logger'
import { extractResultDomain } from '@/lib/serp'
import bannerCss from '@/styles/banner.css?inline'

const log = createLogger('content')

const INJECTED_ATTR = 'data-cashback-injected'
const RESULT_SELECTOR = '#rso .tF2Cxc'

function main(): void {
  scanResults()
  const target = document.getElementById('search') ?? document.body
  const observer = new MutationObserver(() => { scanResults() })
  observer.observe(target, { childList: true, subtree: true })

  // Disconnect observer when the page is torn down to prevent memory leaks
  // during SPA-style navigations within Google Search.
  window.addEventListener('pagehide', () => { observer.disconnect() }, { once: true })
}

function scanResults(): void {
  const results = document.querySelectorAll<HTMLElement>(RESULT_SELECTOR)
  log.debug('scanning results', { count: results.length })
  results.forEach(processResult)
}

function processResult(result: HTMLElement): void {
  if (result.hasAttribute(INJECTED_ATTR)) return

  const domain = extractResultDomain(result)
  if (!domain) return

  // Mark pending to prevent duplicate processing while the async call resolves.
  result.setAttribute(INJECTED_ATTR, 'pending')

  requestOffer(domain)
    .then(({ offer }) => {
      if (!offer) {
        result.removeAttribute(INJECTED_ATTR)
        return
      }
      log.info('merchant detected', { domain, cashbackPercent: offer.cashbackPercent })
      injectBanner(result, offer.label)
      result.setAttribute(INJECTED_ATTR, 'injected')
    })
    .catch((err: unknown) => {
      log.error('failed to resolve offer', err)
      result.removeAttribute(INJECTED_ATTR)
    })
}

async function requestOffer(domain: string): Promise<OfferResponse> {
  const message: ExtensionMessage = { type: 'RESOLVE_OFFER', payload: { domain } }
  const response: unknown = await chrome.runtime.sendMessage(message)

  if (chrome.runtime.lastError) {
    log.warn('sendMessage error', chrome.runtime.lastError.message)
    return { offer: null }
  }

  if (!isOfferResponse(response)) {
    log.warn('unexpected response shape', response)
    return { offer: null }
  }

  return response
}

function injectBanner(result: HTMLElement, label: string): void {
  const host = document.createElement('div')
  const shadow = host.attachShadow({ mode: 'closed' })

  const style = document.createElement('style')
  style.textContent = bannerCss

  const banner = document.createElement('div')
  banner.className = 'cashback-banner'
  banner.textContent = `\u{1F4B0} ${label}`

  shadow.append(style, banner)
  result.prepend(host)
}

main()
