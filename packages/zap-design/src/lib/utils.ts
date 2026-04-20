import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
 "text-transform": ["text-transform-primary", "text-transform-secondary", "text-transform-tertiary", "", "", "", "normal-case"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}


export function parseCssToNumber(value: string | undefined): number {
    if (!value) return 0;
    const str = String(value).trim();
    if (str.endsWith('rem')) {
        return Math.round(parseFloat(str) * 16);
    }
    return Math.round(parseFloat(str)) || 0;
}
export function removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export function getInitials(name: string): string {
    if (!name) return "";
    const cleanName = removeAccents(name.trim());
    const words = cleanName.split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
}
