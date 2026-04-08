'use client';
import { useParams } from 'next/navigation';
import { BusinessMatchPage } from '@/feature/register/pages/BusinessMatchPage';

export default function Page() {
  const params = useParams() as { lang: string; merchant: string };
  return <BusinessMatchPage params={params} />;
}
