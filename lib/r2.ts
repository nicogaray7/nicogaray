import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs'
import path from 'path'

const R2_CONFIGURED =
  process.env.R2_ACCOUNT_ID !== 'placeholder' &&
  process.env.R2_ACCESS_KEY_ID !== 'placeholder' &&
  !!process.env.R2_ACCOUNT_ID

const r2 = R2_CONFIGURED
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  : null

const BUCKET = process.env.R2_BUCKET_NAME ?? 'nico-garay-photos'
const LOCAL_DIR = path.join(process.cwd(), 'storage')

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<void> {
  if (!R2_CONFIGURED) {
    // Fallback : stockage local sur le VPS
    const dest = path.join(LOCAL_DIR, key)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, body)
    return
  }
  await r2!.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }))
}

// ─── Download ─────────────────────────────────────────────────────────────────

export async function getFromR2(key: string): Promise<Buffer> {
  if (!R2_CONFIGURED) {
    const src = path.join(LOCAL_DIR, key)
    return fs.readFileSync(src)
  }
  const response = await r2!.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
  const chunks: Uint8Array[] = []
  for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteFromR2(key: string): Promise<void> {
  if (!R2_CONFIGURED) {
    const src = path.join(LOCAL_DIR, key)
    if (fs.existsSync(src)) fs.unlinkSync(src)
    return
  }
  await r2!.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

// ─── URL signée (R2 seulement) ────────────────────────────────────────────────

export async function getSignedDownloadUrl(key: string, expiresIn = 300): Promise<string> {
  if (!R2_CONFIGURED) {
    return `/api/image/${key}`
  }
  return getSignedUrl(r2!, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function r2Key(type: 'hd' | 'preview' | 'thumb', photoId: string): string {
  return `${type}/${photoId}`
}

export function isR2Configured(): boolean {
  return R2_CONFIGURED
}
