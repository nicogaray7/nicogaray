import { NextResponse } from 'next/server'

/** Lightweight endpoint for post-deploy HTTP checks (CI, uptime). */
export function GET() {
  return NextResponse.json({ ok: true })
}
