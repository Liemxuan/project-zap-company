import MenuPage from '@/feature/menu/pages/MenuPage';

interface Props {
  params: Promise<{ merchant: string; lang: string }>;
}

export default async function MenusRoutePage({ params }: Props) {
  const { merchant, lang } = await params;
  return <MenuPage merchant={merchant} lang={lang} />;
}
