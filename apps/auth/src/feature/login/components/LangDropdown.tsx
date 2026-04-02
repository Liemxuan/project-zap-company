'use client';
import { SUPPORTED_LANGS, type SupportedLang } from '@/const';

const LANG_LABELS: Record<SupportedLang, string> = {
  en: '🇬🇧 EN',
  vi: '🇻🇳 VI',
  fr: '🇫🇷 FR',
  ja: '🇯🇵 JA',
};

interface Props {
  current: SupportedLang;
  onChange: (lang: SupportedLang) => void;
}

export function LangDropdown({ current, onChange }: Props) {
  // We only show EN and VI for the pill as per screenshot
  const langs: SupportedLang[] = ['en', 'vi'];

  return (
    <div className="flex bg-surface-variant/40 rounded-full border border-outline/20 p-1">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all uppercase ${
            current === l 
              ? 'bg-primary text-on-primary shadow-sm scale-105' 
              : 'text-on-surface-variant hover:text-on-surface opacity-60'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
