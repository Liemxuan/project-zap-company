'use server';

import type { CategoryFilter, CategoryResponse } from '../models/category.model';

const API_BASE_URL = 'https://crm-gateway-v1-c7wqwyi1.uc.gateway.dev/api/categories';

/**
 * Server action: Fetch all categories with optional filtering and pagination
 */
export async function getCategoriesServer(
  filter?: CategoryFilter,
  page = 1,
  pageSize = 10
): Promise<CategoryResponse> {
  const requestPayload = {
    page_index: page,
    page_size: pageSize,
    search: filter?.search || '',
    filters: {},
  };

  console.log('[Category API] Server Request to /api/categories/list:', requestPayload);

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
      console.error('[Category API] Error response:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Category API] Server Response from /api/categories/list:', data);

    // API returns wrapped response, extract data
    if (data.success && data.data) {
      return {
        items: data.data.items,
        total: data.data.total,
      };
    }

    return data;
  } catch (error) {
    console.error('[Category API] Server Error fetching categories:', error);
    throw error;
  }
}
