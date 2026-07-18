// In-memory rate limiter - resets on redeploy (acceptable for mono-instance back office).

const store = new Map<string, number[]>();

export function checkRate(
  key: string,
  opts?: { max?: number; windowMs?: number },
): { allowed: boolean; retryAfterSec: number } {
  const max = opts?.max ?? 5;
  const windowMs = opts?.windowMs ?? 15 * 60 * 1000;

  const now = Date.now();
  const timestamps = (store.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= max) {
    const oldest = timestamps[0];
    const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
    store.set(key, timestamps);
    return { allowed: false, retryAfterSec };
  }

  timestamps.push(now);
  store.set(key, timestamps);
  return { allowed: true, retryAfterSec: 0 };
}

export function resetRate(key: string): void {
  store.delete(key);
}
