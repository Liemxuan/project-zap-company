import { ProductPage } from '@/feature/product/pages/ProductPage';

interface Props {
  params: Promise<{ merchant: string; lang: string }>;
}

export default async function ProductsRoutePage({ params }: Props) {
  const { merchant, lang } = await params;
  return <ProductPage merchant={merchant} lang={lang} />;
}
