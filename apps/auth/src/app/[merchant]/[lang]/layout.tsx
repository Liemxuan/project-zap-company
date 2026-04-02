interface MerchantLangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ merchant: string; lang: string }>;
}

export default async function MerchantLangLayout({
  children,
  params,
}: MerchantLangLayoutProps) {
  // Resolve params (required in Next.js 16)
  await params;

  return (
    <>
      {children}
    </>
  );
}
