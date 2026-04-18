import { useState, useEffect, useCallback } from 'react';
import { taxService } from '@/services/tax/tax.service';
import { Tax, TaxFilters } from '@/services/tax/tax.model';

export interface UseTaxesOptions {
    pageSize?: number;
    initialPage?: number;
}

export function useTaxes(options: UseTaxesOptions = {}) {
    const { pageSize = 10, initialPage = 1 } = options;
    
    const [taxes, setTaxes] = useState<Tax[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total_record: 0,
        total_page: 0,
        page_index: initialPage,
        page_size: pageSize,
    });
    const [filters, setFilters] = useState<TaxFilters>({});
    const [search, setSearch] = useState('');

    // Sync initialPage from props to state (important for URL navigation)
    useEffect(() => {
        if (initialPage !== pagination.page_index) {
            setPagination(prev => ({ ...prev, page_index: initialPage }));
        }
    }, [initialPage]);

    const fetchTaxes = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await taxService.getTaxes({
                page_index: pagination.page_index,
                page_size: pagination.page_size,
                search,
                filters
            });
            if (res.success) {
                setTaxes(res.data);
                setPagination(res.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch taxes:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page_index, pagination.page_size, search, filters]);

    useEffect(() => {
        fetchTaxes();
    }, [fetchTaxes]);

    const handlePageChange = (index: number) => {
        setPagination(prev => ({ ...prev, page_index: index }));
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<TaxFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    return {
        taxes,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters,
        refresh: fetchTaxes
    };
}
