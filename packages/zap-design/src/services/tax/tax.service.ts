import { Tax, TaxResponse, TaxFilters } from './tax.model';
import { MOCK_TAXES } from '@/hooks/mock-data';
import { apiService } from '../common/api.service';
import { API_ENDPOINTS } from '@/const/api';

export interface TaxDetailResponse {
    success: boolean;
    data: Tax;
}

const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

export const taxService = {
    async getTaxes(params: {
        page_index: number;
        page_size: number;
        search?: string;
        filters?: TaxFilters;
    }): Promise<TaxResponse> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            let filtered = [...MOCK_TAXES];

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

            if (params.filters?.location) {
                filtered = filtered.filter(t => t.location === params.filters?.location);
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

        return apiService.post<TaxResponse>(API_ENDPOINTS.TAX.LIST, params);
    },

    async getTaxDetail(id: string): Promise<TaxDetailResponse> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const tax = MOCK_TAXES.find(t => t.id === id);
            if (!tax) throw new Error('Tax not found');
            return {
                success: true,
                data: tax
            };
        }

        return apiService.get<TaxDetailResponse>(`${API_ENDPOINTS.TAX.DETAIL}/${id}`);
    },

    async createTax(data: any): Promise<{ success: boolean; data?: any }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data: { ...data, id: `tax-${Math.floor(Math.random() * 1000)}` } };
        }
        return apiService.post(API_ENDPOINTS.TAX.DETAIL, data);
    },

    async updateTax(id: string, data: any): Promise<{ success: boolean; data?: any }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data: { ...data, id } };
        }
        return apiService.put(`${API_ENDPOINTS.TAX.DETAIL}/${id}`, data);
    },

    async deleteTax(id: string): Promise<{ success: boolean }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true };
        }
        return apiService.delete(`${API_ENDPOINTS.TAX.DETAIL}/${id}`);
    }
};
