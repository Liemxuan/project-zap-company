import { Service, ServiceResponse, ServiceFilters } from './service.model';
import { MOCK_SERVICES } from '@/hooks/mock-data';
import { apiService } from '../common/api.service';
import { API_ENDPOINTS } from '@/const/api';

export interface ServiceDetailResponse {
    success: boolean;
    data: Service;
}

const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

export const serviceService = {
    async getServices(params: {
        page_index: number;
        page_size: number;
        search?: string;
        filters?: ServiceFilters;
    }): Promise<ServiceResponse> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            let filtered = [...MOCK_SERVICES];

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

            if (params.filters?.category) {
                filtered = filtered.filter(t => t.category === params.filters?.category);
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

        return apiService.post<ServiceResponse>(API_ENDPOINTS.SERVICE.LIST, params);
    },

    async getServiceDetail(id: string): Promise<ServiceDetailResponse> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const service = MOCK_SERVICES.find(t => t.id === id);
            if (!service) throw new Error('Service not found');
            return {
                success: true,
                data: service
            };
        }

        return apiService.get<ServiceDetailResponse>(`${API_ENDPOINTS.SERVICE.DETAIL}/${id}`);
    },

    async createService(data: any): Promise<{ success: boolean; data?: any }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data: { ...data, id: `ser-${Math.floor(Math.random() * 1000)}` } };
        }
        return apiService.post(API_ENDPOINTS.SERVICE.DETAIL, data);
    },

    async updateService(id: string, data: any): Promise<{ success: boolean; data?: any }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data: { ...data, id } };
        }
        return apiService.put(`${API_ENDPOINTS.SERVICE.DETAIL}/${id}`, data);
    },

    async deleteService(id: string): Promise<{ success: boolean }> {
        if (isMock) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true };
        }
        return apiService.delete(`${API_ENDPOINTS.SERVICE.DETAIL}/${id}`);
    }
};
