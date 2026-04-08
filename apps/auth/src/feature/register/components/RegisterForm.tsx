'use client';
import React from 'react';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Label } from 'zap-design/src/genesis/atoms/interactive/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'zap-design/src/genesis/atoms/interactive/select';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Globe } from 'lucide-react';
import { RegisterInput } from '../models/register.model';
import Link from 'next/link';

interface Props {
  values: RegisterInput;
  loading: boolean;
  isValid: boolean;
  error: string | null;
  onChange: (field: keyof RegisterInput, value: any) => void;
  onSubmit: (e?: React.FormEvent) => void;
  lang: string;
}

const COUNTRIES = [
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'VN', label: 'Vietnam', flag: '🇻🇳' },
  { value: 'SG', label: 'Singapore', flag: '🇸🇬' },
  { value: 'JP', label: 'Japan', flag: '🇯🇵' },
];

export function RegisterForm({ values, loading, isValid, error, onChange, onSubmit, lang }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full max-w-[400px]">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
          <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <Text size="label-small" className="text-red-600 flex-1">
            {error}
          </Text>
        </div>
      )}

      {/* Merchant */}
      <div className="space-y-1.5">
        <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
          Merchant
        </Text>
        <Input
          type="text"
          leadingIcon="store"
          placeholder="my-store-name"
          value={values.merchant_name}
          onChange={(e) => onChange('merchant_name', e.target.value)}
          className="bg-layer-2/50 border-outline/10 focus:ring-primary/20 h-12"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
          Email
        </Text>
        <Input
          type="email"
          leadingIcon="mail"
          placeholder="example@cloud.net"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="bg-layer-2/50 border-outline/10 focus:ring-primary/20 h-12"
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
          Password
        </Text>
        <Input
          type="password"
          leadingIcon="lock"
          trailingIcon="eye"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => onChange('password', e.target.value)}
          className="bg-layer-2/50 border-outline/10 focus:ring-primary/20 h-12"
          required
        />
      </div>

      {/* Country Select */}
      <div className="space-y-1.5">
        <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
          Locale
        </Text>
        <Select
          value={values.locale}
          onValueChange={(val) => onChange('locale', val)}
        >
          <SelectTrigger className="w-full bg-layer-2/50 border-outline/10 focus:ring-primary/20 h-12 px-3">
            <div className="flex items-center gap-2.5">
              <Globe size={18} className="opacity-40 shrink-0" />
              <SelectValue placeholder="Select your country" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-layer-panel border-outline/20">
            {COUNTRIES.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                <span className="mr-2">{country.flag}</span>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Agreement */}
      <div className="flex items-center gap-3 py-2 px-1">
        <Checkbox
          id="agree"
          checked={values.agree}
          onCheckedChange={(checked) => onChange('agree', !!checked)}
          className="shadow-sm"
        />
        <Label htmlFor="agree" className="text-xs text-on-surface-variant/70 cursor-pointer font-medium leading-none">
          I agree to ZAP's <Link href="#" className="text-primary hover:underline font-bold">Terms</Link> and <Link href="#" className="text-primary hover:underline font-bold">Privacy Policy</Link>.
        </Label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading || !isValid}
        className="w-full mt-2 h-12 bg-primary/10 hover:bg-primary/20 text-on-surface border border-primary/30 shadow-lg shadow-primary/5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.5]"
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <div className="h-4 w-4 border-2 border-on-surface/30 border-t-on-surface rounded-full animate-spin" />
          ) : (
            <div className="p-1 rounded-full bg-primary/20 mr-1 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-primary">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
            </div>
          )}
          <span className="font-bold tracking-wider uppercase text-xs">
            {loading ? 'Processing...' : 'Create account'}
          </span>
        </div>
      </Button>

      <div className="text-center mt-2">
        <span className="text-xs text-on-surface-variant/60 font-medium">Already have an account? </span>
        <Link href="/" className="text-xs font-bold text-primary hover:underline underline-offset-4 tracking-tight">
          Sign In
        </Link>
      </div>

      <div className="mt-6 pt-6 border-t border-outline/10 text-center">
        <p className="text-[10px] text-on-surface-variant/40 leading-relaxed uppercase tracking-widest font-medium opacity-60">
          ZAP VAULT SECURITY INFRASTRUCTURE
        </p>
      </div>
    </form>
  );
}
