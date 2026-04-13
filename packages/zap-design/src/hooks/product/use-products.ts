'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  productService, 
  Product, 
  ProductListRequest, 
  ProductFilters,
  RequestOptions
} from '../../services';
import { MOCK_PRODUCTS } from '../mock-data';

export function useProducts(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [params, setParams] = useState<ProductListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      status: null,
      cate_name: null
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  const fetchProducts = useCallback(async (currentParams: ProductListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...MOCK_PRODUCTS];
      if (currentParams.search) {
        filtered = filtered.filter(b => b.name.toLowerCase().includes(currentParams.search.toLowerCase()));
      }
      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setProducts(items as any);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await productService.getProductsList(currentParams, { token, lang });
      if (response.success) {
        setProducts(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  useEffect(() => {
    fetchProducts(params);
  }, [params, fetchProducts]);

  return {
    products,
    isLoading,
    error,
    // Pagination Metadata
    pagination: {
      page_index: params.page_index,
      page_size: params.page_size,
      total_record: totalRecords,
      total_page: totalPages,
    },
    
    // Filters
    search: params.search,
    filters: params.filters,
    
    // Actions
    handlePageChange: (page_index: number) => setParams(p => ({ ...p, page_index })),
    handlePageSizeChange: (page_size: number) => setParams(p => ({ ...p, page_size, page_index: 1 })),
    handleSearch: (search: string) => setParams(p => ({ ...p, search, page_index: 1 })),
    handleFilterChange: (filters: Partial<ProductFilters>) => setParams(p => ({ ...p, filters: { ...p.filters, ...filters }, page_index: 1 })),
    refresh: () => fetchProducts(params)
  };
}
