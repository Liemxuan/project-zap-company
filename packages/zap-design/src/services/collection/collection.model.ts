/**
 * Collection Model
 * Canonical data structure for Collection module
 */

export interface Collection {
  id: string;
  serial_id: number;
  name: string;
  image_url: string | null;
  product_count: number;
  status_id: number;
  status_code: string | null;
  status_name: string | null;
  is_active?: boolean;
  slug?: string;
  parent_id?: string | null;
  locations?: string[];
}

export interface CollectionFilters {
  is_active?: boolean | null;
}

export interface CollectionListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: CollectionFilters;
}

export interface CollectionListResponse {
  items: Collection[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}

export interface CollectionResponse {
  success: boolean;
  data: CollectionListResponse;
  message?: string;
}

export interface CollectionDetailResponse {
  success: boolean;
  data: Collection;
  message?: string;
}
