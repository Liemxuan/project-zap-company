'use client';

import { use } from 'react';
import { ModifierGroupPage } from '@/feature/modifier-group/pages/ModifierGroupPage';

export default function Page({ params }: { params: Promise<{ merchant: string; lang: string }> }) {
  const { merchant, lang } = use(params);
  return <ModifierGroupPage merchant={merchant} lang={lang} />;
}
