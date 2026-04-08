'use client';
import React from 'react';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Label } from 'zap-design/src/genesis/atoms/interactive/label';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { BusinessInfoInput } from '../models/register.model';

interface Props {
  values: BusinessInfoInput;
  loading: boolean;
  error: string | null;
  isValid: boolean;
  onChange: (field: keyof BusinessInfoInput, value: any) => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export function BusinessMatchForm({ values, loading, error, isValid, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom duration-700 delay-150">
      
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

      {/* Business Name */}
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Business Name"
          value={values.business_name}
          onChange={(e) => onChange('business_name', e.target.value)}
          className="bg-layer-2/30 border-outline/10 focus:ring-primary/20 h-14 text-lg px-4 !normal-case !text-transform-none"
          required
        />
      </div>

      {/* Business Address */}
      <div className={`space-y-2 transition-all duration-300 ${!values.has_physical_address ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
        <Input
          type="text"
          placeholder="Business Address"
          value={values.business_address}
          onChange={(e) => onChange('business_address', e.target.value)}
          disabled={!values.has_physical_address}
          className="bg-layer-2/30 border-outline/10 focus:ring-primary/20 h-14 text-lg px-4 !normal-case !text-transform-none"
          required={values.has_physical_address}
        />
      </div>

      {/* Physical Address Toggle */}
      <div className="flex items-center gap-3 py-2">
        <Checkbox
          id="no-address"
          checked={!values.has_physical_address}
          onCheckedChange={(checked) => onChange('has_physical_address', !checked)}
          className="w-5 h-5 shadow-sm"
        />
        <Label htmlFor="no-address" className="text-sm text-on-surface/80 cursor-pointer font-medium select-none !normal-case !text-transform-none">
          My business doesn't have a permanent physical address.
        </Label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <Button
          type="submit"
          disabled={loading || !isValid}
          className="w-full h-14 bg-on-surface text-white hover:bg-on-surface/90 rounded-full transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl !normal-case !text-transform-none"
        >
          {loading && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          <span className="font-bold text-lg !normal-case !text-transform-none">{loading ? 'Saving...' : 'Next'}</span>
        </Button>
      </div>

    </form>
  );
}
