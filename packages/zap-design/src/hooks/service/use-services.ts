import { useState, useEffect, useCallback } from 'react';
import { serviceService } from '@/services/service/service.service';
import { Service, ServiceFilters } from '@/services/service/service.model';

export interface UseServicesOptions {
    pageSize?: number;
    initialPage?: number;
}

export function useServices(options: UseServicesOptions = {}) {
    const { pageSize = 10, initialPage = 1 } = options;
    
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total_record: 0,
        total_page: 0,
        page_index: initialPage,
        page_size: pageSize,
    });
    const [filters, setFilters] = useState<ServiceFilters>({});
    const [search, setSearch] = useState('');

    // Sync initialPage from props to state
    useEffect(() => {
        if (initialPage !== pagination.page_index) {
            setPagination(prev => ({ ...prev, page_index: initialPage }));
        }
    }, [initialPage]);

    const fetchServices = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await serviceService.getServices({
                page_index: pagination.page_index,
                page_size: pagination.page_size,
                search,
                filters
            });
            if (res.success) {
                setServices(res.data);
                setPagination(res.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page_index, pagination.page_size, search, filters]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handlePageChange = (index: number) => {
        setPagination(prev => ({ ...prev, page_index: index }));
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<ServiceFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    return {
        services,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters,
        refresh: fetchServices
    };
}
