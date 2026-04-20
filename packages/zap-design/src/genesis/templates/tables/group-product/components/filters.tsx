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
export const getFilterGroups = (filters: any, t: any) => [
    {
        id: 'is_active',
        title: t.label_status,
        options: [
            { id: 'true', label: t.status_active, count: 0, selected: filters.is_active === true },
            { id: 'false', label: t.status_inactive, count: 0, selected: filters.is_active === false },
        ]
    }
];
