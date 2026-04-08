import { Brand, BrandFilter, BrandResponse } from '../models/brand.model';
import { getMockBrands } from '@/mocks/brand.mock';
import { httpService } from '@/core/api/http.service';
import { API_ENDPOINTS } from '@/const';

/**
 * Fetch all brands with optional filtering
 */
export async function getBrands(filter?: BrandFilter, page = 1, pageSize = 10): Promise<BrandResponse> {
  const mockResult = await getMockBrands(filter, page, pageSize);
  
  const response = await httpService.post<BrandResponse>(
    API_ENDPOINTS.BRAND_LIST,
    { filter, page, pageSize },
    { success: true, message: 'Success', code: 200, data: mockResult }
  );
  
  return response.data;
}

/**
 * Fetch single brand by ID
 */
export async function getBrandById(id: string): Promise<Brand | null> {
  const url = API_ENDPOINTS.BRAND_LIST.replace('list', id);
  
  const response = await httpService.get<Brand>(
    url,
    undefined,
    { success: true, code: 200, message: 'OK', data: null as any }
  );
  return response.data;
}
