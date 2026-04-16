import { FilterGroup } from '@/genesis/molecules/data-filter';

/**
 * Get filter groups configuration
 */
export const getFilterGroups = (t: any, apiFilters: any): FilterGroup[] => [
    {
        id: 'is_active',
        title: t.label_status,
        options: [
            { id: 'true', label: t.status_active, selected: apiFilters.is_active === true },
            { id: 'false', label: t.status_inactive, selected: apiFilters.is_active === false },
        ]
    }
];
