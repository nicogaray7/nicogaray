// Génération de titre + description (FR et EN) à partir de l'image et des
// métadonnées EXIF, via l'API Google Gemini (offre gratuite).
// Zéro coût : clé AI Studio sans facturation. Best effort : en cas d'absence
// de clé ou d'erreur, renvoie null et l'upload continue normalement.

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export type PhotoMetadataContext = {
  camera?: string | null;
  lens?: string | null;
  focalLength?: string | null;
  aperture?: string | null;
  shutterSpeed?: string | null;
  iso?: number | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  takenAt?: Date | null;
};

export type GeneratedPhotoMetadata = {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
};

function buildContextLine(ctx: PhotoMetadataContext): string {
  const parts: string[] = [];
  const place = [ctx.city, ctx.region, ctx.country].filter(Boolean).join(', ');
  if (place) parts.push(`Lieu : ${place}`);
  if (ctx.takenAt) parts.push(`Date : ${ctx.takenAt.toISOString().slice(0, 10)}`);
  if (ctx.camera) parts.push(`Appareil : ${ctx.camera}`);
  if (ctx.lens) parts.push(`Objectif : ${ctx.lens}`);
  const settings = [
    ctx.focalLength,
    ctx.aperture,
    ctx.shutterSpeed,
    ctx.iso != null ? `ISO ${ctx.iso}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  if (settings) parts.push(`Réglages : ${settings}`);
  return parts.length ? parts.join('\n') : 'Aucune métadonnée disponible.';
}

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    titleEn: { type: 'string' },
    description: { type: 'string' },
    descriptionEn: { type: 'string' },
  },
  required: ['title', 'titleEn', 'description', 'descriptionEn'],
} as const;

/**
 * Génère titre + description bilingues pour une photo.
 * @param imageBuffer vignette JPEG (petite taille suffit)
 * @returns métadonnées générées, ou null si indisponible (clé absente, erreur, timeout)
 */
export async function generatePhotoMetadata(
  imageBuffer: Buffer,
  ctx: PhotoMetadataContext,
): Promise<GeneratedPhotoMetadata | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = [
    "Tu es un photographe francophone qui rédige les légendes d'une galerie d'art.",
    "À partir de l'image et de ses métadonnées, propose un titre court et évocateur",
    'puis une description de 2 phrases, en français soigné (accents corrects obligatoires).',
    'Le titre fait 4 à 10 mots, sans guillemets, sans point final.',
    'Décris ce qui est visible (paysage, lumière, sujet), en intégrant le lieu si pertinent.',
    'Fournis aussi la traduction anglaise naturelle du titre (titleEn) et de la description (descriptionEn).',
    "N'invente pas de lieu qui ne serait pas dans les métadonnées.",
    '',
    'Métadonnées :',
    buildContextLine(ctx),
  ].join('\n');

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: imageBuffer.toString('base64') } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.7,
    },
  };

  const url = `${GEMINI_ENDPOINT}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  // Jusqu'a 3 tentatives : le 429 (quota gratuit) et les 5xx sont souvent
  // transitoires, on reessaie avec un backoff avant d'abandonner.
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) {
        const errText = (await res.text()).slice(0, 300);
        if ((res.status === 429 || res.status >= 500) && attempt < 2) {
          console.error(`[gemini] HTTP ${res.status}, nouvelle tentative ${attempt + 1}/2`);
          await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
          continue;
        }
        console.error('[gemini] HTTP', res.status, errText);
        return null;
      }
      const json = await res.json();
      const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return null;

      const parsed = JSON.parse(text) as Partial<GeneratedPhotoMetadata>;
      if (!parsed.title || !parsed.description) return null;

      const clean = (s: string) => s.trim().replace(/^["'«»]+|["'«».]+$/g, '').trim();
      return {
        title: clean(parsed.title),
        titleEn: parsed.titleEn ? clean(parsed.titleEn) : '',
        description: parsed.description.trim(),
        descriptionEn: parsed.descriptionEn?.trim() ?? '',
      };
    } catch (err) {
      if (attempt < 2) {
        console.error('[gemini] erreur, nouvelle tentative :', err instanceof Error ? err.message : err);
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      console.error('[gemini] génération échouée :', err instanceof Error ? err.message : err);
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
  return null;
}
