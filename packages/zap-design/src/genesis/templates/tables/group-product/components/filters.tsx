import { FilterGroup } from '@/genesis/molecules/data-filter';

/**
 * Labels for the Group Product module
 */
export const GROUP_PRODUCT_LABELS = {
    addItem: "Add Group Product",
    itemName: "Group Product Name",
    itemCode: "Slug",
    category: "Parent",
    type: "Status",
    inventory: "Items",
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
