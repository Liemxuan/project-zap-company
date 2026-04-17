/**
 * Promotion Data Model
 */

export interface Promotion {
    id: string;
    name: string;
    discount_value: number;
    discount_type: 'Fixed' | 'Percentage';
    apply_to: string; // E.g., All products, Specific items
    schedule: string; // E.g., Daytime, Evening, etc.
    locations: string[]; // E.g., ["All branches"], ["HQ-01"]
    is_active: boolean;
    is_automatic: boolean;
    status?: string; // Metadata status string
  acronymn?: string;
}

export interface PromotionFilters {
    is_active?: boolean | null;
    discount_type?: string;
    is_automatic?: boolean | null;
    schedule?: string;
}

export interface PromotionListRequest {
    page_index: number;
    page_size: number;
    search: string;
    filters: PromotionFilters;
}

export interface PromotionListResponse {
    items: Promotion[];
    total_record: number;
    total_page: number;
}

export interface PromotionResponse {
    success: boolean;
    data: PromotionListResponse;
    message?: string;
}

export interface PromotionDetailResponse {
    success: boolean;
    data: Promotion;
    message?: string;
}
