'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  modifierGroupService, 
  ModifierGroup, 
  ModifierGroupListRequest, 
  ModifierGroupFilters,
  RequestOptions
} from '../../services';
import { MOCK_MODIFIER_GROUPS } from '../mock-data';

export function useModifierGroups(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [params, setParams] = useState<ModifierGroupListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      status: []
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  const fetchGroups = useCallback(async (currentParams: ModifierGroupListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...MOCK_MODIFIER_GROUPS];
      if (currentParams.search) {
        filtered = filtered.filter(b => b.name.toLowerCase().includes(currentParams.search.toLowerCase()));
      }
      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setModifierGroups(items as any);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await modifierGroupService.getModifierGroupsList(currentParams, { token, lang });
      if (response.success) {
        setModifierGroups(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch groups');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  useEffect(() => {
    fetchGroups(params);
  }, [params, fetchGroups]);

  return {
    modifierGroups,
    isLoading,
    error,
    pagination: { ...params, total_record: totalRecords, total_page: totalPages },
    handlePageChange: (page_index: number) => setParams(p => ({ ...p, page_index })),
    handlePageSizeChange: (page_size: number) => setParams(p => ({ ...p, page_size, page_index: 1 })),
    handleSearch: (search: string) => setParams(p => ({ ...p, search, page_index: 1 })),
    handleFilterChange: (filters: Partial<ModifierGroupFilters>) => setParams(p => ({ ...p, filters: { ...p.filters, ...filters }, page_index: 1 })),
    refresh: () => fetchGroups(params)
  };
}
