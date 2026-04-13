'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  groupProductService, 
  GroupProduct, 
  GroupProductListRequest, 
  GroupProductFilters,
  RequestOptions
} from '../../services';

import { MOCK_GROUP_PRODUCTS } from '../mock-data';

/**
 * Hook to manage Group Product List data and logic
 * Handles fetching, pagination, and filtering independently.
 */
export function useGroupProducts(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  // --- State ---
  const [groupProducts, setGroupProducts] = useState<GroupProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Current Request Parameters
  const [params, setParams] = useState<GroupProductListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      is_active: null,
      parent_id: null
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  // --- Data Fetching ---
  const fetchGroupProducts = useCallback(async (currentParams: GroupProductListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Simple implementation of search and pagination for mock
      let filtered = [...MOCK_GROUP_PRODUCTS];
      if (currentParams.search) {
        filtered = filtered.filter(gp => (gp.name || '').toLowerCase().includes(currentParams.search.toLowerCase()));
      }

      if (currentParams.filters.is_active !== null) {
        filtered = filtered.filter(gp => gp.is_active === currentParams.filters.is_active);
      }

      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setGroupProducts(items);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await groupProductService.getGroupProductsList(currentParams, { token, lang });
      
      if (response.success) {
        setGroupProducts(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch group products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useGroupProducts] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  // Trigger fetch when parameters change
  useEffect(() => {
    fetchGroupProducts(params);
  }, [params, fetchGroupProducts]);

  // --- Handlers ---
  
  const handlePageChange = useCallback((page_index: number) => {
    setParams(prev => ({ ...prev, page_index }));
  }, []);

  const handlePageSizeChange = useCallback((page_size: number) => {
    setParams(prev => ({ ...prev, page_size, page_index: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setParams(prev => ({ ...prev, search, page_index: 1 }));
  }, []);

  const handleFilterChange = useCallback((filters: Partial<GroupProductFilters>) => {
    setParams(prev => ({
      ...prev,
      page_index: 1,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchGroupProducts(params);
  }, [params, fetchGroupProducts]);

  return {
    // Data & Status
    groupProducts,
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
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleFilterChange,
    refresh,
  };
}

/**
 * Hook to manage a single Group Product Detail
 */
export function useGroupProductDetail(id: string | null, options: RequestOptions = {}) {
  const { token, lang = 'en' } = options;
  const [groupProduct, setGroupProduct] = useState<GroupProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (groupId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await groupProductService.getGroupProductDetail(groupId, { token, lang });
      if (response.success) {
        setGroupProduct(response.data);
      } else {
        setError(response.message || 'Failed to fetch group product detail');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useGroupProductDetail] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang]);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      setGroupProduct(null);
    }
  }, [id, fetchDetail]);

  return {
    groupProduct,
    isLoading,
    error,
    refresh: () => id && fetchDetail(id),
  };
}
