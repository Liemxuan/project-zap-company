'use client';

import React from 'react';
import { Button } from '../../../genesis/atoms/interactive/buttons';
import { AppleIcon } from '../../../genesis/atoms/icons/apple';
import { GoogleIcon } from '../../../genesis/atoms/icons/google';
import { Text } from '../../../genesis/atoms/typography/text';
import { motion } from 'framer-motion';

interface SocialLoginButtonsProps {
    onApple?: () => void;
    onGoogle?: () => void;
    dividerLabel?: string;
    className?: string;
}

/**
 * L4 Molecule — Social Login Buttons
 * Apple + Google side-by-side outline buttons with "or" divider.
 */
export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
    onApple,
    onGoogle,
    dividerLabel = 'or',
    className = '',
}) => {
    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {/* Divider */}
            <div className="relative flex items-center opacity-70">
                <div className="flex-grow border-t border-outline-variant/40"></div>
                <Text size="body-small" className="flex-shrink-0 mx-4 text-transform-secondary text-on-surface/50 bg-layer-panel px-2">
                    {dividerLabel}
                </Text>
                <div className="flex-grow border-t border-outline-variant/40"></div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Button
                        type="button"
                        visualStyle="outline"
                        color="primary"
                        className="w-full"
                        onClick={onApple}
                    >
                        <AppleIcon className="size-4 shrink-0" />
                        Apple
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Button
                        type="button"
                        visualStyle="outline"
                        color="primary"
                        className="w-full"
                        onClick={onGoogle}
                    >
                        <GoogleIcon className="size-4 shrink-0" />
                        Google
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};
