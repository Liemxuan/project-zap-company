import { useState, useEffect, useCallback } from 'react';
import { 
    Country, 
    CountryFilters, 
    CountryListRequest,
    RequestOptions 
} from '@/services';
import { countryService } from '@/services/country/country.service';
import { MOCK_COUNTRIES } from '../mock-data';

interface UseCountriesOptions extends RequestOptions {
    pageSize?: number;
    initialFilters?: CountryFilters;
    ismock?: boolean;
}

/**
 * Hook for managing country state and data fetching
 */
export function useCountries(options: UseCountriesOptions = {}) {
    const { 
        pageSize = 10, 
        initialFilters = {}, 
        ismock = process.env.NEXT_PUBLIC_IS_MOCK === 'true',
        token,
        lang = 'en'
    } = options;

    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
        setError(null);

        const currentParams: CountryListRequest = {
            page_index: pagination.page_index,
            page_size: pagination.page_size,
            search,
            filters
        };

        if (ismock) {
            // --- Logic Mock ---
            await new Promise(resolve => setTimeout(resolve, 500));
            let filtered = [...MOCK_COUNTRIES];

            // Apply search
            if (search) {
                const s = search.toLowerCase();
                filtered = filtered.filter(item => 
                    item.name.toLowerCase().includes(s) || 
                    item.code.toLowerCase().includes(s)
                );
            }

            // Apply filters
            if (filters.is_active !== undefined && filters.is_active !== null) {
                filtered = filtered.filter(item => item.is_active === filters.is_active);
            }

            const totalRecord = filtered.length;
            const totalPage = Math.ceil(totalRecord / pagination.page_size);
            const start = (pagination.page_index - 1) * pagination.page_size;
            const items = filtered.slice(start, start + pagination.page_size);

            setCountries(items);
            setPagination(prev => ({
                ...prev,
                total_record: totalRecord,
                total_page: totalPage
            }));
            setIsLoading(false);
            return;
        }

        // --- Logic API ---
        try {
            const response = await countryService.getCountriesList(currentParams, { token, lang });

            if (response.success) {
                setCountries(response.data.items);
                setPagination(prev => ({
                    ...prev,
                    total_record: response.data.total_record,
                    total_page: response.data.total_page
                }));
            } else {
                setError(response.message || 'Failed to fetch countries');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            console.error('[useCountries] Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page_index, pagination.page_size, search, filters, ismock, token, lang]);

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
        error,
        pagination,
        filters,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        refresh: fetchCountries
    };
}
