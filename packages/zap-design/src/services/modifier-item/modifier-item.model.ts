/**
 * Modifier Item Data Model
 */

export interface ModifierItem {
    id: string;
    name: string;
    display_type: string; // "Radio" or "Checkbox" usually, but can be customized
    locations: string[];
    price: number;
    is_active: boolean;
    status?: string; // Optional metadata
  acronymn?: string;
}

export interface ModifierItemFilters {
    is_active?: boolean | null;
    display_type?: string;
    location_id?: string;
}

export interface ModifierItemListRequest {
    page_index: number;
    page_size: number;
    search: string;
    filters: ModifierItemFilters;
}

export interface ModifierItemListResponse {
    items: ModifierItem[];
    total_record: number;
    total_page: number;
}

export interface ModifierItemResponse {
    success: boolean;
    data: ModifierItemListResponse;
    message?: string;
}

export interface ModifierItemDetailResponse {
    success: boolean;
    data: ModifierItem;
    message?: string;
}
