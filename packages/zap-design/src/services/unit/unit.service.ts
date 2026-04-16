import { Unit, UnitFilters } from './unit.model';
import { MOCK_UNITS } from '@/hooks/mock-data';
import { apiService } from '../common/api.service';
import { API_ENDPOINTS } from '@/const/api';

export interface UnitResponse {
    success: boolean;
    data: {
        items: Unit[];
        total_record: number;
        total_page: number;
    };
}

export interface UnitDetailResponse {
    success: boolean;
    data: Unit;
}

const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

export const unitService = {
    async getUnits(params: {
        page_index: number;
        p?: number;
        page_size: number;
        search?: string;
        filters?: UnitFilters;
        sort?: {
            field: string;
            descending: boolean;
        };
    }): Promise<UnitResponse> {
        if (isMock) {
            // Mock logic
            await new Promise(resolve => setTimeout(resolve, 500));
            let filtered = [...MOCK_UNITS];

            if (params.search) {
                const searchLower = params.search.toLowerCase();
                filtered = filtered.filter(u =>
                    u.name.toLowerCase().includes(searchLower) ||
                    u.id.toString().includes(searchLower) ||
                    u.symbol.toLowerCase().includes(searchLower)
                );
            }

            if (params.filters?.status) {
                filtered = filtered.filter(u => u.status_code === params.filters?.status);
            }

            // Sorting logic
            const sort = params.sort || { field: 'id', descending: true };
            filtered.sort((a: any, b: any) => {
                const fieldA = a[sort.field];
                const fieldB = b[sort.field];
                
                if (fieldA < fieldB) return sort.descending ? 1 : -1;
                if (fieldA > fieldB) return sort.descending ? -1 : 1;
                return 0;
            });

            const total_record = filtered.length;
            const total_page = Math.ceil(total_record / params.page_size);
            const start = (params.page_index - 1) * params.page_size;
            const items = filtered.slice(start, start + params.page_size);

            return {
                success: true,
                data: { items, total_record, total_page }
            };
        }

        // Real API logic
        return apiService.post<UnitResponse>(API_ENDPOINTS.UNIT.LIST, params);
    },

    async getUnitDetail(id: string | number): Promise<UnitDetailResponse> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const unit = MOCK_UNITS.find(u => u.id === id || u.id === Number(id));
            if (!unit) throw new Error('Unit not found');
            return {
                success: true,
                data: unit
            };
        }

        // Real API logic
        return apiService.get<UnitDetailResponse>(`${API_ENDPOINTS.UNIT.DETAIL}/${id}`);
    },

    async createUnit(data: any): Promise<{ success: boolean; data?: any }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data: { ...data, id: Math.floor(Math.random() * 1000) } };
        }
        return apiService.post(API_ENDPOINTS.UNIT.DETAIL, data);
    },

    async updateUnit(id: string | number, data: any): Promise<{ success: boolean; data?: any }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data: { ...data, id } };
        }
        return apiService.put(`${API_ENDPOINTS.UNIT.DETAIL}/${id}`, data);
    }
};
