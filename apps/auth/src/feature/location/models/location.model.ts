/**
 * Location Model
 * Types and interfaces for Location feature
 */

export type LocationStatusId = 100 | 104 | 109 | 125 | 131 | 138 | 143 | 146 | 75 | 64;

export interface Location {
  id: string;
  tenant_id: string;
  legacy_id: string;
  name: string;
  warehouse_type: string;
  is_active: boolean;
  status_id: number;
  address_json: string;
  manager_id: string;
  phone_number?: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

export interface LocationFilter {
  search?: string;
  filters?: {
    is_active?: boolean[];
    warehouse_type?: string[];
  };
}

export interface LocationResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    total_page: number;
    total_record: number;
    page_index: number;
    page_size: number;
    items: Location[];
  };
}
