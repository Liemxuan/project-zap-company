import { useState, useEffect, useCallback } from 'react';
import { Unit, UnitFilters } from '@/services/unit/unit.model';
import { unitService } from '@/services/unit/unit.service';

interface UseUnitsOptions {
    pageSize?: number;
    initialFilters?: UnitFilters;
    initialPage?: number;
}

export function useUnits({ pageSize = 10, initialFilters = {}, initialPage = 1 }: UseUnitsOptions = {}) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<UnitFilters>(initialFilters);
    const [pagination, setPagination] = useState({
        page_index: initialPage,
        page_size: pageSize,
        total_record: 0,
        total_page: 0
    });

    const fetchUnits = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await unitService.getUnits({
                page_index: pagination.page_index,
                p: pagination.page_index,
                page_size: pagination.page_size,
                search,
                filters,
                sort: {
                    field: 'id',
                    descending: true
                }
            });

            if (response.success) {
                setUnits(response.data.items);
                setPagination(prev => ({
                    ...prev,
                    total_record: response.data.total_record,
                    total_page: response.data.total_page
                }));
            }
        } catch (error) {
            console.error('Failed to fetch units:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page_index, pagination.page_size, search, filters]);

    useEffect(() => {
        fetchUnits();
    }, [fetchUnits]);

    const handlePageChange = (index: number) => {
        setPagination(prev => ({ ...prev, page_index: index }));
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<UnitFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    return {
        units,
        isLoading,
        pagination,
        filters,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        refresh: fetchUnits
    };
}
