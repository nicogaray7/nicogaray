import sharp from 'sharp'

// ─── Watermark SVG ───────────────────────────────────────────────────────────

function buildWatermarkSVG(width: number, height: number): Buffer {
  const unit = Math.min(width, height)

  const centerText = `
    <text
      x="50%" y="50%"
      font-family="Georgia, serif"
      font-size="${unit * 0.07}px"
      fill="white" fill-opacity="0.18"
      text-anchor="middle" dominant-baseline="middle"
      transform="rotate(-30, ${width / 2}, ${height / 2})"
      letter-spacing="8"
    >© NICO GARAY</text>`

  const gridItems: string[] = []
  const step = unit * 0.28
  for (let x = -step; x < width + step; x += step) {
    for (let y = -step; y < height + step; y += step) {
      gridItems.push(`
        <text
          x="${x}" y="${y}"
          font-family="Georgia, serif"
          font-size="${unit * 0.025}px"
          fill="white" fill-opacity="0.10"
          text-anchor="middle"
          transform="rotate(-30, ${x}, ${y})"
          letter-spacing="4"
        >photos.nicogaray.com</text>`)
    }
  }

  const banner = `
    <rect x="0" y="${height - unit * 0.06}" width="${width}" height="${unit * 0.06}" fill="black" fill-opacity="0.45"/>
    <text
      x="20" y="${height - unit * 0.015}"
      font-family="Georgia, serif"
      font-size="${unit * 0.028}px"
      fill="white" fill-opacity="0.9"
    >© Nico Garay — photos.nicogaray.com — Tous droits réservés</text>`

  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${centerText}
      ${gridItems.join('')}
      ${banner}
    </svg>`)
}

export async function applyWatermark(inputBuffer: Buffer): Promise<Buffer> {
  const meta = await sharp(inputBuffer).metadata()
  const { width = 1200, height = 800 } = meta
  const svg = buildWatermarkSVG(width, height)
  return sharp(inputBuffer)
    .composite([{ input: svg, top: 0, left: 0 }])
    .jpeg({ quality: 82 })
    .toBuffer()
}

// ─── Watermark acheteur (HD livré) ───────────────────────────────────────────

export async function applyBuyerWatermark(
  hdBuffer: Buffer,
  order: { buyerEmail: string; id: string; paidAt: Date },
): Promise<Buffer> {
  const meta = await sharp(hdBuffer).metadata()
  const { width = 4000, height = 3000 } = meta

  const svg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="${height - 60}" width="${width}" height="60" fill="black" fill-opacity="0.5"/>
      <text x="20" y="${height - 20}"
        font-family="Georgia, serif" font-size="22px"
        fill="white" fill-opacity="0.85"
      >© Nico Garay | Licencié à ${order.buyerEmail} | Réf: ${order.id} | ${order.paidAt.toISOString().split('T')[0]}</text>
    </svg>`)

  return sharp(hdBuffer)
    .composite([{ input: svg, top: 0, left: 0 }])
    .jpeg({ quality: 95 })
    .toBuffer()
}

// ─── Traitement upload complet ────────────────────────────────────────────────

export interface ProcessedPhoto {
  hd: Buffer
  preview: Buffer   // 1200px, watermark, JPEG
  thumb: Buffer     // 800px, watermark, WebP
  width: number
  height: number
}

export async function processPhoto(originalBuffer: Buffer): Promise<ProcessedPhoto> {
  const meta = await sharp(originalBuffer).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0

  const preview = await sharp(originalBuffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .toBuffer()
    .then(applyWatermark)

  const thumb = await sharp(originalBuffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer()
    .then(applyWatermark)

  return { hd: originalBuffer, preview, thumb, width, height }
}
