import { BusinessMccPage } from '@/feature/register/pages/BusinessMccPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What kind of business? | ZAP Onboarding',
  description: 'Categorize your business to personalize your Square experience.',
};

export default async function Page({
  params,
}: {
  params: Promise<{ merchant: string; lang: string }>;
}) {
  const { merchant, lang } = await params;
  return <BusinessMccPage merchantId={merchant} lang={lang} />;
}
