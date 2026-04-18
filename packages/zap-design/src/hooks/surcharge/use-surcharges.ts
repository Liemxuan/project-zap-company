import { useState, useEffect, useCallback } from 'react';
import { surchargeService } from '@/services/surcharge/surcharge.service';
import { Surcharge, SurchargeFilters } from '@/services/surcharge/surcharge.model';

export interface UseSurchargesOptions {
    pageSize?: number;
    initialPage?: number;
}

export function useSurcharges(options: UseSurchargesOptions = {}) {
    const { pageSize = 10, initialPage = 1 } = options;
    
    const [surcharges, setSurcharges] = useState<Surcharge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total_record: 0,
        total_page: 0,
        page_index: initialPage,
        page_size: pageSize,
    });
    const [filters, setFilters] = useState<SurchargeFilters>({});
    const [search, setSearch] = useState('');

    // Sync initialPage from props to state
    useEffect(() => {
        if (initialPage !== pagination.page_index) {
            setPagination(prev => ({ ...prev, page_index: initialPage }));
        }
    }, [initialPage]);

    const fetchSurcharges = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await surchargeService.getSurcharges({
                page_index: pagination.page_index,
                page_size: pagination.page_size,
                search,
                filters
            });
            if (res.success) {
                setSurcharges(res.data);
                setPagination(res.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch surcharges:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page_index, pagination.page_size, search, filters]);

    useEffect(() => {
        fetchSurcharges();
    }, [fetchSurcharges]);

    const handlePageChange = (index: number) => {
        setPagination(prev => ({ ...prev, page_index: index }));
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<SurchargeFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    return {
        surcharges,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters,
        refresh: fetchSurcharges
    };
}
