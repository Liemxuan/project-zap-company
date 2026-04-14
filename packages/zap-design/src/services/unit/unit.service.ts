import { Unit, UnitFilters } from './unit.model';
import { MOCK_UNITS } from '@/hooks/mock-data';

export interface UnitResponse {
    success: boolean;
    data: {
        items: Unit[];
        total_record: number;
        total_page: number;
    };
}

export const unitService = {
    async getUnits(params: {
        page_index: number;
        page_size: number;
        search?: string;
        filters?: UnitFilters;
    }): Promise<UnitResponse> {
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let filtered = [...MOCK_UNITS];

        if (params.search) {
            const searchLower = params.search.toLowerCase();
            filtered = filtered.filter(u => 
                u.name.toLowerCase().includes(searchLower) || 
                u.serial_id.toLowerCase().includes(searchLower) ||
                u.short_name.toLowerCase().includes(searchLower)
            );
        }

        if (params.filters?.status) {
            filtered = filtered.filter(u => u.status === params.filters?.status);
        }

        const total_record = filtered.length;
        const total_page = Math.ceil(total_record / params.page_size);
        const start = (params.page_index - 1) * params.page_size;
        const items = filtered.slice(start, start + params.page_size);

        return {
            success: true,
            data: {
                items,
                total_record,
                total_page
            }
        };
    }
};
