'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/products';

interface ProductsClientProps {
  products: Product[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  search: string;
}

export default function ProductsClient({
  products,
  total,
  pageIndex,
  pageSize,
  totalPages,
  search: initialSearch,
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page_size', newSize.toString());
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-sky-400"
        />
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-sky-400 transition-colors"
              >
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sky-400 font-bold">
                      ${product.price?.toFixed(2) || 'N/A'}
                    </span>
                    <button className="px-3 py-1 bg-sky-600 hover:bg-sky-500 rounded text-sm">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, pageIndex - 1))}
                disabled={pageIndex === 1}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, pageIndex + 1))}
                disabled={pageIndex === totalPages}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded"
              >
                Next
              </button>
            </div>
            <div className="text-zinc-400">
              Page {pageIndex} of {totalPages}
            </div>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-400">No products found</p>
        </div>
      )}
    </>
  );
}
