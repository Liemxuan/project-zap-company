import { PromotionFilters } from "@/services/promotion/promotion.model";

export const PROMOTION_LABELS = {
    title: "Promotions",
    description: "Manage your store's discount programs and promotional campaigns.",
    addItem: "New promotion",
    itemName: "Promotion",
};

export const getFilterGroups = (filters: PromotionFilters): any[] => [
    {
        id: 'is_active',
        title: 'Status',
        options: [
            { id: 'true', label: 'Active', selected: filters.is_active === true },
            { id: 'false', label: 'Inactive', selected: filters.is_active === false },
        ]
    },
    {
        id: 'discount_type',
        title: 'Discount Type',
        options: [
            { id: 'Fixed', label: 'Fixed Amount', selected: filters.discount_type === 'Fixed' },
            { id: 'Percentage', label: 'Percentage', selected: filters.discount_type === 'Percentage' },
        ]
    },
    {
        id: 'schedule',
        title: 'Schedule',
        options: [
            { id: 'Daily', label: 'Daily', selected: filters.schedule?.includes('Daily') },
            { id: 'Weekend', label: 'Weekend', selected: filters.schedule?.includes('Weekend') },
            { id: 'Weekdays', label: 'Weekdays', selected: filters.schedule?.includes('Mon') },
        ]
    }
];
