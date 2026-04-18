export interface Service {
    id: string;
    serial_id: string;
    acronym?: string;
    name: string;
    price: number;
    category: string;
    status_id: string;
    status_text: string;
    status_color: string;
}

export interface ServiceFilters {
    status_id?: string;
    category?: string;
    [key: string]: any;
}

export interface ServiceResponse {
    success: boolean;
    data: Service[];
    pagination: {
        total_record: number;
        total_page: number;
        page_index: number;
        page_size: number;
    };
}
