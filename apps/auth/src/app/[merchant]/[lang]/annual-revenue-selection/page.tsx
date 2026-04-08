import { AnnualRevenueForm } from '@/feature/register/components/AnnualRevenueForm';

export default async function AnnualRevenuePage({
  params,
}: {
  params: Promise<{
    merchant: string;
    lang: string;
  }>;
}) {
  const { merchant, lang } = await params;
  return <AnnualRevenueForm merchantId={merchant} lang={lang} />;
}
