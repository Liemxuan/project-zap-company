'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../../genesis/atoms/icons/Icon';

// ─── INSPECTOR ACTIONS BAR ──────────────────────────────────────────────────

interface InspectorActionsProps {
    isDirty: boolean;
    isPublishing: boolean;
    publishSuccess: boolean;
    onPublish: () => void;
    onReset: () => void;
}

export const InspectorActions: React.FC<InspectorActionsProps> = ({
    isDirty,
    isPublishing,
    publishSuccess,
    onPublish,
    onReset,
}) => {
    return (
        <div className="sticky bottom-0 z-20 bg-layer-panel/95 backdrop-blur-sm border-t border-outline-variant/30 px-3 py-3">
            <div className="flex items-center gap-2">
                {/* Reset */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    disabled={!isDirty}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                        bg-layer-dialog text-muted-foreground text-[10px] font-bold text-transform-primary tracking-wide
                        hover:bg-error/10 hover:text-error transition-colors
                        disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Icon name="restart_alt" size={14} />
                    Reset
                </motion.button>

                {/* Publish */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onPublish}
                    disabled={!isDirty || isPublishing}
                    className="flex-[2] flex items-center justify-center gap-1.5 py-2 rounded-lg
                        bg-primary text-on-primary text-[10px] font-bold text-transform-primary tracking-wide
                        hover:bg-primary/90 transition-colors
                        disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <AnimatePresence mode="wait">
                        {publishSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className="flex items-center gap-1.5"
                            >
                                <Icon name="check_circle" size={14} />
                                Published
                            </motion.div>
                        ) : isPublishing ? (
                            <motion.div
                                key="publishing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-1.5"
                            >
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                >
                                    <Icon name="sync" size={14} />
                                </motion.span>
                                Saving…
                            </motion.div>
                        ) : (
                            <motion.div
                                key="publish"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-1.5"
                            >
                                <Icon name="publish" size={14} />
                                Publish
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Dirty indicator */}
            <AnimatePresence>
                {isDirty && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 flex items-center gap-1.5 text-[9px] text-tertiary font-bold"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-1.5 h-1.5 rounded-full bg-tertiary"
                        />
                        Unsaved changes
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
