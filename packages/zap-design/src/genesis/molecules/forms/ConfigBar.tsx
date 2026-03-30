'use client';

import React from 'react';
import { Text } from '../../../genesis/atoms/typography/text';
import { motion } from 'framer-motion';

interface ConfigBarProps {
    activeLang: string;
    onCycleLang: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
    className?: string;
}

/**
 * L4 Molecule — Config Bar (Language + Theme Toggles)
 * Floating L5-styled pill bar for auth surfaces.
 */
export const ConfigBar: React.FC<ConfigBarProps> = ({
    activeLang,
    onCycleLang,
    isDarkMode,
    onToggleTheme,
    className = '',
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Language Selector */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCycleLang}
                className="bg-layer-modal px-3 py-1.5 border border-outline-variant/60 shadow-2xl flex items-center gap-2 backdrop-blur-xl cursor-pointer hover:bg-on-surface/5"
                style={{ borderRadius: 'var(--layer-5-border-radius, 8px)' }}
            >
                <Text size="body-tiny" className="font-bold text-on-surface tracking-wider">
                    {activeLang}
                </Text>
            </motion.div>

            {/* Theme Switcher */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleTheme}
                className="bg-layer-modal px-3 py-1.5 border border-outline-variant/60 shadow-2xl flex items-center gap-2 backdrop-blur-xl cursor-pointer hover:bg-on-surface/5"
                style={{ borderRadius: 'var(--layer-5-border-radius, 8px)' }}
            >
                <Text size="body-tiny" className="font-bold text-on-surface tracking-wider uppercase">
                    {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                </Text>
            </motion.div>
        </div>
    );
};
