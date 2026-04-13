import { FilterGroup } from '@/genesis/molecules/data-filter';
import { MembershipFilters } from '@/services/membership/membership.model';

/**
 * Labels for the Membership module
 */
export const MEMBERSHIP_LABELS = {
    addItem: "New membership",
    itemName: "Membership",
    itemCode: "Status", // Mapping to tier name/status for basic ListTable if needed
    category: "Billing Cycle",
    type: "Benefits",
    inventory: "Active Users", // Extra field if needed
    price: "Tier Price"
};

/**
 * Get filter groups configuration for Membership
 */
export const getFilterGroups = (apiFilters: MembershipFilters): FilterGroup[] => [
    {
        id: 'is_active',
        title: 'Status',
        options: [
            { id: 'true', label: 'Active', selected: apiFilters.is_active === true },
            { id: 'false', label: 'Inactive', selected: apiFilters.is_active === false },
        ]
    },
    {
        id: 'billing_cycle',
        title: 'Billing Cycle',
        options: [
            { id: 'Monthly', label: 'Monthly', selected: apiFilters.billing_cycle === 'Monthly' },
            { id: 'Yearly', label: 'Yearly', selected: apiFilters.billing_cycle === 'Yearly' },
        ]
    }
];
