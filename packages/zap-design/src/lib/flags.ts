/**
 * ZAP-OS Feature Flags
 * 
 * Controls environmental access for L5/L6 routes and experimental domains.
 */

// Controls access to /lab routes (for prototyping & isolation).
export const ENABLE_LAB = process.env.NEXT_PUBLIC_ENABLE_LAB === 'true';

// Controls access to /debug/zap routes (inspectors & specs).
// Should be false in production unless explicitly authorized.
export const ENABLE_DEBUG_TOOLS = process.env.NEXT_PUBLIC_ENABLE_DEBUG_TOOLS === 'true';

// System flags for Olympus Domains
export const ENABLE_DOMAIN_POS = process.env.NEXT_PUBLIC_ENABLE_POS === 'true';
export const ENABLE_DOMAIN_FINANCE = process.env.NEXT_PUBLIC_ENABLE_FINANCE === 'true';
export const ENABLE_DOMAIN_EMPLOYEES = process.env.NEXT_PUBLIC_ENABLE_EMPLOYEES === 'true';
