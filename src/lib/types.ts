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
