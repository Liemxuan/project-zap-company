'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  menuService, 
  Menu, 
  MenuListRequest, 
  MenuFilters,
  RequestOptions
} from '../../services';

import { MOCK_MENUS } from '../mock-data';

/**
 * Hook to manage Menu List data and logic
 */
export function useMenus(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  // --- State ---
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Current Request Parameters
  const [params, setParams] = useState<MenuListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      is_active: null,
      location_id: undefined,
      channel_id: undefined
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  // --- Data Fetching ---
  const fetchMenus = useCallback(async (currentParams: MenuListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = [...MOCK_MENUS];
      if (currentParams.search) {
        filtered = filtered.filter(m => (m.name || '').toLowerCase().includes(currentParams.search.toLowerCase()));
      }

      if (currentParams.filters.is_active !== null) {
        filtered = filtered.filter(m => m.is_active === currentParams.filters.is_active);
      }

      // Add more specific mock filters if needed for Location/Channel

      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setMenus(items);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await menuService.getMenusList(currentParams, { token, lang });
      
      if (response.success) {
        setMenus(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch menus');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useMenus] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  useEffect(() => {
    fetchMenus(params);
  }, [params, fetchMenus]);

  const handlePageChange = useCallback((page_index: number) => {
    setParams(prev => ({ ...prev, page_index }));
  }, []);

  const handlePageSizeChange = useCallback((page_size: number) => {
    setParams(prev => ({ ...prev, page_size, page_index: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setParams(prev => ({ ...prev, search, page_index: 1 }));
  }, []);

  const handleFilterChange = useCallback((filters: Partial<MenuFilters>) => {
    setParams(prev => ({
      ...prev,
      page_index: 1,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchMenus(params);
  }, [params, fetchMenus]);

  return {
    menus,
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
 * Hook to manage a single Menu Detail
 */
export function useMenuDetail(id: string | null, options: RequestOptions = {}) {
  const { token, lang = 'en' } = options;
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (menuId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await menuService.getMenuDetail(menuId, { token, lang });
      if (response.success) {
        setMenu(response.data);
      } else {
        setError(response.message || 'Failed to fetch menu detail');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useMenuDetail] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang]);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      setMenu(null);
    }
  }, [id, fetchDetail]);

  return {
    menu,
    isLoading,
    error,
    refresh: () => id && fetchDetail(id),
  };
}
