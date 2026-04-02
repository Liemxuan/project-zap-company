/**
 * Merchant Service Demo
 * Example usage of httpService with Mock Data
 */

import { httpService } from '../../../core/api/http.service';
import { ApiResponse } from '../../../core/api/api.types';

export interface Merchant {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const MOCK_MERCHANTS_RESPONSE: ApiResponse<Merchant[]> = {
  success: true,
  message: 'Success fetch merchants',
  code: 200,
  data: [
    {
      id: 'm-001',
      name: 'Pendo Go',
      email: 'admin@pendogo.com',
      status: 'active',
    },
    {
      id: 'm-002',
      name: 'Zap Store',
      email: 'hello@zap.com',
      status: 'active',
    },
    {
      id: 'm-003',
      name: 'Eco Market',
      email: 'support@ecomarket.vn',
      status: 'inactive',
    },
  ],
};

/**
 * Fetch all merchants
 */
export async function fetchMerchants(): Promise<ApiResponse<Merchant[]>> {
  return httpService.get<Merchant[]>(
    '/v1/merchants',
    {}, // Query params
    MOCK_MERCHANTS_RESPONSE // Mock data fallback
  );
}
