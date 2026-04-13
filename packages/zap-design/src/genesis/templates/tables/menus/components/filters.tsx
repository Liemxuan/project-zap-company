import { FilterGroup } from '@/genesis/molecules/data-filter';

/**
 * Labels for the Menu module
 */
export const MENU_LABELS = {
    addItem: "Add Menu",
    itemName: "Menu Name",
    itemCode: "Slug",
    category: "Category",
    type: "Status",
    inventory: "Total Item",
    price: "Branch"
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
