import { FilterGroup } from '@/genesis/molecules/data-filter';

export const getTaxFilterGroups = (
    currentFilters: any,
    t: any
): FilterGroup[] => [
    {
        id: 'location',
        title: t.label_location || 'Location',
        options: [
            { id: 'Vietnam', label: 'Vietnam' },
            { id: 'Singapore', label: 'Singapore' },
            { id: 'Global', label: 'Global' },
        ],
    },
    {
        id: 'status',
        title: t.label_status || 'Status',
        options: [
            { id: 'active', label: 'Active' },
            { id: 'inactive', label: 'Inactive' },
        ],
    },
];
