import { BrandPage } from '@/feature/brand/pages/BrandPage';

interface Props {
  params: Promise<{ merchant: string; lang: string }>;
}

export default async function BrandsRoutePage({ params }: Props) {
  const { merchant, lang } = await params;
  return <BrandPage merchant={merchant} lang={lang} />;
}
