'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { LoginFormValues } from '../models/login.model';
import { loginService, saveSession } from '../services/login.service';
import { STORAGE_KEYS, DEFAULT_THEME, type SupportedLang, type Theme } from '@/const';
import { loadTranslations, t } from '@/lib/i18n';

export function useLoginForm(merchant: string, lang: SupportedLang) {
  const router = useRouter();

  // Form state
  const [values, setValues] = useState<LoginFormValues>({ merchant, account: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // UI state
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [currentLang, setCurrentLang] = useState<SupportedLang>(lang);
  const [dict, setDict] = useState<Record<string, string>>({});

// Load translations when lang changes
  useEffect(() => {
    loadTranslations(currentLang, 'login').then(setDict);
  }, [currentLang]);

  // Sync state with props when URL changes
  useEffect(() => {
    setCurrentLang(lang);
    setValues(v => ({ ...v, merchant }));
  }, [lang, merchant]);

  // Sync theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const changeLang = (newLang: SupportedLang) => {
    setCurrentLang(newLang);
    localStorage.setItem(STORAGE_KEYS.LANG, newLang);
    // Update URL: /{merchant}/{newLang}/login
    router.push(`/${merchant}/${newLang}/login`);
  };

  const formatMerchant = (m: string) => m.toLowerCase().replace(/\s+/g, '_');

  const handleChange = (field: keyof LoginFormValues, value: string) => {
    const formattedValue = field === 'merchant' ? formatMerchant(value) : value;
    setValues((prev) => ({ ...prev, [field]: formattedValue }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formatted = formatMerchant(values.merchant);
    try {
      const response = await loginService({ ...values, merchant: formatted });
      saveSession(response);
      toast.success(t(dict, 'login_success'));
      router.push(`/${formatted}/${currentLang}/products`);
    } catch (err: any) {
      const msgKey = err.message ?? 'login_failed';
      const errorMsg = t(dict, msgKey) || t(dict, 'login_failed');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { values, loading, error, theme, currentLang, dict, handleChange, handleSubmit, toggleTheme, changeLang };
}
