/**
 * Menu Model
 * Canonical data structure for Menu module
 */

export interface Menu {
  id: string;
  name: string;
  is_active: boolean;
  locations?: string[]; // Multiple locations
  channels?: string[]; // Multiple channels
  total_items?: number;
  status?: string;
}

export interface MenuFilters {
  is_active?: boolean | null;
  location_id?: string;
  channel_id?: string;
}

export interface MenuListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: MenuFilters;
}

export interface MenuListResponse {
  items: Menu[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}

export interface MenuResponse {
  success: boolean;
  data: MenuListResponse;
  message?: string;
}

export interface MenuDetailResponse {
  success: boolean;
  data: Menu;
  message?: string;
}
