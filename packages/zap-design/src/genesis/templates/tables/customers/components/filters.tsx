import { FilterGroup } from '@/genesis/molecules/data-filter';
import { CustomerFilters } from '@/services/customer/customer.model';

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
export const getFilterGroups = (apiFilters: CustomerFilters, t: any): FilterGroup[] => [
    {
        id: 'is_active',
        title: t.label_status,
        options: [
            { id: 'true', label: t.status_active || 'Active', selected: apiFilters?.is_active === true },
            { id: 'false', label: t.status_inactive || 'Inactive', selected: apiFilters?.is_active === false },
        ]
    },
    {
        id: 'membership',
        title: t.label_membership,
        options: [
            { id: 'VIP', label: 'VIP', selected: apiFilters?.membership === 'VIP' },
            { id: 'Gold', label: 'Gold', selected: apiFilters?.membership === 'Gold' },
            { id: 'Silver', label: 'Silver', selected: apiFilters?.membership === 'Silver' },
        ]
    }
];
