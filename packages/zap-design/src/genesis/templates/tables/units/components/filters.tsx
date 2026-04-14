import { FilterGroup } from '@/genesis/molecules/data-filter';
import { UnitFilters } from '@/services/unit/unit.model';

export const getUnitFilterGroups = (filters: UnitFilters): FilterGroup[] => [
    {
        id: 'status',
        title: 'Status',
        options: [
            { id: 'Active', label: 'Active', selected: filters.status === 'Active' },
            { id: 'Inactive', label: 'Inactive', selected: filters.status === 'Inactive' },
        ]
    }
];
