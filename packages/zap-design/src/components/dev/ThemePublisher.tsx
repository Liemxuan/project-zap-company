'use client';

import React, { useState, useEffect } from "react"
import { Wrapper } from '../../components/dev/Wrapper'
import { Button } from '../../genesis/atoms/interactive/buttons'
import type { ButtonProps } from '../../genesis/atoms/interactive/buttons'
import { Icon } from '../../genesis/atoms/icons/Icon'
import { cn } from '../../lib/utils'

export interface ThemePublisherProps extends React.HTMLAttributes<HTMLDivElement> {
    theme: string;
    onPublish: () => void | Promise<void>;
    filePath: string;
    isLoading?: boolean;
    buttonProps?: Partial<ButtonProps>;
    /**
     * Set to true if this publisher is being used outside the standard Sandbox Inspector.
     */
    hideWrapper?: boolean;
}

/**
 * Universal Theme Publisher module.
 * 
 * Enforces ZAP L1-L2 Layer Evasion by wrapping the publisher in a <section> tag to block LOUD GREEN 
 * dev-mode debug color bleed.
 * 
 * Automatically binds the dashed Inspector bounds to hug the exact radius of the generated Button.
 * Syncs automatically with the Active Theme's saved Button configuration variables.
 */
export function ThemePublisher({ 
    theme, 
    onPublish, 
    filePath, 
    isLoading, 
    buttonProps,
    className,
    hideWrapper = false
}: ThemePublisherProps) {
    
    const [fetchedProps, setFetchedProps] = useState<Partial<ButtonProps>>({});
    const [internalIsLoading, setInternalIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    
    const activeIsLoading = isLoading || internalIsLoading;

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch(`/api/theme/publish?theme=${theme}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.variables) {
                        const newProps: Partial<ButtonProps> = {};
                        
                        if (data.variables['--button-variant-style']) {
                            newProps.variant = data.variables['--button-variant-style'] as ButtonProps["variant"];
                        }
                        if (data.variables['--button-visual-style']) {
                            newProps.visualStyle = data.variables['--button-visual-style'] as ButtonProps["visualStyle"];
                        }
                        if (data.variables['--button-color']) {
                            newProps.color = data.variables['--button-color'] as ButtonProps["color"];
                        }
                        if (data.variables['--button-size']) {
                            newProps.size = data.variables['--button-size'] as ButtonProps["size"];
                        }
                        if (data.variables['--button-icon-position']) {
                            newProps.iconPosition = data.variables['--button-icon-position'] as ButtonProps["iconPosition"];
                        }
                        // Default to medium size to fit standard inspector UI gracefully, 
                        // unless overridden by standard overrides.
                        
                        setFetchedProps(newProps);
                    }
                }
            } catch {
                // Silently fallback to defaults if network fetch fails on serverless edge
            }
        }
        if (theme) {
            fetchSettings();
        }
    }, [theme]);

    const handlePublish = async () => {
        setInternalIsLoading(true);
        setIsSuccess(false);
        setIsError(false);
        try {
            await onPublish();
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch {
            setIsError(true);
            setTimeout(() => setIsError(false), 3000);
        } finally {
            setInternalIsLoading(false);
        }
    };

    const iconSize = fetchedProps.size === 'tiny' || fetchedProps.size === 'compact' ? 16 : 20;

    const content = (
        <Button
            onClick={handlePublish}
            visualStyle={fetchedProps.visualStyle || "solid"}
            color={isError ? "destructive" : (fetchedProps.color || "primary")}
            variant={fetchedProps.variant || "neo"}
            size={fetchedProps.size || "medium"}
            {...buttonProps}
            className={cn(
                "w-full h-10 transition-all text-xs font-bold tracking-wide", 
                "border border-primary/30 shadow-sm",
                fetchedProps.variant === 'neo' && "border-2 border-foreground", 
                buttonProps?.className, 
                className
            )}
            disabled={activeIsLoading || buttonProps?.disabled}
        >
            {fetchedProps.iconPosition !== 'none' && !isSuccess && !isError && (
                <Icon name="rocket_launch" size={16} className="opacity-90" />
            )}
            {isSuccess && <Icon name="check" size={16} />}
            {isError && <Icon name="error" size={16} />}
            <span>
                {activeIsLoading ? "publishing..." : 
                 isSuccess ? "published!" :
                 isError ? "publish failed" : 
                 `publish to ${theme} theme`}
            </span>
        </Button>
    );

    if (hideWrapper) {
        return content;
    }

    return (
        <Wrapper 
            style={{ borderRadius: 'var(--button-border-radius)' }} 
            identity={{ 
                displayName: "Theme Publisher", 
                type: "Publish Action", 
                filePath 
            }}
        >
            <section className="rounded-md w-full h-full">
                {content}
            </section>
        </Wrapper>
    );
}
