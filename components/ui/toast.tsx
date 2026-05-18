'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

type ToastVariant = 'default' | 'success' | 'error';
interface ToastItem { id: string; title: string; description?: string; variant: ToastVariant }

const ToastContext = React.createContext<{
  toast: (t: Omit<ToastItem, 'id'> | string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((t: Omit<ToastItem, 'id'> | string) => {
    const id = crypto.randomUUID();
    const item: ToastItem =
      typeof t === 'string'
        ? { id, title: t, variant: 'default' }
        : { id, title: t.title, description: t.description, variant: t.variant ?? 'default' };
    setItems((prev) => [...prev, item]);
    setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== item.id)), 4500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'min-w-[280px] max-w-sm border bg-paper-cool px-5 py-3 shadow-sm animate-fade-up pointer-events-auto',
              item.variant === 'success' && 'border-green-700/40',
              item.variant === 'error' && 'border-red-700/40',
              item.variant === 'default' && 'border-line',
            )}
          >
            <p className="text-sm font-medium text-ink">{item.title}</p>
            {item.description && <p className="text-xs text-ink-muted mt-1">{item.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
