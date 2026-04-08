'use client';
import { useParams } from 'next/navigation';
import { RegisterPage } from '@/feature/register/pages/RegisterPage';

export default function Page() {
  const params = useParams() as { lang: string; merchant: string };
  return <RegisterPage params={params} />;
}
