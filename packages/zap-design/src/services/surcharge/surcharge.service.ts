import { Surcharge, SurchargeResponse, SurchargeFilters } from './surcharge.model';
import { MOCK_SURCHARGES } from '@/hooks/mock-data';
import { apiService } from '../common/api.service';
import { API_ENDPOINTS } from '@/const/api';

export interface SurchargeDetailResponse {
    success: boolean;
    data: Surcharge;
}

const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

export const surchargeService = {
    async getSurcharges(params: {
        page_index: number;
        page_size: number;
        search?: string;
        filters?: SurchargeFilters;
    }): Promise<SurchargeResponse> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            let filtered = [...MOCK_SURCHARGES];

            if (params.search) {
                const searchLower = params.search.toLowerCase();
                filtered = filtered.filter(t =>
                    t.name.toLowerCase().includes(searchLower) ||
                    t.id.toLowerCase().includes(searchLower) ||
                    t.serial_id.toLowerCase().includes(searchLower)
                );
            }

            if (params.filters?.status_id) {
                filtered = filtered.filter(t => t.status_id === params.filters?.status_id);
            }

            if (params.filters?.type) {
                filtered = filtered.filter(t => t.type === params.filters?.type);
            }

            const total_record = filtered.length;
            const total_page = Math.ceil(total_record / params.page_size);
            const start = (params.page_index - 1) * params.page_size;
            const data = filtered.slice(start, start + params.page_size);

            return {
                success: true,
                data,
                pagination: {
                    total_record,
                    total_page,
                    page_index: params.page_index,
                    page_size: params.page_size
                }
            };
        }

        return apiService.post<SurchargeResponse>(API_ENDPOINTS.SURCHARGE.LIST, params);
    },

    async getSurchargeDetail(id: string): Promise<SurchargeDetailResponse> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const surcharge = MOCK_SURCHARGES.find(t => t.id === id);
            if (!surcharge) throw new Error('Surcharge not found');
            return {
                success: true,
                data: surcharge
            };
        }

        return apiService.get<SurchargeDetailResponse>(`${API_ENDPOINTS.SURCHARGE.DETAIL}/${id}`);
    },

    async createSurcharge(data: any): Promise<{ success: boolean; data?: any }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data: { ...data, id: `sur-${Math.floor(Math.random() * 1000)}` } };
        }
        return apiService.post(API_ENDPOINTS.SURCHARGE.DETAIL, data);
    },

    async updateSurcharge(id: string, data: any): Promise<{ success: boolean; data?: any }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data: { ...data, id } };
        }
        return apiService.put(`${API_ENDPOINTS.SURCHARGE.DETAIL}/${id}`, data);
    },

    async deleteSurcharge(id: string): Promise<{ success: boolean }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true };
        }
        return apiService.delete(`${API_ENDPOINTS.SURCHARGE.DETAIL}/${id}`);
    }
};
