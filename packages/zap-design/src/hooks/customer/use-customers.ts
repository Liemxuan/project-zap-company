'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  customerService, 
  Customer, 
  CustomerListRequest, 
  CustomerFilters,
  RequestOptions
} from '../../services';

import { MOCK_CUSTOMERS } from '../mock-data';

/**
 * Hook to manage Customer List data and logic
 */
export function useCustomers(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  // --- State ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Current Request Parameters
  const [params, setParams] = useState<CustomerListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      is_active: null,
      membership: undefined,
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  // --- Data Fetching ---
  const fetchCustomers = useCallback(async (currentParams: CustomerListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = [...MOCK_CUSTOMERS];
      if (currentParams.search) {
        filtered = filtered.filter(c => 
          (c.name || '').toLowerCase().includes(currentParams.search.toLowerCase()) ||
          (c.phone || '').includes(currentParams.search)
        );
      }

      if (currentParams.filters.is_active !== null) {
        filtered = filtered.filter(c => c.is_active === currentParams.filters.is_active);
      }

      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setCustomers(items as Customer[]);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await customerService.getCustomersList(currentParams, { token, lang });
      
      if (response.success) {
        setCustomers(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch customers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useCustomers] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  useEffect(() => {
    fetchCustomers(params);
  }, [params, fetchCustomers]);

  const handlePageChange = useCallback((page_index: number) => {
    setParams(prev => ({ ...prev, page_index }));
  }, []);

  const handlePageSizeChange = useCallback((page_size: number) => {
    setParams(prev => ({ ...prev, page_size, page_index: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setParams(prev => ({ ...prev, search, page_index: 1 }));
  }, []);

  const handleFilterChange = useCallback((filters: Partial<CustomerFilters>) => {
    setParams(prev => ({
      ...prev,
      page_index: 1,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchCustomers(params);
  }, [params, fetchCustomers]);

  return {
    customers,
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
