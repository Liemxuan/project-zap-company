/**
 * Category Model
 * Types and interfaces for Category feature
 */

export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  is_active: boolean;
  icon_url?: string;
  materialized_path?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  channels?: string[] | null;
  item_count: number;
  children?: Category[];
}

export interface CategoryFilter {
  search?: string;
}

export interface CategoryResponse {
  items: Category[];
  total: number;
}
