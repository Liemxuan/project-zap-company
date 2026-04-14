/**
 * Group Product Model
 * Canonical data structure for Group Product module
 */

export interface GroupProduct {
  id: string;
  name: string;
  is_active: boolean;
  media_url?: string;
  slug?: string;
  parent?: string;
  parent_id?: string | null;
  item_count?: number;
  status?: string;
  acronymn?: string;
}

export interface GroupProductFilters {
  is_active?: boolean | null;
  parent_id?: string | null;
}

export interface GroupProductListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: GroupProductFilters;
}

export interface GroupProductListResponse {
  items: GroupProduct[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}

export interface GroupProductResponse {
  success: boolean;
  data: GroupProductListResponse;
  message?: string;
}

export interface GroupProductDetailResponse {
  success: boolean;
  data: GroupProduct;
  message?: string;
}
