"use client";

import React, { useState } from 'react';
import { Icon } from '../icons/Icon';
import { Eye, EyeOff } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'outlined' | 'filled';
    leadingIcon?: string;
    trailingIcon?: string;
    isError?: boolean;
    errorMessage?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', variant = 'filled', leadingIcon, trailingIcon, isError: propIsError, errorMessage: propErrorMessage, disabled, name, type, ...props }, ref) => {
        
        const formContext = useFormContext();
        // Check for field errors if name exists and context is provided
        const fieldError = name && formContext?.formState?.errors ? formContext.formState.errors[name] : null;
        const isError = propIsError || !!fieldError;
        const errorMessage = propErrorMessage || (fieldError?.message as string);

        const baseClasses = "w-full transition-all duration-200 focus:outline-none focus:ring-2 text-on-surface font-body border-solid";
        
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

        // Calculate padding based on icons (error icon is now on the right side)
        const hasTrailingSpace = trailingIcon || isPassword || isError;
        const paddingClasses = `px-3 ${leadingIcon ? 'pl-10' : ''} ${hasTrailingSpace ? 'pr-10' : ''}`;
        
        const inputClasses = cn(
            baseClasses,
            variantClasses[variant],
            errorClasses,
            disabledClasses,
            paddingClasses,
            className
        );

        let resolvedBorderWidth = 'var(--input-border-width, var(--layer-border-width, 1px))';
        if (isError) {
            resolvedBorderWidth = 'var(--input-border-width, 2px)';
        } else if (variant === 'filled') {
            resolvedBorderWidth = 'var(--input-border-width, 0px)';
        }

        const dynamicStyles: React.CSSProperties = {
            height: 'var(--input-height, var(--button-height, 48px))',
            borderRadius: 'var(--input-border-radius, var(--layer-border-radius, 8px))',
            borderWidth: resolvedBorderWidth,
            borderStyle: 'var(--input-border-style, solid)',
            
            // Core Backgrounds
            '--local-bg-outlined': 'var(--input-bg-outlined, transparent)',
            '--local-bg-filled': 'var(--input-bg-filled, var(--color-surface-container-high))',
            '--local-bg-filled-focus': 'var(--input-bg-filled-focus, var(--color-surface-container-highest))',
            
            // Core Borders
            '--local-border-outlined': 'var(--input-border-outlined, color-mix(in srgb, var(--color-outline-variant) 50%, transparent))',
            '--local-border-filled': 'var(--input-border-filled, transparent)',
            
            // Core Focus
            '--local-focus-border': 'var(--input-focus-border, var(--color-outline))',
            '--local-focus-ring': 'var(--input-focus-ring, color-mix(in srgb, var(--color-primary) 80%, transparent))',
            
            // Error States
            '--local-error-border': 'var(--input-error-border, var(--color-error))',
            '--local-error-text': 'var(--input-error-text, var(--color-error))',
            '--local-error-ring': 'var(--input-error-ring, color-mix(in srgb, var(--color-error) 80%, transparent))',
            
            ...props.style
        } as React.CSSProperties;

        const renderWrapper = (children: React.ReactNode) => {
            if (!errorMessage) return <>{children}</>;
            return (
                <div className={`flex flex-col ${className?.includes('w-full') || !className ? 'w-full' : ''}`}>
                    {children}
                    <p className="text-xs text-error font-medium px-1 mt-1.5 flex items-center">
                        <Icon name="error" size={14} className="mr-1 mt-0.5" />
                        {errorMessage}
                    </p>
                </div>
            );
        };

        if (!leadingIcon && !trailingIcon && !isError && !isPassword) {
             return renderWrapper(
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
        }

        return renderWrapper(
            <div className={`relative ${className.includes('w-full') || !className ? 'w-full' : ''}`}>
                {leadingIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Icon name={leadingIcon} size={20} />
                    </div>
                )}
                <input
                    ref={ref}
                    disabled={disabled}
                    className={inputClasses}
                    style={dynamicStyles}
                    name={name}
                    type={currentType}
                    {...props}
                />
                {(trailingIcon || isPassword || isError) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {isError && !isPassword && (
                            <Icon name="warning" size={20} className="text-error" />
                        )}
                        {!isError && trailingIcon && !isPassword && (
                            <Icon name={trailingIcon} size={20} className="text-muted-foreground" />
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
        );
    }
);

Input.displayName = 'Input';
