'use server';

import type { CategoryFilter, CategoryResponse } from '../models/category.model';
import { API_BASE_URL, API_ENDPOINTS } from '@/const';

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

  console.log(`[Category API] Server Request to ${API_ENDPOINTS.CATEGORY_LIST}:`, requestPayload);

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORY_LIST}`, {
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
    console.log(`[Category API] Server Response from ${API_ENDPOINTS.CATEGORY_LIST}:`, data);

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
    } as CategoryResponse;
  } catch (error) {
    console.error('[Category API] Server Error fetching categories:', error);
    throw error;
  }
}
