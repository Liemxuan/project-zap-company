export interface Unit {
    id: string;
    serial_id: string;
    name: string;
    short_name: string;
    precision: number;
    status: 'Active' | 'Inactive';
    created_at?: string;
    updated_at?: string;
  acronymn?: string;
}

export interface UnitFilters {
    status?: string;
    search?: string;
}
