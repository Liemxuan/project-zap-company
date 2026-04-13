/**
 * Location Model Definitions
 * Standalone types for the Location API Service
 */

export interface DayOperatingHours {
  open: string;
  close: string;
  is_closed: boolean;
}

export interface OperatingHours {
  mon?: DayOperatingHours;
  tue?: DayOperatingHours;
  wed?: DayOperatingHours;
  thu?: DayOperatingHours;
  fri?: DayOperatingHours;
  sat?: DayOperatingHours;
  sun?: DayOperatingHours;
}

export interface Location {
  id: string;
  tenant_id: string;
  serial_id: number;
  serial_number: string;
  location_code: string;
  node_id: string | null;
  legacy_id: string;
  name: string;
  status_id: number;
  status_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug: string | null;
  business_name: string | null;
  description: string | null;
  location_type_id: number;
  location_type_text: string;
  location_type_code: string;
  location_type_color_code: string;
  address_line_1: string | null;
  province_id: number;
  province_name: string | null;
  district_id: number;
  district_name: string | null;
  ward_id: number;
  ward_name: string | null;
  city: string | null;
  state: string | null;
  country_id: number;
  zipcode: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  brand_color: string | null;
  timezone: string | null;
  operating_hours: OperatingHours | null;
  transfer_account: string | null;
  transfer_tag: string | null;
  parent_location_id: string | null;
}

export interface LocationFilters {
  status_id: number[] | number | null;
  province_id: number[] | number | null;
  location_type_id: number[] | number | null;
}

export interface LocationListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: LocationFilters;
}

export interface LocationResponseData {
  total_page: number;
  total_record: number;
  page_index: number;
  page_size: number;
  items: Location[];
}

export interface LocationResponse {
  success: boolean;
  code: number;
  message: string;
  data: LocationResponseData;
}

export interface LocationDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: Location;
}
