'use client';
import React from 'react';
import { BusinessMatchForm } from '../components/BusinessMatchForm';
import { useBusinessMatch } from '../hooks/use-business-match';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';

interface Props {
  params: { lang: string; merchant: string };
}

export function BusinessMatchPage({ params }: Props) {
  const { values, loading, error, isValid, handleChange, handleSubmit } = useBusinessMatch(params.merchant, params.lang);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-6 animate-in fade-in duration-1000">
      
      {/* Header Section */}
      <div className="w-full max-w-[600px] text-center space-y-4 mb-10 animate-in fade-in slide-in-from-top duration-700">
        <Heading level={1} className="text-4xl lg:text-5xl font-display font-medium text-on-surface leading-tight !normal-case !text-transform-none">
          Tell us about your business
        </Heading>
        <Text size="body-large" className="text-on-surface-variant font-medium leading-relaxed max-w-[500px] mx-auto opacity-80 !normal-case !text-transform-none">
          This is what we will use on your emails, receipts, and messages to customers. We will also use this to gather information on your business from publicly available online sources.
        </Text>
      </div>

      {/* Form Section */}
      <BusinessMatchForm
        values={values}
        loading={loading}
        error={error}
        isValid={isValid}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

    </main>
  );
}
