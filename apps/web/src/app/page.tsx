import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { FoundationLogin } from 'zap-design/src/components/ui/FoundationLogin';
import { loginAction } from '@olympus/zap-auth/src/actions';

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('zap_session');

  // If logged in, redirect to products
  if (session) {
    redirect('/products');
  }

  // Show login page if not logged in
  return (
    <FoundationLogin
      appName="Consumer Web Storefront"
      description="The public-facing e-commerce application. Browse our products catalog and make purchases."
      duties={[
          "Browse and search product catalog",
          "View product details and prices",
          "Manage your shopping cart",
          "Secure checkout and payment"
      ]}
      onLogin={loginAction}
    />
  );
}
