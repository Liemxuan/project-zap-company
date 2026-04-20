import { FilterGroup } from '@/genesis/molecules/data-filter';

export const getBrandLabels = (t: any) => ({
    addItem: t.label_addBrand,
    itemName: t.label_brandName,
    type: t.label_type,
    searchPlaceholder: t.label_search,
    filterButton: t.label_filter,
});

export const getFilterGroups = (apiFilters: any, t: any): FilterGroup[] => [
    {
        id: 'status_id',
        title: t.label_type,
        options: [
            { id: '1', label: t.status_active, selected: apiFilters.status_id === 1 },
            { id: '0', label: t.status_inactive, selected: apiFilters.status_id === 0 },
        ]
    }
];
