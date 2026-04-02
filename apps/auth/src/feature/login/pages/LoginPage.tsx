'use client';
import { useLoginForm } from '../hooks/use-login-form';
import { LoginForm } from '../components/LoginForm';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { LangDropdown } from '../components/LangDropdown';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import type { SupportedLang } from '@/const';
import { t } from '@/lib/i18n';
import { Check } from 'lucide-react';
import Image from 'next/image';

interface Props {
  merchant: string;
  lang: SupportedLang;
}

export function LoginPage({ merchant, lang }: Props) {
  const { values, loading, error, theme, currentLang, dict, handleChange, handleSubmit, toggleTheme, changeLang } =
    useLoginForm(merchant, lang);

  return (
    <div className="min-h-screen flex items-center justify-center bg-layer-base px-4" data-theme={theme}>
      <div className="w-full max-w-sm bg-layer-panel/60 backdrop-blur-md rounded-2xl border border-outline/30 shadow-2xl p-8 flex flex-col gap-8">
        {/* Header section with branding and controls */}
        <div className="flex flex-col items-center text-center gap-2 relative">
          <div className="relative w-16 h-16 mb-2">
            <Image 
              src="/zap-logo.png" 
              alt="ZAP Vault" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <Heading level={1} className="text-3xl font-display uppercase tracking-tight text-on-surface">
            zap vault
          </Heading>
          <Text size="body-small" className="text-on-surface-variant font-medium uppercase tracking-wider opacity-60">
            Master Authentication Gateway
          </Text>
          
          {/* Top-right floating controls row */}
          <div className="absolute -top-4 -right-4 flex items-center gap-2">
            <LangDropdown current={currentLang} onChange={changeLang} />
            <DarkModeToggle theme={theme} onToggle={toggleTheme} label={t(dict, theme)} />
          </div>
        </div>

        {/* Login form area */}
        <div className="space-y-6">
          <LoginForm
            values={values}
            loading={loading}
            error={error}
            dict={dict}
            onChange={handleChange}
            onSubmit={handleSubmit}
            merchant={merchant}
          />
        </div>
      </div>
    </div>
  );
}
