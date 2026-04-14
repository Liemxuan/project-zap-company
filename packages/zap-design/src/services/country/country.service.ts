import { MOCK_COUNTRIES } from '@/hooks/mock-data';
import { Country, CountryListRequest, CountryResponse, CountryDetailResponse } from './country.model';

/**
 * Country Service - Mock Implementation
 */
export const countryService = {
    /**
     * Get list of countries
     */
    getCountries: async (request: CountryListRequest): Promise<{ success: boolean; data: { items: Country[]; total_record: number; total_page: number } }> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let filtered = [...MOCK_COUNTRIES];

        // Apply search
        if (request.search) {
            const search = request.search.toLowerCase();
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(search) || 
                item.code.toLowerCase().includes(search)
            );
        }

        // Apply filters
        if (request.filters.is_active !== undefined && request.filters.is_active !== null) {
            filtered = filtered.filter(item => item.is_active === request.filters.is_active);
        }

        const total_record = filtered.length;
        const total_page = Math.ceil(total_record / request.page_size);
        const start = (request.page_index - 1) * request.page_size;
        const items = filtered.slice(start, start + request.page_size);

        return {
            success: true,
            data: {
                items,
                total_record,
                total_page
            }
        };
    },

    /**
     * Get country by ID
     */
    getCountryById: async (id: string): Promise<CountryDetailResponse> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const item = MOCK_COUNTRIES.find(c => c.id === id);
        
        if (!item) {
            return { success: false, data: {} as Country, message: 'Country not found' };
        }

        return { success: true, data: item };
    }
};
