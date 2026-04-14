import { FilterGroup } from '@/genesis/molecules/data-filter';
import { PolicyFilters } from '@/services/policy/policy.model';

export const getPolicyFilterGroups = (filters: PolicyFilters): FilterGroup[] => [
    {
        id: 'status',
        title: 'Status',
        options: [
            { id: 'Active', label: 'Active', selected: filters.status === 'Active' },
            { id: 'Draft', label: 'Draft', selected: filters.status === 'Draft' },
        ]
    },
    {
        id: 'type',
        title: 'Type',
        options: [
            { id: 'Legal', label: 'Legal', selected: filters.type === 'Legal' },
            { id: 'Operational', label: 'Operational', selected: filters.type === 'Operational' },
            { id: 'Standard', label: 'Standard', selected: filters.type === 'Standard' },
        ]
    },
    {
        id: 'applied_to',
        title: 'Applied To',
        options: [
            { id: 'Customer', label: 'Customer', selected: filters.applied_to === 'Customer' },
            { id: 'Merchant', label: 'Merchant', selected: filters.applied_to === 'Merchant' },
            { id: 'Internal', label: 'Internal', selected: filters.applied_to === 'Internal' },
        ]
    }
];
