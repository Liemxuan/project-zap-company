'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  modifierItemService, 
  ModifierItem, 
  ModifierItemListRequest, 
  ModifierItemFilters,
  RequestOptions
} from '../../services';

import { MOCK_MODIFIER_ITEMS } from '../mock-data';

/**
 * Hook to manage Modifier Item List data and logic
 */
export function useModifierItems(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  // --- State ---
  const [modifierItems, setModifierItems] = useState<ModifierItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Current Request Parameters
  const [params, setParams] = useState<ModifierItemListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      is_active: null,
      display_type: undefined,
      location_id: undefined
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  // --- Data Fetching ---
  const fetchModifierItems = useCallback(async (currentParams: ModifierItemListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = [...MOCK_MODIFIER_ITEMS];
      if (currentParams.search) {
        filtered = filtered.filter(m => (m.name || '').toLowerCase().includes(currentParams.search.toLowerCase()));
      }

      if (currentParams.filters.is_active !== null) {
        filtered = filtered.filter(m => m.is_active === currentParams.filters.is_active);
      }

      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setModifierItems(items);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await modifierItemService.getModifierItemsList(currentParams, { token, lang });
      
      if (response.success) {
        setModifierItems(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch modifier items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useModifierItems] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  useEffect(() => {
    fetchModifierItems(params);
  }, [params, fetchModifierItems]);

  const handlePageChange = useCallback((page_index: number) => {
    setParams(prev => ({ ...prev, page_index }));
  }, []);

  const handlePageSizeChange = useCallback((page_size: number) => {
    setParams(prev => ({ ...prev, page_size, page_index: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setParams(prev => ({ ...prev, search, page_index: 1 }));
  }, []);

  const handleFilterChange = useCallback((filters: Partial<ModifierItemFilters>) => {
    setParams(prev => ({
      ...prev,
      page_index: 1,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchModifierItems(params);
  }, [params, fetchModifierItems]);

  return {
    modifierItems,
    isLoading,
    error,
    pagination: {
      page_index: params.page_index,
      page_size: params.page_size,
      total_record: totalRecords,
      total_page: totalPages,
    },
    search: params.search,
    filters: params.filters,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleFilterChange,
    refresh,
  };
}

/**
 * Hook to manage a single Modifier Item Detail
 */
export function useModifierItemDetail(id: string | null, options: RequestOptions = {}) {
  const { token, lang = 'en' } = options;
  const [modifierItem, setModifierItem] = useState<ModifierItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (itemId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await modifierItemService.getModifierItemDetail(itemId, { token, lang });
      if (response.success) {
        setModifierItem(response.data);
      } else {
        setError(response.message || 'Failed to fetch modifier item detail');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useModifierItemDetail] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang]);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      setModifierItem(null);
    }
  }, [id, fetchDetail]);

  return {
    modifierItem,
    isLoading,
    error,
    refresh: () => id && fetchDetail(id),
  };
}
