import { CategoryPage } from '@/feature/category/pages/CategoryPage';

interface Props {
  params: Promise<{ merchant: string; lang: string }>;
}

export default async function CategoriesRoutePage({ params }: Props) {
  const { merchant, lang } = await params;
  return <CategoryPage merchant={merchant} lang={lang} />;
}
