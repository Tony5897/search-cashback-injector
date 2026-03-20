import type { Merchant, Offer, FallbackData } from './types'
import fallbackData from '../../data/fallback.json'

const fallback = fallbackData as FallbackData

export function buildOffer(merchant: Merchant): Offer {
  const entry = fallback.offers.find(o => merchant.domains.includes(o.domain))
  return {
    merchant,
    label: entry?.label ?? `Earn ${String(merchant.cashbackPercent)}% cashback at ${merchant.name}`,
    cashbackPercent: entry?.cashbackPercent ?? merchant.cashbackPercent,
    source: 'registry',
  }
}
