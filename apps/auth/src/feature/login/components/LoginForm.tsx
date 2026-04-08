'use client';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import type { LoginFormValues } from '../models/login.model';

const IS_MOCK = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

interface Props {
  values: LoginFormValues;
  loading: boolean;
  dict: Record<string, string>;
  onChange: (field: keyof LoginFormValues, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  merchant: string;
  error?: string;
}

export function LoginForm({ values, loading, dict, onChange, onSubmit, merchant, error }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">

      {/* Mock hint panel — visible only in mock mode */}
      {IS_MOCK && (
        <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <Text size="label-small" className="text-amber-500/90 font-bold uppercase tracking-widest text-[9px]">
              {dict.mock_hint_title ?? 'Test credentials'}
            </Text>
          </div>
          {[
            { key: 'mock_hint_success',   icon: '✓', color: 'text-emerald-500/80' },
            { key: 'mock_hint_wrong_pw',  icon: '✗', color: 'text-red-400/80'     },
            { key: 'mock_hint_locked',    icon: '✗', color: 'text-red-400/80'     },
            { key: 'mock_hint_merchant',  icon: '✗', color: 'text-red-400/80'     },
          ].map(({ key, icon, color }) => (
            <div key={key} className="flex items-start gap-1.5">
              <span className={`text-[10px] font-bold mt-0.5 ${color}`}>{icon}</span>
              <Text size="label-small" className={`text-[10px] font-mono leading-tight ${color}`}>
                {dict[key]}
              </Text>
            </div>
          ))}
        </div>
      )}

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

      {/* Merchant field */}
      <div className="space-y-1.5">
        <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
          {dict.merchant_label}
        </Text>
        <Input
          type="text"
          leadingIcon="store"
          placeholder={dict.merchant_placeholder ?? 'my-store'}
          value={values.merchant}
          readOnly
          className="bg-layer-2/50 border-outline/10 focus:ring-primary/20 cursor-not-allowed opacity-80"
        />
      </div>

      {/* Email field */}
      <div className="space-y-1.5">
        <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
          {dict.email_label}
        </Text>
        <Input
          type="text"
          autoComplete="username"
          leadingIcon="mail"
          placeholder="example@cloud.net"
          value={values.account}
          onChange={(e) => onChange('account', e.target.value)}
          className="bg-layer-2/50 border-outline/10 focus:ring-primary/20"
        />
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <Text size="label-small" className="font-bold opacity-70 uppercase text-[10px] tracking-widest pl-1">
          {dict.password_label}
        </Text>
        <Input
          type="password"
          autoComplete="current-password"
          leadingIcon="lock"
          trailingIcon="eye"
          placeholder="••••"
          value={values.password}
          onChange={(e) => onChange('password', e.target.value)}
          className="bg-layer-2/50 border-outline/10 focus:ring-primary/20"
        />
      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between px-1 mt-1">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="h-4 w-4 rounded border border-outline/30 flex items-center justify-center bg-layer-2/30 group-hover:border-primary/50 transition-colors">
            <div className="h-2 w-2 rounded-sm bg-primary opacity-60" />
          </div>
          <Text size="label-small" className="text-[11px] font-medium opacity-80">
            {dict.remember_me}
          </Text>
        </div>
        <button type="button" className="text-[11px] font-bold text-primary/80 hover:text-primary transition-colors">
          {dict.forgot_password}
        </button>
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
            {loading ? dict.submitting : dict.submit_button}
          </span>
        </div>
      </Button>
      <div className="text-center mt-6 pt-6 border-t border-outline/10">
        <Text size="label-small" className="text-on-surface-variant/60 font-medium">
          {dict.no_account_text ?? "Don't have a ZAP account?"}
        </Text>
        <div className="mt-2">
          <a
            href={`/${merchant}/en/register`}
            className="text-xs font-bold text-primary hover:text-primary/80 underline decoration-2 underline-offset-4 transition-all"
          >
            {dict.register_link_text ?? "Create your free account"}
          </a>
        </div>
      </div>
    </form>
  );
}
