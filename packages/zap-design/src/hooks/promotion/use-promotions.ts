import { useState, useEffect, useCallback } from 'react';
import { Promotion, PromotionFilters } from '@/services/promotion/promotion.model';
import { promotionService } from '@/services/promotion/promotion.service';

interface UsePromotionsOptions {
    pageSize?: number;
    initialFilters?: PromotionFilters;
}

/**
 * Hook for managing promotion state and data fetching
 */
export function usePromotions({ pageSize = 10, initialFilters = {} }: UsePromotionsOptions = {}) {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<PromotionFilters>(initialFilters);
    const [pagination, setPagination] = useState({
        page_index: 1,
        page_size: pageSize,
        total_record: 0,
        total_page: 0
    });

    const fetchPromotions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await promotionService.getPromotions({
                page_index: pagination.page_index,
                page_size: pagination.page_size,
                search,
                filters
            });

            if (response.success) {
                setPromotions(response.data.items);
                setPagination(prev => ({
                    ...prev,
                    total_record: response.data.total_record,
                    total_page: response.data.total_page
                }));
            }
        } catch (error) {
            console.error('Failed to fetch promotions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page_index, pagination.page_size, search, filters]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handlePageChange = (index: number) => {
        setPagination(prev => ({ ...prev, page_index: index }));
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<PromotionFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    return {
        promotions,
        isLoading,
        pagination,
        filters,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        refresh: fetchPromotions
    };
}
