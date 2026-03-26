import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "text-transform": ["text-transform-primary", "text-transform-secondary", "text-transform-tertiary", "uppercase", "lowercase", "capitalize", "normal-case"],
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
