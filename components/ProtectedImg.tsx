'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

/**
 * Image with light copy protection: blocks right-click context menu,
 * drag, save-as via long-press, and selection. Combined with the tiled
 * watermark applied at processing time on the server, this discourages
 * casual image theft without breaking layout or accessibility.
 */
export function ProtectedImg({ className, src, alt, ...rest }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={cn('select-none', className)}
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        ...(rest.style ?? {}),
      }}
      {...rest}
    />
  );
}
