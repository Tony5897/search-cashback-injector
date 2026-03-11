export interface Merchant {
  readonly domain: string
  readonly name: string
  readonly cashbackRate: string
  readonly category: string
}

export interface Offer {
  readonly merchant: Merchant
  readonly label: string
  readonly rate: string
}

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
