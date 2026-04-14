/**
 * Dining Option Model
 */

export interface DiningOption {
  id: string;
  name: string;
  description?: string;
  type: string;
  availableHours?: string;
  minOrderValue?: number;
  maxCapacity?: number;
  status: string;
  image?: string;
  acronymn?: string;
}

export interface DiningOptionFilters {
  status?: string | null;
  type?: string | null;
}

export interface DiningOptionListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: DiningOptionFilters;
}

export interface DiningOptionListResponse {
  items: DiningOption[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}

export interface DiningOptionResponse {
  success: boolean;
  data: DiningOptionListResponse;
  message?: string;
}

export interface DiningOptionDetailResponse {
  success: boolean;
  data: DiningOption;
  message?: string;
}
