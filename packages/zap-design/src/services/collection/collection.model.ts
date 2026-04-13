/**
 * Collection Model
 * Canonical data structure for Collection module
 */

export interface Collection {
  id: string;
  name: string;
  is_active: boolean;
  media_url?: string;
  slug?: string;
  parent?: string;
  parent_id?: string | null;
  item_count?: number;
  status?: string;
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
