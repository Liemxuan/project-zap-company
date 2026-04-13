/**
 * Category Model
 * Canonical data structure for Category module
 */

export interface Category {
  id: string;
  name: string;
  is_active: boolean;
  media_url?: string;
  slug?: string;
  parent?: string;
  parent_id?: string | null;
  item_count?: number;
  status?: string;
}

export interface CategoryFilters {
  is_active?: boolean | null;
  parent_id?: string | null;
}

export interface CategoryListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: CategoryFilters;
}

export interface CategoryListResponse {
  items: Category[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}

export interface CategoryResponse {
  success: boolean;
  data: CategoryListResponse;
  message?: string;
}

export interface CategoryDetailResponse {
  success: boolean;
  data: Category;
  message?: string;
}
