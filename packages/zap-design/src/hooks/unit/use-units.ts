'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  unitService, 
  Unit, 
  UnitListRequest, 
  UnitFilters,
  RequestOptions
} from '../../services';
import { MOCK_UNITS } from '../mock-data';

export function useUnits(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [params, setParams] = useState<UnitListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      status: null
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  const fetchUnits = useCallback(async (currentParams: UnitListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...MOCK_UNITS];
      if (currentParams.search) {
        filtered = filtered.filter(b => b.name.toLowerCase().includes(currentParams.search.toLowerCase()));
      }
      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setUnits(items as any);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await unitService.getUnitsList(currentParams, { token, lang });
      if (response.success) {
        setUnits(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch units');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  useEffect(() => {
    fetchUnits(params);
  }, [params, fetchUnits]);

  return {
    units,
    isLoading,
    error,
    pagination: { ...params, total_record: totalRecords, total_page: totalPages },
    handlePageChange: (page_index: number) => setParams(p => ({ ...p, page_index })),
    handlePageSizeChange: (page_size: number) => setParams(p => ({ ...p, page_size, page_index: 1 })),
    handleSearch: (search: string) => setParams(p => ({ ...p, search, page_index: 1 })),
    handleFilterChange: (filters: Partial<UnitFilters>) => setParams(p => ({ ...p, filters: { ...p.filters, ...filters }, page_index: 1 })),
    refresh: () => fetchUnits(params)
  };
}
