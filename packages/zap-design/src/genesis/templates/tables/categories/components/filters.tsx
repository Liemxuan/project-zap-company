'use client';

import React, { useMemo } from 'react';
import { DataFilter, FilterGroup } from '@/genesis/molecules/data-filter';

interface CategoryFiltersProps {
    t: any;
    apiFilters: any;
    handleFilterChange: (filters: any) => void;
}

export const CategoryFilters = ({ t, apiFilters, handleFilterChange }: CategoryFiltersProps) => {
    const filterGroups: FilterGroup[] = useMemo(() => [
        {
            id: 'is_active',
            title: t.label_status || 'Status',
            options: [
                { id: 'true', label: t.status_active || 'Active', selected: apiFilters.is_active === true },
                { id: 'false', label: t.status_inactive || 'Inactive', selected: apiFilters.is_active === false },
            ]
        }
    ], [t, apiFilters]);

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'is_active') {
            const val = optionId === 'true';
            handleFilterChange({ is_active: apiFilters.is_active === val ? null : val });
        }
    };

    return (
        <DataFilter
            title=""
            groups={filterGroups}
            onToggle={handleFilterToggle}
        />
    );
};
