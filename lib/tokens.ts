import crypto from 'crypto'
import { addHours } from 'date-fns'

export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function getDownloadExpiry(hours = 48): Date {
  return addHours(new Date(), hours)
}
