'use client';

import React from 'react';
import { Heading } from '../../../genesis/atoms/typography/headings';
import { Text } from '../../../genesis/atoms/typography/text';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    /** Optional left branding panel for desktop split-panel variant */
    brandingPanel?: React.ReactNode;
}

/**
 * L6 Layout — AuthLayout
 * The page shell for all auth surfaces (login, signup, password reset, MFA).
 * Provides: canvas background, ambient grid, animated cover window, header.
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
    title = 'Authenticate',
    subtitle = 'Please enter your credentials below.',
    children,
    brandingPanel,
}) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-layer-canvas p-4 md:p-12 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:32px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`w-full relative z-10 ${brandingPanel ? 'max-w-6xl' : 'max-w-md'}`}
            >
                {/* L2: Cover (The Application Window) */}
                <div
                    className={`w-full bg-layer-cover overflow-hidden flex shadow-2xl border-outline-variant/30 border relative min-h-[650px] ${brandingPanel ? 'flex-col lg:flex-row' : 'flex-col'}`}
                    style={{ borderRadius: 'var(--layer-2-border-radius, 24px)' }}
                >
                    {/* Optional Branding Panel (Desktop only) */}
                    {brandingPanel && (
                        <div className="hidden lg:flex flex-col justify-center p-16 bg-primary/10 w-1/2 relative overflow-hidden group">
                            {brandingPanel}
                        </div>
                    )}

                    {/* Main Auth Content */}
                    <div className={`flex flex-col ${brandingPanel ? 'w-full lg:w-1/2' : 'w-full'}`}>
                        {/* Panel Header */}
                        <div className="p-8 md:p-10 pb-0">
                            <Heading level={2} className="text-on-surface text-transform-primary tracking-tight">
                                {title}
                            </Heading>
                            <Text size="body-main" className="text-on-surface/60 mt-2 block text-transform-secondary">
                                {subtitle}
                            </Text>
                        </div>

                        {/* Form Slot */}
                        <div className="p-6 md:p-10 pt-6 flex items-center justify-center bg-transparent relative z-10">
                            {children}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
