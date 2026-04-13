/**
 * Unit Model
 */

export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  description?: string;
  status: string;
}

export interface UnitFilters {
  status?: string | null;
}

export interface UnitListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: UnitFilters;
}

export interface UnitListResponse {
  items: Unit[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}

export interface UnitResponse {
  success: boolean;
  data: UnitListResponse;
  message?: string;
}

export interface UnitDetailResponse {
  success: boolean;
  data: Unit;
  message?: string;
}
