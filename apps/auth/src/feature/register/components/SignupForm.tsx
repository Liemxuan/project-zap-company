'use client';

import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'zap-design/src/genesis/atoms/interactive/select';
import type { SignupFormValues } from '../models/register.model';

interface Props {
  values: SignupFormValues;
  loading: boolean;
  error?: string;
  onChange: (field: keyof SignupFormValues, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DIALING_CODES = [
  { code: '+84', label: '🇻🇳 Vietnam (+84)' },
  { code: '+1', label: '🇺🇸 USA (+1)' },
  { code: '+44', label: '🇬🇧 UK (+44)' },
  { code: '+81', label: '🇯🇵 Japan (+81)' },
  { code: '+33', label: '🇫🇷 France (+33)' },
  { code: '+86', label: '🇨🇳 China (+86)' },
  { code: '+91', label: '🇮🇳 India (+91)' },
  { code: '+61', label: '🇦🇺 Australia (+61)' },
];

export function SignupForm({ values, loading, error, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Error banner */}
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

      {/* Row 1: Merchant Name & Merchant URL */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
            Merchant Name *
          </Text>
          <Input
            type="text"
            leadingIcon="store"
            placeholder="Cửa Hàng PendoGo"
            value={values.merchant_name}
            onChange={(e) => onChange('merchant_name', e.target.value)}
            className="bg-layer-2/50 border-outline/10 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
            Merchant URL *
          </Text>
          <Input
            type="text"
            placeholder="vancuahang-test"
            value={values.merchant_url}
            onChange={(e) => onChange('merchant_url', e.target.value)}
            className="bg-layer-2/50 border-outline/10 focus:ring-primary/20"
            required
          />
        </div>
      </div>

      {/* Row 2: First Name & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
            First Name *
          </Text>
          <Input
            type="text"
            leadingIcon="person"
            placeholder="Nguyen"
            value={values.first_name}
            onChange={(e) => onChange('first_name', e.target.value)}
            className="bg-layer-2/50 border-outline/10 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
            Last Name *
          </Text>
          <Input
            type="text"
            leadingIcon="person"
            placeholder="Van A"
            value={values.last_name}
            onChange={(e) => onChange('last_name', e.target.value)}
            className="bg-layer-2/50 border-outline/10 focus:ring-primary/20"
            required
          />
        </div>
      </div>

      {/* Email field */}
      <div className="space-y-1.5">
        <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
          Email *
        </Text>
        <Input
          type="email"
          autoComplete="email"
          leadingIcon="mail"
          placeholder="vana@pendo-test-01110.vn"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="bg-layer-2/50 border-outline/10 focus:ring-primary/20"
          required
        />
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
          Password *
        </Text>
        <Input
          type="password"
          autoComplete="new-password"
          leadingIcon="lock"
          trailingIcon="eye"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => onChange('password', e.target.value)}
          className="bg-layer-2/50 border-outline/10 focus:ring-primary/20"
          required
        />
      </div>

      {/* Row 3: Phone with Dialing Code */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
            Code *
          </Text>
          <select
            value={values.dialing_code}
            onChange={(e) => onChange('dialing_code', e.target.value)}
            className="w-full px-3 py-2.5 bg-layer-2/50 border border-outline/30 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors"
            required
          >
            {DIALING_CODES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
            Phone Number *
          </Text>
          <Input
            type="tel"
            leadingIcon="phone"
            placeholder="912345679"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="bg-layer-2/50 border-outline/10 focus:ring-primary/20"
            required
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        size="lg"
        className="w-full mt-4 h-12 bg-primary/10 hover:bg-primary/20 text-on-surface border border-primary/30 shadow-lg shadow-primary/5 rounded-xl transition-all"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </span>
        </div>
      </Button>

      {/* Login link */}
      <div className="text-center mt-2">
        <Text size="label-small" className="text-on-surface-variant/80">
          Already have an account?{' '}
          <a href="/" className="font-bold text-primary hover:underline">
            Sign in
          </a>
        </Text>
      </div>
    </form>
  );
}
