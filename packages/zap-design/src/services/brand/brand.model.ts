/**
 * Brand Model
 */

export interface Brand {
  id: string;
  serial_id?: number;
  name: string;
  slug?: string;
  logo_url?: string;
  banner_url?: string;
  website_url?: string;
  status_id: number | string;
  status_code?: string;
  status_name?: string | null;
  is_premium?: boolean;
  tenant_id?: string;
  reference_id?: string;
  apply_item_count?: number;
}

export interface BrandFilters {
  status_id?: number | string | null;
}

export interface BrandListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: BrandFilters;
}

export interface BrandListResponse {
  items: Brand[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}

export interface BrandResponse {
  success: boolean;
  data: BrandListResponse;
  message?: string;
}

export interface BrandDetailResponse {
  success: boolean;
  data: Brand;
  message?: string;
}
