import { LoginPage } from '@/feature/login';
import type { SupportedLang } from '@/const';

interface Props {
  params: Promise<{ merchant: string; lang: string }>;
}

export default async function LoginRoutePage({ params }: Props) {
  const { merchant, lang } = await params;
  return <LoginPage merchant={merchant} lang={lang as SupportedLang} />;
}
