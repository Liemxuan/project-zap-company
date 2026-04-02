'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { loadTranslations } from '../lib/i18n';
import { DEFAULT_LANG, SupportedLang, SUPPORTED_LANGS } from '../const';

export function useTranslation(page: string) {
  const params = useParams();
  const langParam = params?.lang as string;
  const [dict, setDict] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const lang: SupportedLang = (langParam && SUPPORTED_LANGS.includes(langParam as SupportedLang)) 
    ? (langParam as SupportedLang) 
    : DEFAULT_LANG;

  useEffect(() => {
    let isMounted = true;
    async function fetch() {
      setLoading(true);
      const d = await loadTranslations(lang, page);
      if (isMounted) {
        setDict(d);
        setLoading(false);
      }
    }
    fetch();
    return () => { isMounted = false; };
  }, [lang, page]);

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let val: any = dict;
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        return fallback ?? key;
      }
    }
    return typeof val === 'string' ? val : (fallback ?? key);
  };

  return { t, lang, loading };
}
