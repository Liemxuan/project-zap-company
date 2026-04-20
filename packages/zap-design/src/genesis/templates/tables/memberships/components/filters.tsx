import { FilterGroup } from '@/genesis/molecules/data-filter';
import { MembershipFilters } from '@/services/membership/membership.model';


/**
 * Get filter groups configuration for Membership
 */
export const getFilterGroups = (apiFilters: MembershipFilters, t: any): FilterGroup[] => [
    {
        id: 'is_active',
        title: t.label_status,
        options: [
            { id: 'true', label: t.status_active, selected: apiFilters.is_active === true },
            { id: 'false', label: t.status_inactive, selected: apiFilters.is_active === false },
        ]
    },
    {
        id: 'billing_cycle',
        title: t.label_billingCycle,
        options: [
            { id: 'Monthly', label: 'Monthly', selected: apiFilters.billing_cycle === 'Monthly' },
            { id: 'Yearly', label: 'Yearly', selected: apiFilters.billing_cycle === 'Yearly' },
        ]
    }
];
