'use client';

import { motion } from 'framer-motion';
import { Plus, type LucideIcon } from 'lucide-react';
import React from 'react';

import { Button } from '../../genesis/atoms/interactive/button';

/* ─────────────────────────────────────────────
 * ListEmpty — Empty-state organism for ListTable
 * Sits inside L6 CanvasDesktop body when data[] is empty.
 * Uses L1→L6 surface tokens, zero hardcoded colors.
 * ──────────────────────────────────────────── */

export interface ListEmptyAction {
  /** CTA label */
  label: string;
  /** Fires when CTA is clicked */
  onClick: () => void;
  /** Lucide icon for the button */
  icon?: LucideIcon;
  /** Button variant — defaults to 'primary' for first, 'outline' for rest */
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
}

export interface ListEmptyProps {
  /** Lucide icon rendered inside the circle */
  icon?: LucideIcon;
  /** Primary headline */
  title?: string;
  /** Supporting copy below the title */
  description?: string;
  /** Array of action buttons */
  actions?: ListEmptyAction[];
  /** Extra className on the root wrapper */
  className?: string;

  /* ── Legacy single-button API (still works) ── */
  buttonLabel?: string;
  onAction?: () => void;
}

export function ListEmpty({
  icon: Icon = Plus,
  title = 'No items yet',
  description = 'Get started by creating your first entry.',
  actions,
  className,
  buttonLabel,
  onAction,
}: ListEmptyProps) {
  // Normalise: merge legacy single-button into actions[]
  const resolvedActions: ListEmptyAction[] = actions
    ?? (onAction ? [{ label: buttonLabel ?? 'Add Item', onClick: onAction, icon: Plus }] : []);

  return (
    /* L5 outer surface — matches ListTable card shell */
    <div
      className={[
        'flex flex-1 items-center justify-center',
        'w-full min-h-[400px]',
        'bg-layer-canvas',
        'border border-outline-variant',
        'rounded-[length:var(--table-border-radius,var(--radius-card,8px))]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Card Wrapper ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 px-6 py-16 max-w-md text-center"
      >
        {/* ── Circle Icon ── */}
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
          className={[
            'flex items-center justify-center',
            'h-20 w-20 rounded-full',
            'bg-layer-cover border-2 border-outline-variant',
            'shadow-sm',
          ].join(' ')}
        >
          <Icon className="h-8 w-8 text-muted-foreground/60" strokeWidth={1.5} />
        </motion.div>

        {/* ── Title ── */}
        <h3 className="font-display text-transform-primary text-lg font-semibold text-foreground tracking-tight">
          {title}
        </h3>

        {/* ── Description ── */}
        <p className="font-body text-transform-secondary text-sm text-muted-foreground leading-relaxed max-w-xs">
          {description}
        </p>

        {/* ── Action Buttons ── */}
        {resolvedActions.length > 0 && (
          <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
            {resolvedActions.map((action, idx) => {
              const ActionIcon = action.icon ?? Plus;
              const variant = action.variant ?? (idx === 0 ? 'primary' : 'outline');

              return (
                <motion.div key={idx} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant={variant}
                    size="sm"
                    onClick={action.onClick}
                    className="h-[var(--input-height,var(--button-height,48px))] px-8 gap-2"
                  >
                    <ActionIcon className="h-4 w-4" />
                    <span className="font-display font-medium text-xs">{action.label}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
