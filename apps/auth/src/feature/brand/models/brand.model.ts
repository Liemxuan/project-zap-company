/**
 * Brand Model
 * Types and interfaces for Brand feature
 */

export type BrandStatus = number;

export interface Brand {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  website_url?: string;
  status_id: BrandStatus;
  is_premium: boolean;
}

export interface BrandFilter {
  search?: string;
}

export interface BrandResponse {
  total_page: number;
  total_record: number;
  page_index: number;
  page_size: number;
  items: Brand[];
}
