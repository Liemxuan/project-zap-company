'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  collectionService, 
  Collection, 
  CollectionListRequest, 
  CollectionFilters,
  RequestOptions
} from '../../services';

import { MOCK_COLLECTIONS } from '../mock-data';

/**
 * Hook to manage Collection List data and logic
 * Handles fetching, pagination, and filtering independently.
 */
export function useCollections(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  // --- State ---
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Current Request Parameters
  const [params, setParams] = useState<CollectionListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      is_active: null
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  // --- Data Fetching ---
  const fetchCollections = useCallback(async (currentParams: CollectionListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Simple implementation of search and pagination for mock
      let filtered = [...MOCK_COLLECTIONS];
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

      setCollections(items);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await collectionService.getCollectionsList(currentParams, { token, lang });
      
      if (response.success) {
        setCollections(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch collections');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useCollections] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  // Trigger fetch when parameters change
  useEffect(() => {
    fetchCollections(params);
  }, [params, fetchCollections]);

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

  const handleFilterChange = useCallback((filters: Partial<CollectionFilters>) => {
    setParams(prev => ({
      ...prev,
      page_index: 1,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchCollections(params);
  }, [params, fetchCollections]);

  return {
    // Data & Status
    collections,
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
 * Hook to manage a single Collection Detail
 */
export function useCollectionDetail(id: string | null, options: RequestOptions = {}) {
  const { token, lang = 'en' } = options;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (collectionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await collectionService.getCollectionDetail(collectionId, { token, lang });
      if (response.success) {
        setCollection(response.data);
      } else {
        setError(response.message || 'Failed to fetch collection detail');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useCollectionDetail] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang]);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      setCollection(null);
    }
  }, [id, fetchDetail]);

  return {
    collection,
    isLoading,
    error,
    refresh: () => id && fetchDetail(id),
  };
}
