import * as React from 'react';
import { Input, type InputProps } from '../../../genesis/atoms/interactive/inputs';

export interface SearchInputProps extends Omit<InputProps, 'type' | 'leadingIcon'> {
    shortcut?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ shortcut = '/', className, ...props }, ref) => {
        return (
            <div className={`relative ${className?.includes('w-full') || !className ? 'w-full' : ''}`}>
                <Input
                    ref={ref}
                    type="text"
                    leadingIcon="search"
                    className={`${className || ''} ${shortcut ? 'pr-10' : ''}`}
                    {...props}
                />
                {shortcut && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-layer-dialog text-[10px] font-dev text-transform-tertiary text-on-surface-variant font-bold text-transform-secondary border-solid border-[length:var(--search-input-border-width,var(--layer-border-width,1px))] border-[color:var(--outline-variant,rgba(0,0,0,0.2))] rounded-[length:calc(var(--search-input-border-radius,var(--radius-shape-small,8px))/2)]">
                            {shortcut}
                        </kbd>
                    </div>
                )}
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';
