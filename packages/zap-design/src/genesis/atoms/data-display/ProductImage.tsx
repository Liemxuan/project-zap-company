'use client';

import React from 'react';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';

export interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '100%';
    interactive?: boolean;
}

export const ProductImage = React.forwardRef<HTMLImageElement, ProductImageProps>(
    ({ src, alt, size = '100%', interactive = false, className, ...props }, ref) => {
        const sizeClasses = {
            sm: 'h-12 w-12',
            md: 'h-24 w-24',
            lg: 'h-40 w-40',
            xl: 'h-64 w-64',
            '100%': 'w-full h-full aspect-square',
        };

        return (
            <motion.div
                whileHover={interactive ? { scale: 1.02 } : undefined}
                whileTap={interactive ? { scale: 0.98 } : undefined}
                style={{
                    borderRadius: 'var(--product-image-border-radius, var(--radius-shape-small, 8px))',
                    borderWidth: 'var(--product-image-border-width, 0px)',
                    borderStyle: 'solid'
                }}
                className={cn(
                    "relative overflow-hidden bg-layer-cover object-cover shadow-sm",
                    sizeClasses[size as keyof typeof sizeClasses] || '',
                    "border-primary",
                    interactive && "hover:border-primary-container transition-colors cursor-pointer",
                    className
                )}
            >
                <img
                    ref={ref}
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover rounded-[inherit]"
                    {...props}
                />
            </motion.div>
        );
    }
);

ProductImage.displayName = 'ProductImage';
