import { extractDomain } from '@/lib/domains'
import type { ExtensionMessage, OfferResponse } from '@/lib/types'
import bannerCss from '@/styles/banner.css?inline'

const INJECTED_ATTR = 'data-cashback-injected'
const RESULT_SELECTOR = '#search .g'

function main(): void {
  scanResults()
  const target = document.getElementById('search') ?? document.body
  // Block body required — arrow shorthand returning void is confusing.
  const observer = new MutationObserver(() => { scanResults() })
  observer.observe(target, { childList: true, subtree: true })
}

function scanResults(): void {
  document.querySelectorAll<HTMLElement>(RESULT_SELECTOR).forEach(processResult)
}

function processResult(result: HTMLElement): void {
  if (result.hasAttribute(INJECTED_ATTR)) return

  const link = result.querySelector<HTMLAnchorElement>('a[href]')
  if (!link?.href) return

  const domain = extractDomain(link.href)
  if (!domain) return

  // Mark pending to prevent duplicate processing while the async call resolves.
  result.setAttribute(INJECTED_ATTR, 'pending')

  requestOffer(domain)
    .then(({ offer }) => {
      if (!offer) {
        result.removeAttribute(INJECTED_ATTR)
        return
      }
      injectBanner(result, offer.label)
      result.setAttribute(INJECTED_ATTR, 'injected')
    })
    .catch((err: unknown) => {
      console.error('[cashback] failed to resolve offer', err)
      result.removeAttribute(INJECTED_ATTR)
    })
}

async function requestOffer(domain: string): Promise<OfferResponse> {
  const message: ExtensionMessage = { type: 'RESOLVE_OFFER', payload: { domain } }
  // Await into unknown, then assert — avoids redundant Promise<any> cast.
  const response: unknown = await chrome.runtime.sendMessage(message)
  return response as OfferResponse
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
