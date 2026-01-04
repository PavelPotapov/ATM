/**
 * @file: kbd.tsx
 * @description: Компонент для отображения клавиатурных сокращений
 * @dependencies: class-variance-authority
 * @created: 2025-01-04
 */

import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export const kbdVariants = cva(
  'select-none rounded border px-1.5 py-px font-mono text-[0.7rem] font-normal shadow-sm disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground',
        outline: 'bg-background text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface KbdProps
  extends React.ComponentPropsWithoutRef<'kbd'>,
    VariantProps<typeof kbdVariants> {
  /**
   * Заголовок для `abbr` элемента внутри `kbd`
   */
  abbrTitle?: string;
}

const Kbd = React.forwardRef<HTMLUnknownElement, KbdProps>(
  ({ abbrTitle, children, className, variant, ...props }, ref) => {
    return (
      <kbd
        className={cn(kbdVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {abbrTitle ? (
          <abbr title={abbrTitle} className="no-underline">
            {children}
          </abbr>
        ) : (
          children
        )}
      </kbd>
    );
  },
);
Kbd.displayName = 'Kbd';

export { Kbd };

