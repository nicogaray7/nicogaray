import { ProtectedImg } from '@/components/ProtectedImg';
import { cn } from '@/lib/utils';

/**
 * Cadre de smartphone (CSS pur) pour prévisualiser une photo en fond d'écran.
 * Ratio 9/19.5 (iPhone récent), Dynamic Island, bordures arrondies.
 * L'image remplit l'écran en object-cover, comme un vrai fond d'écran.
 */
export function PhoneMockup({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-[190px] rounded-[2.2rem] bg-[#111] p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/10',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.7rem] bg-paper-cool" style={{ aspectRatio: '9 / 19.5' }}>
        {src ? (
          <ProtectedImg
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-ink-dim">No image</div>
        )}
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-2.5 h-4 w-14 -translate-x-1/2 rounded-full bg-black/85" />
        {/* Heure + verrouillage, discrets, pour l'effet écran de verrouillage */}
        <div className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
          <span className="font-sans text-3xl font-semibold leading-none">9:41</span>
        </div>
      </div>
    </div>
  );
}
