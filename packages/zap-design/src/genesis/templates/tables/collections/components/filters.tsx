import { FilterGroup } from '@/genesis/molecules/data-filter';

/**
 * Labels for the Collection module
 */
export const COLLECTION_LABELS = {
    addItem: "Add Collection",
    itemName: "Collection Name",
    itemCode: "Slug",
    category: "Category",
    type: "Status",
    inventory: "Product Count",
    price: "Internal ID"
};

/**
 * Get filter groups configuration
 */
export const getFilterGroups = (apiFilters: any): FilterGroup[] => [
    {
        id: 'is_active',
        title: 'Status',
        options: [
            { id: 'true', label: 'Active', selected: apiFilters.is_active === true },
            { id: 'false', label: 'Inactive', selected: apiFilters.is_active === false },
        ]
    }
];
