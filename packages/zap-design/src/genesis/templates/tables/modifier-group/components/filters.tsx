import { FilterGroup } from '@/genesis/molecules/data-filter';

export const getModifierGroupFilterGroups = (currentFilters: any): FilterGroup[] => [
    {
        id: 'status',
        title: 'Status',
        options: [
            { id: 'Active', label: 'Active', selected: currentFilters.status?.includes('Active') },
            { id: 'Inactive', label: 'Inactive', selected: currentFilters.status?.includes('Inactive') },
        ]
    }
];
