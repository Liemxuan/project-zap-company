import { useState, useEffect, useCallback } from 'react';
import { Country, CountryFilters } from '@/services/country/country.model';
import { countryService } from '@/services/country/country.service';

interface UseCountriesOptions {
    pageSize?: number;
    initialFilters?: CountryFilters;
}

/**
 * Hook for managing country state and data fetching
 */
export function useCountries({ pageSize = 10, initialFilters = {} }: UseCountriesOptions = {}) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<CountryFilters>(initialFilters);
    const [pagination, setPagination] = useState({
        page_index: 1,
        page_size: pageSize,
        total_record: 0,
        total_page: 0
    });

    const fetchCountries = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await countryService.getCountries({
                page_index: pagination.page_index,
                page_size: pagination.page_size,
                search,
                filters
            });

            if (response.success) {
                setCountries(response.data.items);
                setPagination(prev => ({
                    ...prev,
                    total_record: response.data.total_record,
                    total_page: response.data.total_page
                }));
            }
        } catch (error) {
            console.error('Failed to fetch countries:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page_index, pagination.page_size, search, filters]);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    const handlePageChange = (index: number) => {
        setPagination(prev => ({ ...prev, page_index: index }));
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    const handleFilterChange = (newFilters: Partial<CountryFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page_index: 1 }));
    };

    return {
        countries,
        isLoading,
        pagination,
        filters,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        refresh: fetchCountries
    };
}
