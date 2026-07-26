import { cn } from '@/lib/utils';

/**
 * Cadre de smartphone en SVG (courbes précises, dégradé métal, boutons
 * latéraux, reflet verre) pour prévisualiser une photo en fond d'écran.
 * `uid` doit être unique par instance (ex: id de la photo) pour éviter les
 * collisions d'id entre plusieurs mockups sur une même page.
 */
export function PhoneMockup({
  src,
  alt,
  uid,
  className,
}: {
  src: string;
  alt: string;
  uid: string;
  className?: string;
}) {
  const screenClip = `phone-screen-${uid}`;
  const frameGrad = `phone-frame-${uid}`;
  const glossGrad = `phone-gloss-${uid}`;

  return (
    <div className={cn('relative mx-auto w-full max-w-[190px] drop-shadow-[0_24px_40px_-16px_rgba(0,0,0,0.45)]', className)}>
      <svg viewBox="0 0 300 616" className="block h-auto w-full" role="img" aria-label={alt}>
        <defs>
          <clipPath id={screenClip}>
            <rect x="13" y="13" width="274" height="590" rx="44" />
          </clipPath>
          <linearGradient id={frameGrad} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5b5c5e" />
            <stop offset="12%" stopColor="#e8e8e9" />
            <stop offset="22%" stopColor="#8b8c8e" />
            <stop offset="78%" stopColor="#4b4b4d" />
            <stop offset="90%" stopColor="#dcdcdc" />
            <stop offset="100%" stopColor="#3a3a3c" />
          </linearGradient>
          <linearGradient id={glossGrad} x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.14" />
            <stop offset="18%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Boutons latéraux, sous le cadre */}
        <rect x="0" y="140" width="3" height="28" rx="1.5" fill="#232324" />
        <rect x="0" y="196" width="3" height="46" rx="1.5" fill="#232324" />
        <rect x="0" y="252" width="3" height="46" rx="1.5" fill="#232324" />
        <rect x="297" y="210" width="3" height="64" rx="1.5" fill="#232324" />

        {/* Cadre (titane) */}
        <rect x="2" y="2" width="296" height="612" rx="58" fill="#101012" />
        <rect x="2" y="2" width="296" height="612" rx="58" fill="none" stroke={`url(#${frameGrad})`} strokeWidth="3" />

        {/* Écran */}
        {src ? (
          <image
            href={src}
            x="13"
            y="13"
            width="274"
            height="590"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${screenClip})`}
          />
        ) : (
          <rect x="13" y="13" width="274" height="590" rx="44" fill="#e5e5e5" />
        )}

        {/* Reflet verre */}
        <rect
          x="13"
          y="13"
          width="274"
          height="590"
          rx="44"
          fill={`url(#${glossGrad})`}
          clipPath={`url(#${screenClip})`}
        />

        {/* Île dynamique */}
        <rect x="112" y="27" width="76" height="24" rx="12" fill="#050505" />
      </svg>
    </div>
  );
}
