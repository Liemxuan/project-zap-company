'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  membershipService, 
  Membership, 
  MembershipListRequest, 
  MembershipFilters,
  RequestOptions
} from '../../services';

import { MOCK_MEMBERSHIPS } from '../mock-data';

/**
 * Hook to manage Membership List data and logic
 */
export function useMemberships(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  // --- State ---
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Current Request Parameters
  const [params, setParams] = useState<MembershipListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      is_active: null,
      billing_cycle: undefined,
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true' || true; // Force mock for now

  // --- Data Fetching ---
  const fetchMemberships = useCallback(async (currentParams: MembershipListRequest) => {
    setIsLoading(true);
    setError(null);

    // Mock Logic
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = [...MOCK_MEMBERSHIPS];
      if (currentParams.search) {
        filtered = filtered.filter(m => 
          (m.tier || '').toLowerCase().includes(currentParams.search.toLowerCase()) ||
          (m.benefit || '').toLowerCase().includes(currentParams.search.toLowerCase())
        );
      }

      if (currentParams.filters.is_active !== null) {
        filtered = filtered.filter(m => m.is_active === currentParams.filters.is_active);
      }
      
      if (currentParams.filters.billing_cycle) {
        filtered = filtered.filter(m => m.billing_cycle === currentParams.filters.billing_cycle);
      }

      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setMemberships(items as Membership[]);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      // Note: service might need implementation of getMembershipsList
      const response = await membershipService.getList(); // Simplified for now
      
      if (response.success) {
        setMemberships(response.data);
        setTotalRecords(response.data.length);
        setTotalPages(1);
      } else {
        setError(response.message || 'Failed to fetch memberships');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useMemberships] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isMock]);

  useEffect(() => {
    fetchMemberships(params);
  }, [params, fetchMemberships]);

  const handlePageChange = useCallback((page_index: number) => {
    setParams(prev => ({ ...prev, page_index }));
  }, []);

  const handlePageSizeChange = useCallback((page_size: number) => {
    setParams(prev => ({ ...prev, page_size, page_index: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setParams(prev => ({ ...prev, search, page_index: 1 }));
  }, []);

  const handleFilterChange = useCallback((filters: Partial<MembershipFilters>) => {
    setParams(prev => ({
      ...prev,
      page_index: 1,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchMemberships(params);
  }, [params, fetchMemberships]);

  return {
    memberships,
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
 * Hook to manage a single Membership detail
 */
export function useMembershipDetail(id: string | null) {
    const [membership, setMembership] = useState<Membership | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true' || true;

    useEffect(() => {
        if (!id) {
            setMembership(null);
            return;
        }

        const fetchDetail = async () => {
            setIsLoading(true);
            if (isMock) {
                await new Promise(resolve => setTimeout(resolve, 300));
                const found = MOCK_MEMBERSHIPS.find(m => m.id === id);
                setMembership(found ? (found as Membership) : null);
            } else {
                try {
                    const response = await membershipService.getById(id);
                    if (response.success) {
                        setMembership(response.data);
                    }
                } catch (err) {
                    console.error('[useMembershipDetail] Error:', err);
                }
            }
            setIsLoading(false);
        };

        fetchDetail();
    }, [id, isMock]);

    return {
        membership,
        isLoading
    };
}
