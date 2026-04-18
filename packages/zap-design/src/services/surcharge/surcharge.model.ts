export interface Surcharge {
    id: string;
    serial_id: string;
    acronym?: string;
    name: string;
    value: number;
    value_type: 'percentage' | 'fixed';
    type: string;
    status_id: string;
    status_text: string;
    status_color: string;
}

export interface SurchargeFilters {
    status_id?: string;
    type?: string;
    [key: string]: any;
}

export interface SurchargeResponse {
    success: boolean;
    data: Surcharge[];
    pagination: {
        total_record: number;
        total_page: number;
        page_index: number;
        page_size: number;
    };
}
