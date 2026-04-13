/**
 * Membership Tier model definition
 */
export interface Membership {
    id: string;
    tier: string;        // Tên gói/hạng
    tier_price: number;  // Giá gói
    billing_cycle: string; // Chu kỳ (Monthly, Yearly, etc.)
    benefit: string;     // Hệ số ưu đãi / Quyền lợi
    is_active: boolean;  // Trạng thái
    created_at?: string;
    updated_at?: string;
}

export interface MembershipFilters {
    is_active?: boolean | null;
    billing_cycle?: string;
}

export interface MembershipListRequest {
    page_index: number;
    page_size: number;
    search: string;
    filters: MembershipFilters;
}

export interface MembershipResponse {
    success: boolean;
    data: Membership[];
    message?: string;
}

export interface MembershipDetailResponse {
    success: boolean;
    data: Membership;
    message?: string;
}
