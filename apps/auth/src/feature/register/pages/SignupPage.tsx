'use client';

import { useSignupForm } from '../hooks/use-signup-form';
import { SignupForm } from '../components/SignupForm';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import Image from 'next/image';

export function SignupPage() {
  const { values, loading, error, handleChange, handleSubmit } = useSignupForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-layer-base px-4">
      <div className="w-full max-w-2xl bg-layer-panel/60 backdrop-blur-md rounded-2xl border border-outline/30 shadow-2xl p-8 flex flex-col gap-8">
        {/* Header section with branding */}
        <div className="flex flex-col items-center text-center gap-2">
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
            Create Your Merchant Account
          </Text>
          <Text size="label-small" className="text-on-surface-variant/70 mt-2">
            Join our platform and start managing your business
          </Text>
        </div>

        {/* Signup form area */}
        <div className="space-y-6">
          <SignupForm
            values={values}
            loading={loading}
            error={error}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
