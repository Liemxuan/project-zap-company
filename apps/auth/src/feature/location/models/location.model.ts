/**
 * Location Model
 * Types and interfaces for Location feature
 */

export type LocationStatusId = 100 | 104 | 109 | 125 | 131 | 138 | 143 | 146 | 75 | 64;

export interface OperatingHours {
  mon?: { open: string; close: string; is_closed: boolean };
  tue?: { open: string; close: string; is_closed: boolean };
  wed?: { open: string; close: string; is_closed: boolean };
  thu?: { open: string; close: string; is_closed: boolean };
  fri?: { open: string; close: string; is_closed: boolean };
  sat?: { open: string; close: string; is_closed: boolean };
  sun?: { open: string; close: string; is_closed: boolean };
}

export interface Location {
  id: string;
  tenant_id: string | null;
  node_id: string | null;
  serial_id?: number;
  serial_number?: string;
  location_code?: string;
  legacy_id: string;
  name: string;
  status_id: number;
  status_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug?: string | null;
  business_name?: string | null;
  description?: string | null;
  location_type_id?: number | null;
  location_type_text?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  state?: string | null;
  country_id?: number | null;
  province_id?: number | null;
  district_id?: number | null;
  ward_id?: number | null;
  postal_code?: string | null;
  zipcode?: string | null;
  phone_number?: string | null;
  email?: string | null;
  website?: string | null;
  x_link?: string | null;
  twitter?: string | null;
  instagram_link?: string | null;
  instagram?: string | null;
  facebook_link?: string | null;
  facebook?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  brand_color?: string | null;
  timezone?: string | null;
  operating_hours?: OperatingHours | string | null;
  transfer_account?: string | null;
  transfer_tag?: string | null;
  parent_location_id?: string | null;
  preferred_language?: string | null;
  match_location_id?: string | null;
}

export interface LocationFilter {
  search?: {
    value?: string;
    column?: string;
  } | string;
  filters?: {
    is_active?: boolean[];
    warehouse_type?: string[];
    status_id?: number[] | number | null;
    province_id?: number[] | number | null;
    location_type_id?: string[] | number[] | number | null;
  };
  sort?: {
    field: string;
    descending: boolean;
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
