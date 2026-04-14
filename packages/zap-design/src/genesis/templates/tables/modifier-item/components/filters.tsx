import { FilterGroup } from '@/genesis/molecules/data-filter';

/**
 * Labels for the Modifier Item module
 */
export const MODIFIER_ITEM_LABELS = {
    addItem: "Add new",
    itemName: "Modifier Name",
    itemCode: "Code",
    category: "Display Type",
    type: "Status",
    inventory: "Position",
    price: "Price"
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
    },
    {
        id: 'display_type',
        title: 'Display Type',
        options: [
            { id: 'Checkbox', label: 'Checkbox', selected: apiFilters.display_type === 'Checkbox' },
            { id: 'Radio', label: 'Radio', selected: apiFilters.display_type === 'Radio' },
        ]
    }
];
