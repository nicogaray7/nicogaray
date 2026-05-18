import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-sans text-[11px] tracking-widest uppercase whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper hover:bg-ink-soft px-7 py-3.5',
        secondary: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper px-7 py-3.5',
        ghost: 'text-ink-muted hover:text-accent px-2 py-1',
        link: 'text-accent hover:text-ink underline-offset-4 hover:underline',
        accent: 'bg-accent text-paper hover:bg-accent-dim px-7 py-3.5',
        destructive: 'bg-red-900 text-paper hover:bg-red-950 px-7 py-3.5',
      },
      size: {
        default: 'h-12',
        sm: 'h-9 px-4 text-[10px]',
        lg: 'h-14 px-9',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
