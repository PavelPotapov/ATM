/**
 * @file: input-with-addons.tsx
 * @description: Компонент Input с префиксом и суффиксом
 * @dependencies: Input
 * @created: 2025-01-04
 */

import * as React from 'react';
import { Input } from './input';
import { cn } from '@/shared/lib/utils';

export interface InputWithAddonsProps
  extends React.ComponentPropsWithoutRef<'input'> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  containerClassName?: string;
}

const InputWithAddons = React.forwardRef<
  HTMLInputElement,
  InputWithAddonsProps
>(
  (
    { leading, trailing, containerClassName, className, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'flex items-center rounded-md border border-input bg-background',
          containerClassName,
        )}
      >
        {leading && (
          <div className="flex items-center justify-center px-2 text-muted-foreground">
            {leading}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(
            'border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0',
            leading && 'pl-0',
            trailing && 'pr-0',
            className,
          )}
          {...props}
        />
        {trailing && (
          <div className="flex items-center justify-center px-2 text-muted-foreground">
            {trailing}
          </div>
        )}
      </div>
    );
  },
);
InputWithAddons.displayName = 'InputWithAddons';

export { InputWithAddons };




