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
    serial_id: number;
    serial_number: string | null;
    iso_alpha2: string;
    iso_alpha3: string;
    numeric_code: number;
    latitude: number | null;
    longitude: number | null;
    geometry_data: any | null; // Có thể thay any bằng interface cụ thể nếu có cấu trúc GeoJSON
    flag_emoji: string;
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
