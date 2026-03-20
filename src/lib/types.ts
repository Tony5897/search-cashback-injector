// ---------------------------------------------------------------------------
// Merchant
// ---------------------------------------------------------------------------

export interface Merchant {
  readonly id: string
  readonly name: string
  readonly domains: readonly string[]
  readonly cashbackPercent: number
  readonly category: string
}

// ---------------------------------------------------------------------------
// Offer
// ---------------------------------------------------------------------------

export type OfferSource = 'registry' | 'cache' | 'fallback'

export interface Offer {
  readonly merchant: Merchant
  readonly label: string
  readonly cashbackPercent: number
  readonly source: OfferSource
}

// ---------------------------------------------------------------------------
// Fallback data (data/fallback.json)
// ---------------------------------------------------------------------------

export interface FallbackEntry {
  readonly domain: string
  readonly label: string
  readonly cashbackPercent: number
}

export interface FallbackData {
  readonly version: string
  readonly offers: readonly FallbackEntry[]
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export interface OfferRequest {
  readonly domain: string
}

export interface OfferResponse {
  readonly offer: Offer | null
}

export type MessageType = 'RESOLVE_OFFER'

export interface ExtensionMessage {
  readonly type: MessageType
  readonly payload: OfferRequest
}

// ---------------------------------------------------------------------------
// Runtime type guards
// ---------------------------------------------------------------------------

/** Validates that an unknown value conforms to the ExtensionMessage shape. */
export function isExtensionMessage(value: unknown): value is ExtensionMessage {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  if (obj.type !== 'RESOLVE_OFFER') return false
  if (typeof obj.payload !== 'object' || obj.payload === null) return false
  return typeof (obj.payload as Record<string, unknown>).domain === 'string'
}

/** Validates that an unknown value conforms to the OfferResponse shape. */
export function isOfferResponse(value: unknown): value is OfferResponse {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  if (!('offer' in obj)) return false
  if (obj.offer === null) return true
  if (typeof obj.offer !== 'object') return false
  const offer = obj.offer as Record<string, unknown>
  return typeof offer.label === 'string' && typeof offer.cashbackPercent === 'number'
}
