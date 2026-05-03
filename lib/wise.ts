/**
 * Wise (TransferWise) integration for IBAN bank transfers.
 * API docs: https://docs.wise.com/api-docs
 */

const WISE_BASE = 'https://api.wise.com'

async function wiseRequest(path: string, options?: RequestInit) {
  const res = await fetch(`${WISE_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.WISE_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Wise API error ${res.status}: ${text}`)
  }
  return res.json()
}

export function generateWiseReference(orderId: string): string {
  return `NICO-${orderId.slice(0, 8).toUpperCase()}`
}

export async function getWiseBalance(): Promise<number> {
  const profile = await wiseRequest(`/v1/profiles/${process.env.WISE_PROFILE_ID}`)
  const balances = await wiseRequest(`/v4/profiles/${profile.id}/balances?types=STANDARD`)
  const eur = balances.find((b: { currency: string }) => b.currency === 'EUR')
  return eur?.amount?.value ?? 0
}

export interface WiseTransfer {
  id: string
  reference: string
  amount: number
  currency: string
  status: string
  created: string
}

export async function findTransferByReference(reference: string): Promise<WiseTransfer | null> {
  try {
    const transfers = await wiseRequest(
      `/v1/transfers?profile=${process.env.WISE_PROFILE_ID}&status=incoming_payment_waiting,funds_converted,outgoing_payment_sent`,
    )
    return transfers.find((t: WiseTransfer) => t.reference === reference) ?? null
  } catch {
    return null
  }
}
