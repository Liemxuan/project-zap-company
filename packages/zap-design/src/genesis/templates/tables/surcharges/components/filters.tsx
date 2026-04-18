export const getSurchargeFilterGroups = (filters: any, t: any) => [
    {
        id: 'status_id',
        label: t.label_status,
        options: [
            { id: 'active', label: t.status_active, isActive: filters.status_id === 'active' },
            { id: 'inactive', label: t.status_inactive, isActive: filters.status_id === 'inactive' }
        ]
    },
    {
        id: 'type',
        label: t.label_type,
        options: [
            { id: 'Percentage', label: t.type_percentage, isActive: filters.type === 'Percentage' },
            { id: 'Fixed', label: t.type_fixed, isActive: filters.type === 'Fixed' }
        ]
    }
];
