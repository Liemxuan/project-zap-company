'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  diningOptionService, 
  DiningOption, 
  DiningOptionListRequest, 
  DiningOptionFilters,
  RequestOptions
} from '../../services';
import { MOCK_DINING_OPTIONS } from '../mock-data';

export function useDiningOptions(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  const [diningOptions, setDiningOptions] = useState<DiningOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [params, setParams] = useState<DiningOptionListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      status: null,
      type: null
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  const fetchOptions = useCallback(async (currentParams: DiningOptionListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...MOCK_DINING_OPTIONS];
      if (currentParams.search) {
        filtered = filtered.filter(b => b.name.toLowerCase().includes(currentParams.search.toLowerCase()));
      }
      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setDiningOptions(items as any);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await diningOptionService.getDiningOptionsList(currentParams, { token, lang });
      if (response.success) {
        setDiningOptions(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch options');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  useEffect(() => {
    fetchOptions(params);
  }, [params, fetchOptions]);

  return {
    diningOptions,
    isLoading,
    error,
    filters: params.filters,
    search: params.search,
    pagination: { ...params, total_record: totalRecords, total_page: totalPages },
    handlePageChange: (page_index: number) => setParams(p => ({ ...p, page_index })),
    handlePageSizeChange: (page_size: number) => setParams(p => ({ ...p, page_size, page_index: 1 })),
    handleSearch: (search: string) => setParams(p => ({ ...p, search, page_index: 1 })),
    handleFilterChange: (filters: Partial<DiningOptionFilters>) => setParams(p => ({ ...p, filters: { ...p.filters, ...filters }, page_index: 1 })),
    refresh: () => fetchOptions(params)
  };
}
