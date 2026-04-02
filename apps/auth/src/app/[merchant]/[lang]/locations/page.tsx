import { LocationPage } from '@/feature/location/pages/LocationPage';

interface Props {
  params: Promise<{ merchant: string; lang: string }>;
}

export default async function LocationsRoutePage({ params }: Props) {
  const { merchant, lang } = await params;
  return <LocationPage merchant={merchant} lang={lang} />;
}
