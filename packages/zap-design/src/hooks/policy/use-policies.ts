import { useState, useEffect, useCallback } from 'react';
import { Policy, PolicyFilters } from '@/services/policy/policy.model';
import { policyService } from '@/services/policy/policy.service';

interface UsePoliciesOptions {
    pageSize?: number;
    initialFilters?: PolicyFilters;
}

/**
 * Hook for managing policy state and data fetching
 */
export function usePolicies({ pageSize = 10, initialFilters = {} }: UsePoliciesOptions = {}) {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<PolicyFilters>(initialFilters);
    const [pagination, setPagination] = useState({
        page_index: 1,
        page_size: pageSize,
        total_record: 0,
        total_page: 0
    });

    const fetchPolicies = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await policyService.getPolicies({
                page_index: pagination.page_index,
                page_size: pagination.page_size,
                search,
                filters
            });

            if (response.success) {
                setPolicies(response.data.items);
                setPagination(prev => ({
                    ...prev,
                    total_record: response.data.total_record,
                    total_page: response.data.total_page
                }));
            }
        } catch (error) {
            console.error('Failed to fetch policies:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page_index, pagination.page_size, search, filters]);

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    const handlePageChange = (index: number) => {
        setPagination(prev => ({ ...prev, page_index: index }));
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<PolicyFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    return {
        policies,
        isLoading,
        pagination,
        filters,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        refresh: fetchPolicies
    };
}
