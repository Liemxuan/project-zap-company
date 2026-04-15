import { FilterGroup } from '@/genesis/molecules/data-filter';
import { UnitFilters } from '@/services/unit/unit.model';

export const getUnitFilterGroups = (filters: UnitFilters, t: any): FilterGroup[] => [
    {
        id: 'status',
        title: t.label_status,
        options: [
            { id: 'Active', label: t.status_active, selected: filters.status === 'Active' },
            { id: 'Inactive', label: t.status_inactive, selected: filters.status === 'Inactive' },
        ]
    }
];
