import { normalizeDomain } from './domains'
import type { Merchant } from './types'

export const MERCHANT_REGISTRY: ReadonlyArray<Merchant> = [
  // Retail
  { id: 'amazon',    name: 'Amazon',      domains: ['amazon.com'],    cashbackPercent: 3,   category: 'retail'      },
  { id: 'walmart',   name: 'Walmart',     domains: ['walmart.com'],   cashbackPercent: 2,   category: 'retail'      },
  { id: 'target',    name: 'Target',      domains: ['target.com'],    cashbackPercent: 2.5, category: 'retail'      },
  { id: 'ebay',      name: 'eBay',        domains: ['ebay.com'],      cashbackPercent: 2,   category: 'retail'      },
  { id: 'etsy',      name: 'Etsy',        domains: ['etsy.com'],      cashbackPercent: 3,   category: 'retail'      },
  { id: 'costco',    name: 'Costco',      domains: ['costco.com'],    cashbackPercent: 1,   category: 'retail'      },
  // Electronics
  { id: 'bestbuy',   name: 'Best Buy',    domains: ['bestbuy.com'],   cashbackPercent: 1.5, category: 'electronics' },
  // Apparel & Sports
  { id: 'nike',      name: 'Nike',        domains: ['nike.com'],      cashbackPercent: 4,   category: 'apparel'     },
  { id: 'adidas',    name: 'Adidas',      domains: ['adidas.com'],    cashbackPercent: 5,   category: 'sports'      },
  { id: 'macys',     name: "Macy's",      domains: ['macys.com'],     cashbackPercent: 3,   category: 'apparel'     },
  { id: 'nordstrom', name: 'Nordstrom',   domains: ['nordstrom.com'], cashbackPercent: 3,   category: 'apparel'     },
  // Home & Hardware
  { id: 'homedepot', name: 'Home Depot',  domains: ['homedepot.com'], cashbackPercent: 2,   category: 'home'        },
  { id: 'lowes',     name: "Lowe's",      domains: ['lowes.com'],     cashbackPercent: 2,   category: 'home'        },
  // Travel
  { id: 'expedia',   name: 'Expedia',     domains: ['expedia.com'],   cashbackPercent: 5,   category: 'travel'      },
  { id: 'hotels',    name: 'Hotels.com',  domains: ['hotels.com'],    cashbackPercent: 5,   category: 'travel'      },
  { id: 'booking',   name: 'Booking.com', domains: ['booking.com'],   cashbackPercent: 4,   category: 'travel'      },
  // Food & Grocery
  { id: 'doordash',  name: 'DoorDash',    domains: ['doordash.com'],  cashbackPercent: 3,   category: 'food'        },
  { id: 'instacart', name: 'Instacart',   domains: ['instacart.com'], cashbackPercent: 2,   category: 'food'        },
  // Gaming
  { id: 'gamestop',  name: 'GameStop',    domains: ['gamestop.com'],  cashbackPercent: 2,   category: 'gaming'      },
  // Beauty
  { id: 'sephora',   name: 'Sephora',     domains: ['sephora.com'],   cashbackPercent: 4,   category: 'beauty'      },
]

export function findMerchant(domain: string): Merchant | null {
  const normalized = normalizeDomain(domain)
  return MERCHANT_REGISTRY.find(m => m.domains.includes(normalized)) ?? null
}
