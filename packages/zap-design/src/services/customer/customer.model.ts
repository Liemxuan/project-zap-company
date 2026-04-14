/**
 * Customer Data Model
 */

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email: string;
    money: number; // Balance
    point: number;
    membership: string; // E.g., Gold, Silver, Bronze
    total_spend: number;
    is_active: boolean;
    status?: string; // Optional metadata
  acronymn?: string;
}

export interface CustomerFilters {
    is_active?: boolean | null;
    membership?: string;
}

export interface CustomerListRequest {
    page_index: number;
    page_size: number;
    search: string;
    filters: CustomerFilters;
}

export interface CustomerListResponse {
    items: Customer[];
    total_record: number;
    total_page: number;
}

export interface CustomerResponse {
    success: boolean;
    data: CustomerListResponse;
    message?: string;
}

export interface CustomerDetailResponse {
    success: boolean;
    data: Customer;
    message?: string;
}
