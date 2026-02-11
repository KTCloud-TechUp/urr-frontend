import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-50 shadow-sm',
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';

export { Card };
