import { normalizeDomain } from './domains'
import type { Merchant } from './types'

export const MERCHANT_REGISTRY: ReadonlyArray<Merchant> = [
  { domain: 'amazon.com',  name: 'Amazon',   cashbackRate: '3%',   category: 'retail' },
  { domain: 'walmart.com', name: 'Walmart',  cashbackRate: '2%',   category: 'retail' },
  { domain: 'target.com',  name: 'Target',   cashbackRate: '2.5%', category: 'retail' },
  { domain: 'bestbuy.com', name: 'Best Buy', cashbackRate: '1.5%', category: 'electronics' },
  { domain: 'nike.com',    name: 'Nike',     cashbackRate: '4%',   category: 'apparel' },
]

export function findMerchant(domain: string): Merchant | null {
  const normalized = normalizeDomain(domain)
  return MERCHANT_REGISTRY.find(m => m.domain === normalized) ?? null
}
