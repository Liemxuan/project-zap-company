'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  brandService, 
  Brand, 
  BrandListRequest, 
  BrandFilters,
  RequestOptions
} from '../../services';
import { MOCK_BRANDS } from '../mock-data';

export function useBrands(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [params, setParams] = useState<BrandListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      status_id: null
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  const fetchBrands = useCallback(async (currentParams: BrandListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...MOCK_BRANDS];
      if (currentParams.search) {
        filtered = filtered.filter(b => b.name.toLowerCase().includes(currentParams.search.toLowerCase()));
      }
      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setBrands(items);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await brandService.getBrandsList(currentParams, { token, lang });
      if (response.success) {
        setBrands(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch brands');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  useEffect(() => {
    fetchBrands(params);
  }, [params, fetchBrands]);

  return {
    brands,
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
    handleFilterChange: (filters: Partial<BrandFilters>) => setParams(p => ({ ...p, filters: { ...p.filters, ...filters }, page_index: 1 })),
    refresh: () => fetchBrands(params)
  };
}
