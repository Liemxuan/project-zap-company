/**
 * Country model definition
 */
export interface Country {
    id: string;
    name: string;        // Tên quốc gia
    code: string;        // Mã quốc gia (VN, US, etc.)
    flag_url?: string;   // Icon lá cờ
    phone_code?: string; // Mã điện thoại (+84, +1, etc.)
    currency?: string;   // Tiền tệ (VND, USD, etc.)
    is_active: boolean;  // Trạng thái
    created_at?: string;
    updated_at?: string;
  acronymn?: string;
}

export interface CountryFilters {
    is_active?: boolean | null;
}

export interface CountryListRequest {
    page_index: number;
    page_size: number;
    search: string;
    filters: CountryFilters;
}

export interface CountryResponse {
    success: boolean;
    data: Country[];
    message?: string;
}

export interface CountryDetailResponse {
    success: boolean;
    data: Country;
    message?: string;
}
