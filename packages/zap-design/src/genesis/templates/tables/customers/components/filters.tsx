import { FilterGroup } from '@/genesis/molecules/data-filter';

/**
 * Labels for the Customer module
 */
export const CUSTOMER_LABELS = {
    addItem: "New Customer",
    itemName: "Name",
    itemCode: "Phone",
    category: "Membership",
    type: "Status",
    inventory: "Total Spend",
    price: "Balance"
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
        id: 'membership',
        title: 'Membership',
        options: [
            { id: 'Diamond', label: 'Diamond', selected: apiFilters.membership === 'Diamond' },
            { id: 'Gold', label: 'Gold', selected: apiFilters.membership === 'Gold' },
            { id: 'Silver', label: 'Silver', selected: apiFilters.membership === 'Silver' },
            { id: 'Bronze', label: 'Bronze', selected: apiFilters.membership === 'Bronze' },
        ]
    }
];
