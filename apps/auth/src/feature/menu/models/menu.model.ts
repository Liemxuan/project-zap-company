export interface Menu {
  id: string;
  name: string;
  locations: string[];
  channels: string[];
  total_item: number;
  is_active: boolean;
  materialized_path?: string;
  updated_at?: string;
}

export interface MenuFilter {
  searchQuery?: string;
  status?: 'active' | 'inactive';
  locationId?: string;
}

export interface MenuResponse {
  items: Menu[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}
