/**
 * Product Model
 */

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price: number;
  cate_name?: string;
  status: number | string;
  stock?: number;
  image?: string;
  location?: string;
  barcode?: string;
  productType?: string;
  product_type?: string;
  unit?: string;
  subRows?: Product[];
  acronymn?: string;
}

export interface ProductFilters {
  status?: number | string | null;
  cate_name?: string | null;
}

export interface ProductListRequest {
  page_index: number;
  page_size: number;
  search: string;
  filters: ProductFilters;
}

export interface ProductListResponse {
  items: Product[];
  total_record: number;
  total_page: number;
  page_index: number;
  page_size: number;
}

export interface ProductResponse {
  success: boolean;
  data: ProductListResponse;
  message?: string;
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
  message?: string;
}
