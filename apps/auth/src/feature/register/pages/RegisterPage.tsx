'use client';
import React from 'react';
import Image from 'next/image';
import { RegisterForm } from '../components/RegisterForm';
import { useRegisterForm } from '../hooks/use-register-form';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Square } from 'lucide-react';

interface Props {
  lang: string;
}

export function RegisterPage({ params }: { params: { lang: string; merchant: string } }) {
  const { values, loading, error, isValid, handleChange, handleSubmit } = useRegisterForm(params.lang);

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-layer-base">

      {/* LEFT COLUMN: FORM */}
      <section className="flex flex-col items-center justify-center p-8 lg:p-24 bg-white relative z-10 animate-in fade-in slide-in-from-left duration-700">
        <div className="w-full max-w-[440px] flex flex-col">

          {/* Logo */}
          <div className="flex flex-col gap-2 group cursor-pointer w-fit">
            <div className="relative w-12 h-12 shadow-2xl group-hover:scale-105 transition-transform">
              <Image
                src="/zap-logo.png"
                alt="ZAP Vault"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <Heading level={1} className="text-4xl lg:text-5xl font-display uppercase tracking-tight text-on-surface leading-tight">
              Let's create your account
            </Heading>
            <Text size="body-medium" className="text-on-surface-variant font-medium leading-relaxed opacity-70">
              Signing up for ZAP is fast and free—no commitments or long-term contracts.
            </Text>
          </div>

          {/* Form */}
          <RegisterForm
            values={values}
            loading={loading}
            isValid={isValid}
            error={error}
            onChange={handleChange}
            onSubmit={handleSubmit}
            lang={params.lang}
          />
        </div>
      </section>

      {/* RIGHT COLUMN: VISUAL */}
      <section className="hidden lg:flex flex-col relative overflow-hidden bg-on-surface p-16 justify-end animate-in fade-in zoom-in duration-1000 delay-300">

        {/* Background Image */}
        <div className="absolute inset-0 opacity-60 mix-blend-luminosity grayscale contrast-125">
          <Image
            src="/signup_merchant_visual_1775445169171.png"
            alt="Merchant Visual"
            fill
            className="object-cover scale-105 animate-pulse-slow"
            priority
          />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent z-10" />

        {/* Marketing Content */}
        <div className="relative z-20 max-w-[500px] flex flex-col gap-12">
          <Heading level={2} className="text-4xl font-display text-white leading-tight drop-shadow-2xl">
            Join the 4 million+ businesses running with ZAP.
          </Heading>

          {/* Logo Cloud (Mock) */}
          <div className="grid grid-cols-3 gap-y-10 gap-x-8 items-center opacity-70 grayscale invert brightness-200 contrast-75">
            <span className="text-xl font-display font-black tracking-tighter">SHAKE SHACK</span>
            <span className="text-xl font-display font-black tracking-tighter">SoFi Stadium</span>
            <span className="text-xl font-display font-black tracking-tighter font-serif italic">Rawlings</span>
            <span className="text-xl font-display font-black tracking-tighter">BEN & JERRY'S</span>
            <span className="text-sm font-display font-black tracking-[0.2em] border-2 border-white px-2 py-1 flex items-center justify-center">MART</span>
            <span className="text-xl font-display font-black tracking-tighter font-mono underline decoration-4 underline-offset-4">Junzi</span>
          </div>
        </div>
      </section>

    </main>
  );
}
