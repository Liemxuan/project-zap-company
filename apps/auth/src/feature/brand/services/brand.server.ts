'use server';

import type { BrandFilter, BrandResponse } from '../models/brand.model';
import { API_BASE_URL, API_ENDPOINTS } from '@/const';

/**
 * Server action: Fetch all brands with optional filtering and pagination
 */
export async function getBrandsServer(
  filter?: BrandFilter,
  page = 1,
  pageSize = 10
): Promise<BrandResponse> {
  const requestPayload = {
    page_index: page,
    page_size: pageSize,
    search: filter?.search || '',
    filters: {},
  };

  console.log(`[Brand API] Server Request to ${API_ENDPOINTS.BRAND_LIST}:`, requestPayload);

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BRAND_LIST}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Brand API] Error response:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Brand API] Server Response from ${API_ENDPOINTS.BRAND_LIST}:`, data);

    // API returns wrapped response, extract data
    if (data.success && data.data) {
      return data.data;
    }

    return { 
      items: [], 
      total_page: 0, 
      total_record: 0, 
      page_index: page, 
      page_size: pageSize 
    } as BrandResponse;
  } catch (error) {
    console.error('[Brand API] Server Error fetching brands:', error);
    throw error;
  }
}
