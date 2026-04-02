/**
 * Route: /auth/[theme]/products
 * Bridge route that redirects to new merchant/lang product route
 */

import { redirect } from 'next/navigation';

export default function AuthProductsPage() {
  // Redirect to default merchant/lang products page
  redirect('/zap/en/products');
}
