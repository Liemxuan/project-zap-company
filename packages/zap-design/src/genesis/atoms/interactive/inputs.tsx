"use client";

import React, { useState } from 'react';
import { Icon } from '../icons/Icon';
import { Eye, EyeOff } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../../lib/utils';
import { Text } from '../typography/text';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
    variant?: 'outlined' | 'filled';
    leadingIcon?: string;
    trailingIcon?: string;
    isError?: boolean;
    errorMessage?: string;
    label?: string;
    position?: 'top' | 'floating' | 'left' | 'right';
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', variant = 'filled', leadingIcon, trailingIcon, isError: propIsError, errorMessage: propErrorMessage, disabled, name, type, label, position, prefix, suffix, ...props }, ref) => {

        const formContext = useFormContext();
        const fieldError = name && formContext?.formState?.errors ? formContext.formState.errors[name] : null;
        const isError = propIsError || !!fieldError;
        const errorMessage = propErrorMessage || (fieldError?.message as string);

        const baseClasses = "w-full transition-all duration-200 focus:outline-none focus:ring-2 text-on-surface font-body text-transform-secondary border-solid";

        const variantClasses = {
            outlined: "bg-[color:var(--local-bg-outlined)] border-[color:var(--local-border-outlined)] focus:border-[color:var(--local-focus-border)] focus:ring-[color:var(--local-focus-ring)]",
            filled: "bg-[color:var(--local-bg-filled)] border-[color:var(--local-border-filled)] focus:bg-[color:var(--local-bg-filled-focus)] focus:border-[color:var(--local-focus-border)] focus:ring-[color:var(--local-focus-ring)]"
        };

        const errorClasses = isError
            ? "border-[color:var(--local-error-border)] text-[color:var(--local-error-text)] focus:ring-[color:var(--local-error-ring)]"
            : "";

        const disabledClasses = disabled
            ? "cursor-not-allowed opacity-50 bg-black/5 dark:bg-white/5 text-muted-foreground"
            : "";

        const [passwordVisible, setPasswordVisible] = useState(false);
        const isPassword = type === 'password';
        const currentType = isPassword ? (passwordVisible ? 'text' : 'password') : type;
        const currentLeadingIcon = leadingIcon || (isPassword ? 'lock' : undefined);
        const isFloating = position === 'floating';

        const hasTrailingSpace = trailingIcon || isPassword || isError;
        const paddingClasses = cn(
            'px-3',
            (currentLeadingIcon || prefix) ? 'pl-10' : '',
            (hasTrailingSpace || suffix) ? 'pr-10' : '',
            isFloating && label ? 'pt-5 pb-1' : ''
        );

        const inputClasses = cn(
            baseClasses,
            variantClasses[variant],
            errorClasses,
            disabledClasses,
            paddingClasses,
            isFloating ? 'placeholder-transparent peer' : '',
            className
        );

        let resolvedBorderWidth = 'var(--input-border-width, var(--layer-border-width, 1px))';
        if (isError) {
            resolvedBorderWidth = 'var(--input-border-width, 2px)';
        } else if (variant === 'filled') {
            resolvedBorderWidth = 'var(--input-border-width, 0px)';
        }

        const dynamicStyles: React.CSSProperties = {
            height: isFloating && label ? 'var(--input-height, var(--button-height, 56px))' : 'var(--input-height, var(--button-height, 48px))',
            borderRadius: 'var(--input-border-radius, var(--layer-border-radius, 8px))',
            borderWidth: resolvedBorderWidth,
            borderStyle: 'var(--input-border-style, solid)',

            '--local-bg-outlined': 'var(--input-bg-outlined, transparent)',
            '--local-bg-filled': 'var(--input-bg-filled, var(--color-surface-container-high))',
            '--local-bg-filled-focus': 'var(--input-bg-filled-focus, var(--color-surface-container-highest))',
            '--local-border-outlined': 'var(--input-border-outlined, color-mix(in srgb, var(--color-outline-variant) 50%, transparent))',
            '--local-border-filled': 'var(--input-border-filled, transparent)',
            '--local-focus-border': 'var(--input-focus-border, var(--color-outline))',
            '--local-focus-ring': 'var(--input-focus-ring, color-mix(in srgb, var(--color-primary) 80%, transparent))',
            '--local-error-border': 'var(--input-error-border, var(--color-error))',
            '--local-error-text': 'var(--input-error-text, var(--color-error))',
            '--local-error-ring': 'var(--input-error-ring, color-mix(in srgb, var(--color-error) 80%, transparent))',

            ...props.style
        } as React.CSSProperties;

        /* ── Core input element (with icon wrappers if needed) ── */
        const needsWrapper = leadingIcon || trailingIcon || isError || isPassword || isFloating || prefix || suffix;

        const inputEl = needsWrapper ? (
            <div className={cn('relative', className.includes('w-full') || !className ? 'w-full' : '')}>
                {currentLeadingIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Icon name={currentLeadingIcon} size={20} />
                    </div>
                )}
                {prefix && !currentLeadingIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        {prefix}
                    </div>
                )}
                <input
                    ref={ref}
                    disabled={disabled}
                    className={inputClasses}
                    style={dynamicStyles}
                    name={name}
                    type={currentType}
                    placeholder={isFloating && label ? ' ' : props.placeholder}
                    {...props}
                />
                {/* Floating label */}
                {isFloating && label && (
                    <Text size='label-small' className={cn(
                        "absolute left-3 text-muted-foreground pointer-events-none select-none transition-all duration-200",
                        currentLeadingIcon ? 'left-10' : 'left-3',
                        // Floated state: focus or not placeholder-shown
                        "top-1 text-[10px] font-semibold tracking-wide",
                        // Resting state (placeholder shown = no value, no focus)
                        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal",
                        // Floated state on focus
                        "peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-wide",
                        isError ? "text-error peer-placeholder-shown:text-error/60" : "peer-focus:text-primary",
                        disabled && "opacity-50"
                    )}>
                        {label}
                    </Text>
                )}
                {(trailingIcon || isPassword || isError || suffix) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {isError && !isPassword && <Icon name="warning" size={20} className="text-error" />}
                        {!isError && trailingIcon && !isPassword && <Icon name={trailingIcon} size={20} className="text-muted-foreground" />}
                        {suffix && !isError && !trailingIcon && !isPassword && (
                            <div className="text-muted-foreground flex items-center justify-center">
                                {suffix}
                            </div>
                        )}
                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="text-muted-foreground hover:text-on-surface transition-colors focus:outline-none"
                                aria-label={passwordVisible ? "Hide password" : "Show password"}
                            >
                                {passwordVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                            </button>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <input
                ref={ref}
                disabled={disabled}
                className={inputClasses}
                style={dynamicStyles}
                name={name}
                type={currentType}
                {...props}
            />
        );

        /* ── Error message ── */
        const errorEl = errorMessage ? (
            <p className="text-xs text-error font-medium px-1 mt-1.5 flex items-center">
                <Icon name="error" size={14} className="mr-1 mt-0.5" />
                {errorMessage}
            </p>
        ) : null;

        /* ── Label element (top / left / right) ── */
        const labelEl = label && position !== 'floating' ? (
            <Text size="label-medium" className={cn(
                "font-display text-transform-primary text-sm font-semibold text-foreground shrink-0",
                disabled && "opacity-50",
                position === 'left' || position === 'right' ? 'leading-none' : ''
            )}>
                {label}
            </Text>
        ) : null;

        /* ── Layout by position ── */
        if (position === 'left') {
            return (
                <div className={cn('flex items-center gap-3', className.includes('w-full') || !className ? 'w-full' : '')}>
                    {labelEl}
                    <div className="flex flex-col flex-1 min-w-0">
                        {inputEl}
                        {errorEl}
                    </div>
                </div>
            );
        }

        if (position === 'right') {
            return (
                <div className={cn('flex items-center gap-3', className.includes('w-full') || !className ? 'w-full' : '')}>
                    <div className="flex flex-col flex-1 min-w-0">
                        {inputEl}
                        {errorEl}
                    </div>
                    {labelEl}
                </div>
            );
        }

        if (position === 'top') {
            return (
                <div className={cn('flex flex-col gap-1.5', className.includes('w-full') || !className ? 'w-full' : '')}>
                    {labelEl}
                    {inputEl}
                    {errorEl}
                </div>
            );
        }

        // floating or no position
        if (errorEl) {
            return (
                <div className={cn('flex flex-col', className.includes('w-full') || !className ? 'w-full' : '')}>
                    {inputEl}
                    {errorEl}
                </div>
            );
        }

        return inputEl;
    }
);

Input.displayName = 'Input';
