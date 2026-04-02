import { fetchProducts, type ProductListResponse, type Product } from '@/lib/products';
import ProductsClient from './products-client';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const pageIndex = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const pageSize = 10;

  let products: Product[] = [];
  let total = 0;
  let error = '';

  try {
    const response: ProductListResponse = await fetchProducts({
      page_index: pageIndex,
      page_size: pageSize,
      search,
      filters: {},
    });

    if (response.success) {
      products = response.data.items;
      total = response.data.total;
    } else {
      error = response.message || 'Failed to load products';
    }
  } catch (err) {
    error = 'Error loading products';
    console.error(err);
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-sky-400">Products</h1>
          <p className="text-zinc-400">Total: {total} products</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
            {error}
          </div>
        )}

        {/* Search & Filter Client */}
        <ProductsClient
          products={products}
          total={total}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalPages={totalPages}
          search={search}
        />
      </div>
    </div>
  );
}
