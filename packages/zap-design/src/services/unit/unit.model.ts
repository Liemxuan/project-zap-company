export interface Unit {
    id: string | number;
    tenant_id: string;
    code: string;
    name: string;
    symbol: string;
    abbreviation: string;
    precision: number;
    status_id: number;
    status_code?: string;
    status_name?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    acronymn?: string;
    serial_id?: string | number;
    translations?: any[];
}

export interface CreateUnitRequest {
    name: string;
    symbol: string;
    precision: number;
    translations: {
        locale_id: number;
        name: string;
    }[];
}

export interface UnitFilters {
    status?: string;
    search?: string;
}
