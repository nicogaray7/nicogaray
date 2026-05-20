import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  className?: string;
  as?: 'link' | 'span';
}

export function Logo({
  href = '/',
  size = 'md',
  variant = 'dark',
  className,
  as = 'link',
}: LogoProps) {
  const sizeClass =
    size === 'sm'
      ? 'text-sm'
      : size === 'lg'
        ? 'text-2xl sm:text-3xl'
        : size === 'xl'
          ? 'text-5xl sm:text-7xl lg:text-8xl'
          : 'text-base sm:text-lg';

  const colorClass = variant === 'light' ? 'text-paper hover:text-paper/80' : 'text-ink hover:text-accent';

  const inner = (
    <span
      className={cn(
        'font-display tracking-[0.32em] uppercase leading-none transition-colors duration-300',
        sizeClass,
        colorClass,
        className,
      )}
    >
      Nico Garay
    </span>
  );

  if (as === 'span') return inner;
  return <Link href={href}>{inner}</Link>;
}
