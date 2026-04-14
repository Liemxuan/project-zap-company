export interface Policy {
    id: string;
    name: string;
    type: 'Standard' | 'Legal' | 'Operational';
    applied_to: 'Customer' | 'Merchant' | 'Internal';
    content: string;
    status: 'Active' | 'Draft';
    updated_at: string;
  acronymn?: string;
}

export interface PolicyFilters {
    status?: string | null;
    type?: string | null;
    applied_to?: string | null;
}
