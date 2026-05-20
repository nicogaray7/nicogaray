/**
 * Pure helper for building public R2 URLs. Isolated from lib/r2.ts (which
 * imports the AWS SDK and must stay server-only) so client components can
 * import it without dragging server code into the client bundle.
 */
export function r2PublicUrl(key: string): string | null {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, '')}/${key}`;
}
