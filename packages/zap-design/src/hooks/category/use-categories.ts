'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  categoryService, 
  Category, 
  CategoryListRequest, 
  CategoryFilters,
  RequestOptions
} from '../../services';

import { MOCK_CATEGORIES } from '../mock-data';

/**
 * Hook to manage Category List data and logic
 * Handles fetching, pagination, and filtering independently.
 */
export function useCategories(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  // --- State ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Current Request Parameters
  const [params, setParams] = useState<CategoryListRequest>({
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
  const fetchCategories = useCallback(async (currentParams: CategoryListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Simple implementation of search and pagination for mock
      let filtered = [...MOCK_CATEGORIES];
      if (currentParams.search) {
        filtered = filtered.filter(c => (c.name || '').toLowerCase().includes(currentParams.search.toLowerCase()));
      }

      if (currentParams.filters.is_active !== null) {
        filtered = filtered.filter(c => c.is_active === currentParams.filters.is_active);
      }

      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setCategories(items);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await categoryService.getCategoriesList(currentParams, { token, lang });
      
      if (response.success) {
        setCategories(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch categories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useCategories] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  // Trigger fetch when parameters change
  useEffect(() => {
    fetchCategories(params);
  }, [params, fetchCategories]);

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

  const handleFilterChange = useCallback((filters: Partial<CategoryFilters>) => {
    setParams(prev => ({
      ...prev,
      page_index: 1,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchCategories(params);
  }, [params, fetchCategories]);

  return {
    // Data & Status
    categories,
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
 * Hook to manage a single Category Detail
 */
export function useCategoryDetail(id: string | null, options: RequestOptions = {}) {
  const { token, lang = 'en' } = options;
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (categoryId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategoryDetail(categoryId, { token, lang });
      if (response.success) {
        setCategory(response.data);
      } else {
        setError(response.message || 'Failed to fetch category detail');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useCategoryDetail] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang]);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      setCategory(null);
    }
  }, [id, fetchDetail]);

  return {
    category,
    isLoading,
    error,
    refresh: () => id && fetchDetail(id),
  };
}
