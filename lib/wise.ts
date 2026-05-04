/**
 * Wise (TransferWise) — virements IBAN.
 * Token requis : READ (profil, balances). READ_STATEMENTS pour la vérification auto.
 */

const WISE_BASE = process.env.WISE_API_URL ?? 'https://api.wise.com'

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
    throw new Error(`Wise API ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

export function generateWiseReference(orderId: string): string {
  return `NICO-${orderId.slice(0, 8).toUpperCase()}`
}

export async function getWiseBalance(): Promise<number> {
  try {
    const profileId = process.env.WISE_PROFILE_ID
    const balances = await wiseRequest(`/v4/profiles/${profileId}/balances?types=STANDARD`)
    const eur = balances.find((b: { currency: string }) => b.currency === 'EUR')
    return eur?.amount?.value ?? 0
  } catch {
    return 0
  }
}

export interface WiseTransaction {
  id:        string
  reference: string
  amount:    number
  currency:  string
  status:    string
  date:      string
}

/**
 * Cherche un virement entrant par sa référence dans le relevé de compte Wise.
 * Nécessite le scope READ_STATEMENTS sur le token.
 * Retourne null si le token n'a pas ce scope (vérification manuelle nécessaire).
 */
export async function findIncomingByReference(reference: string): Promise<WiseTransaction | null> {
  try {
    const profileId = process.env.WISE_PROFILE_ID
    const BALANCE_ID = process.env.WISE_BALANCE_ID // optionnel

    // Chercher d'abord le balance EUR si non fourni
    let balanceId = BALANCE_ID
    if (!balanceId) {
      const balances = await wiseRequest(`/v4/profiles/${profileId}/balances?types=STANDARD`)
      const eur = balances.find((b: { currency: string }) => b.currency === 'EUR')
      balanceId = eur?.id?.toString()
    }
    if (!balanceId) return null

    const now   = new Date()
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 jours

    const data = await wiseRequest(
      `/v1/profiles/${profileId}/balance-statements/${balanceId}/statement.json` +
      `?currency=EUR&intervalStart=${start.toISOString()}&intervalEnd=${now.toISOString()}&type=COMPACT`
    )

    const txns: Array<{ details?: { description?: string }; amount?: { value: number }; date?: string; referenceNumber?: string }> =
      data.transactions ?? []

    const match = txns.find(t => {
      const desc = (t.details?.description ?? '').toUpperCase()
      return desc.includes(reference.toUpperCase())
    })

    if (!match) return null

    return {
      id:        match.referenceNumber ?? '',
      reference,
      amount:    match.amount?.value ?? 0,
      currency:  'EUR',
      status:    'completed',
      date:      match.date ?? '',
    }
  } catch {
    // Scope insuffisant → vérification manuelle
    return null
  }
}
