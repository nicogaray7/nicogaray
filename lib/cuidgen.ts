/**
 * Lightweight CUID-like unique ID generator.
 * Using the `cuid2` package if available, otherwise crypto.randomUUID.
 */
import crypto from 'crypto'

export function cuid(): string {
  return crypto.randomUUID().replace(/-/g, '')
}
