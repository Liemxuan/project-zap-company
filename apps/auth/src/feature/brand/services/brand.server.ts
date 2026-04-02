'use server';

import type { BrandFilter, BrandResponse } from '../models/brand.model';

const API_BASE_URL = 'https://crm-gateway-v1-c7wqwyi1.uc.gateway.dev/api/brands';

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

  console.log('[Brand API] Server Request to /api/brands/list:', requestPayload);

  try {
    const response = await fetch(`${API_BASE_URL}/list`, {
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
    console.log('[Brand API] Server Response from /api/brands/list:', data);

    // API returns wrapped response, extract data
    if (data.success && data.data) {
      return {
        items: data.data.items,
        total: data.data.total,
      };
    }

    return data;
  } catch (error) {
    console.error('[Brand API] Server Error fetching brands:', error);
    throw error;
  }
}
