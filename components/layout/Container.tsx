import { cn } from '@/lib/utils';

export function Container({
  className,
  children,
  size = 'default',
}: {
  className?: string;
  children: React.ReactNode;
  size?: 'default' | 'wide' | 'narrow' | 'prose';
}) {
  return (
    <div
      className={cn(
        'mx-auto px-5 sm:px-8 w-full',
        size === 'default' && 'max-w-7xl',
        size === 'wide' && 'max-w-[1600px]',
        size === 'narrow' && 'max-w-3xl',
        size === 'prose' && 'max-w-2xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
