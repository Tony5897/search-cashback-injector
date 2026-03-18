import { normalizeDomain } from './domains'
import type { Merchant } from './types'

export const MERCHANT_REGISTRY: ReadonlyArray<Merchant> = [
  // Retail
  { domain: 'amazon.com',    name: 'Amazon',      cashbackRate: '3%',   category: 'retail'      },
  { domain: 'walmart.com',   name: 'Walmart',     cashbackRate: '2%',   category: 'retail'      },
  { domain: 'target.com',    name: 'Target',      cashbackRate: '2.5%', category: 'retail'      },
  { domain: 'ebay.com',      name: 'eBay',        cashbackRate: '2%',   category: 'retail'      },
  { domain: 'etsy.com',      name: 'Etsy',        cashbackRate: '3%',   category: 'retail'      },
  { domain: 'costco.com',    name: 'Costco',      cashbackRate: '1%',   category: 'retail'      },
  // Electronics
  { domain: 'bestbuy.com',   name: 'Best Buy',    cashbackRate: '1.5%', category: 'electronics' },
  // Apparel & Sports
  { domain: 'nike.com',      name: 'Nike',        cashbackRate: '4%',   category: 'apparel'     },
  { domain: 'adidas.com',    name: 'Adidas',      cashbackRate: '5%',   category: 'sports'      },
  { domain: 'macys.com',     name: "Macy's",      cashbackRate: '3%',   category: 'apparel'     },
  { domain: 'nordstrom.com', name: 'Nordstrom',   cashbackRate: '3%',   category: 'apparel'     },
  // Home & Hardware
  { domain: 'homedepot.com', name: 'Home Depot',  cashbackRate: '2%',   category: 'home'        },
  { domain: 'lowes.com',     name: "Lowe's",      cashbackRate: '2%',   category: 'home'        },
  // Travel
  { domain: 'expedia.com',   name: 'Expedia',     cashbackRate: '5%',   category: 'travel'      },
  { domain: 'hotels.com',    name: 'Hotels.com',  cashbackRate: '5%',   category: 'travel'      },
  { domain: 'booking.com',   name: 'Booking.com', cashbackRate: '4%',   category: 'travel'      },
  // Food & Grocery
  { domain: 'doordash.com',  name: 'DoorDash',    cashbackRate: '3%',   category: 'food'        },
  { domain: 'instacart.com', name: 'Instacart',   cashbackRate: '2%',   category: 'food'        },
  // Gaming
  { domain: 'gamestop.com',  name: 'GameStop',    cashbackRate: '2%',   category: 'gaming'      },
  // Beauty
  { domain: 'sephora.com',   name: 'Sephora',     cashbackRate: '4%',   category: 'beauty'      },
]

export function findMerchant(domain: string): Merchant | null {
  const normalized = normalizeDomain(domain)
  return MERCHANT_REGISTRY.find(m => m.domain === normalized) ?? null
}
