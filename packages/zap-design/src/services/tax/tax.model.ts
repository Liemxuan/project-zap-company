export interface Tax {
    id: string;
    serial_id: string;
    acronym?: string;
    name: string;
    location: string;
    rate: number;
    status_id: string;
    status_text: string;
    status_color: string;
}

export interface TaxFilters {
    status_id?: string;
    location?: string;
    [key: string]: any;
}

export interface TaxResponse {
    success: boolean;
    data: Tax[];
    pagination: {
        total_record: number;
        total_page: number;
        page_index: number;
        page_size: number;
    };
}
