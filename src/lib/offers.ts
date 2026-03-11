import type { Merchant, Offer } from './types'
import fallbackData from '../../data/fallback.json'

export function buildOffer(merchant: Merchant): Offer {
  const fallback = fallbackData.offers.find(o => o.domain === merchant.domain)
  return {
    merchant,
    label: fallback?.label ?? `Earn ${merchant.cashbackRate} cashback at ${merchant.name}`,
    rate: fallback?.rate ?? merchant.cashbackRate,
  }
}
