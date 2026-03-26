'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, PenTool, Hand, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ZapFeedbackWidget({ embedded = false }: { embedded?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'pan' | 'draw' | 'comment'>('pan');

    if (!isOpen) {
        return (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setIsOpen(true)}
                className={cn(
                    "z-50 h-12 w-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 hover:shadow-primary/20",
                    embedded ? "relative mt-6 mx-auto" : "fixed bottom-6 right-6"
                )}
                title="Open ZAP Feedback Inspector"
            >
                <MessageSquarePlus className="w-6 h-6" />
            </motion.button>
        );
    }

    return (
        <motion.div
            drag={!embedded}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "z-50 bg-background border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col font-body text-transform-secondary",
                embedded ? "relative w-full mt-4" : "fixed bottom-24 right-6 w-80"
            )}
        >
            {/* Drag Handle & Header */}
            <div className="bg-muted border-b border-border p-3 flex items-center justify-between cursor-grab active:cursor-grabbing">
                <span className="text-sm font-semibold text-foreground">ZAP UI Inspector</span>
                <button onClick={() => setIsOpen(false)} title="Close Inspector" className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
                <div className="flex bg-muted p-1 rounded-lg gap-1 border border-border">
                    <button
                        onClick={() => setMode('pan')}
                        className={`flex-1 py-1.5 flex justify-center rounded-md transition-colors ${mode === 'pan' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Pan Tool"
                    >
                        <Hand className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setMode('draw')}
                        className={`flex-1 py-1.5 flex justify-center rounded-md transition-colors ${mode === 'draw' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Draw (Circle/Square) Tool"
                    >
                        <PenTool className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Comment for Spike</label>
                    <textarea
                        className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                        placeholder="e.g. The bottom margin here is wrong..."
                    />
                </div>

                <button
                    onClick={() => {
                        alert("Annotation logged. ZAP CSO will review.");
                        setIsOpen(false);
                    }}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    Submit Feedback
                </button>
            </div>
        </motion.div>
    );
}
