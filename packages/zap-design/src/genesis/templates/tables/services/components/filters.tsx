export const getServiceFilterGroups = (filters: any, t: any) => [
    {
        id: 'status_id',
        label: t.label_status,
        options: [
            { id: 'active', label: t.status_active, isActive: filters.status_id === 'active' },
            { id: 'inactive', label: t.status_inactive, isActive: filters.status_id === 'inactive' }
        ]
    },
    {
        id: 'category',
        label: t.label_category,
        options: [
            { id: 'Housekeeping', label: t.category_housekeeping, isActive: filters.category === 'Housekeeping' },
            { id: 'Dining', label: t.category_dining, isActive: filters.category === 'Dining' },
            { id: 'Maintenance', label: t.category_maintenance, isActive: filters.category === 'Maintenance' }
        ]
    }
];
