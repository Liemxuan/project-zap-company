export type ProductStatus = number; // API returns numeric status

export interface Product {
  id: string;
  name: string;
  cate_name: string;
  price: number;
  status: ProductStatus;
  description?: string;
  sku: string;
  stock?: number;
  image?: string;
  location?: string;
  barcode?: string;
  productType?: string;
  unit?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductResponse {
  total_page: number;
  total_record: number;
  page_index: number;
  page_size: number;
  items: Product[];
}
