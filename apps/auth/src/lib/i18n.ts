import type { SupportedLang } from '@/const';

type TranslationDict = Record<string, string>;
const cache: Record<string, TranslationDict> = {};

export async function loadTranslations(lang: SupportedLang, page: string): Promise<TranslationDict> {
  const key = `${lang}/${page}`;
  if (cache[key]) return cache[key];
  try {
    const mod = await import(`@/locales/${lang}/${page}.json`);
    cache[key] = mod.default;
    return mod.default;
  } catch {
    // Fallback to English
    const fallback = await import(`@/locales/en/${page}.json`);
    cache[key] = fallback.default;
    return fallback.default;
  }
}

export function t(dict: TranslationDict, key: string): string {
  return dict[key] ?? key;
}
