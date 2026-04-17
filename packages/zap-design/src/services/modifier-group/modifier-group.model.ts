/**
 * Modifier Group Model
 */

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  description?: string;
  status: string;
  minSelect: number;
  maxSelect: number;
  options: ModifierOption[];
  display_type?: string;
  total_item?: number;
  locations?: string[];
  acronymn?: string;
  [key: string]: any;
}

export interface ModifierGroupFilters {
  status?: string[] | null;
}

export interface ModifierGroupListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: ModifierGroupFilters;
}

export interface ModifierGroupListResponse {
  items: ModifierGroup[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}

export interface ModifierGroupResponse {
  success: boolean;
  data: ModifierGroupListResponse;
  message?: string;
}

export interface ModifierGroupDetailResponse {
  success: boolean;
  data: ModifierGroup;
  message?: string;
}
