import { DiningOptionPage } from '@/feature/dining-option/pages/DiningOptionPage';

interface Props {
  params: Promise<{ merchant: string; lang: string }>;
}

export default async function DiningOptionsRoutePage({ params }: Props) {
  const { merchant, lang } = await params;
  return <DiningOptionPage merchant={merchant} lang={lang} />;
}
