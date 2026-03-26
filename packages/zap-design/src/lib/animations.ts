/**
 * ZAP Design Engine — Centralized Motion Presets
 * Per motion/SKILL.md: all animations MUST import from here, never inline.
 * Package: framer-motion (motion/react API)
 */

import type { Variants, Transition } from 'framer-motion';

// ─── TRANSITIONS ──────────────────────────────────────────────────────────────

/** Snappy spring — default for interactive elements */
export const spring: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};

/** Soft spring — for layout shifts and reveals */
export const softSpring: Transition = {
    type: 'spring',
    stiffness: 200,
    damping: 24,
};

/** Fast ease — for micro-interactions that should feel instant */
export const fastEase: Transition = {
    type: 'tween',
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1],
};

/** Standard ease — section reveals, page elements */
export const standardEase: Transition = {
    type: 'tween',
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
};

// ─── SCROLL / REVEAL VARIANTS ─────────────────────────────────────────────────

/** Fade + slide up on scroll enter. Use with whileInView. */
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: softSpring,
    },
};

/** Fade in only — for inspector panels, overlays */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: standardEase,
    },
};

/** Scale in — for icon cards, buttons */
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: spring,
    },
};

/** Slide in from left — for vertical nav, side panels */
export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
        opacity: 1,
        x: 0,
        transition: softSpring,
    },
};

// ─── STAGGER CONTAINER ────────────────────────────────────────────────────────

/** Wraps a staggered list — use on parent, children use fadeUp/scaleIn */
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
        },
    },
};

/** Tight stagger — for icon grids with many items */
export const staggerGrid: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.05,
        },
    },
};

// ─── HOVER / TAP PRESETS ──────────────────────────────────────────────────────

/** Neo-Brutalist card hover — slight lift */
export const cardHover = {
    whileHover: {
        y: -2,
        boxShadow: '4px 4px 0px 0px #000',
        transition: fastEase,
    },
    whileTap: {
        y: 0,
        boxShadow: '1px 1px 0px 0px #000',
        transition: fastEase,
    },
};

/** Icon hover — fill flash + scale */
export const iconHover = {
    whileHover: { scale: 1.15, transition: spring },
    whileTap: { scale: 0.9, transition: fastEase },
};

// ─── VIEWPORT CONFIG ──────────────────────────────────────────────────────────

/** Standard viewport trigger — once, with 80px margin */
export const viewportOnce = { once: true, margin: '-80px' };

/** Tight viewport — for dense sections */
export const viewportTight = { once: true, margin: '-40px' };
