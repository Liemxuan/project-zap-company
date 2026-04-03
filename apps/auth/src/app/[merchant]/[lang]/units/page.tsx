'use client';

import { use } from 'react';
import { UnitPage } from '@/feature/unit/pages/UnitPage';

export default function Page({ params }: { params: Promise<{ merchant: string; lang: string }> }) {
  const { merchant, lang } = use(params);
  return <UnitPage merchant={merchant} lang={lang} />;
}
