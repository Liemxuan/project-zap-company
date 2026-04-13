import { FilterGroup } from '@/genesis/molecules/data-filter';

/**
 * Labels for the Modifier Item module
 */
export const MODIFIER_ITEM_LABELS = {
    addItem: "Thêm Tùy chọn",
    itemName: "Tên Tùy chọn",
    itemCode: "Mã",
    category: "Loại hiển thị",
    type: "Trạng thái",
    inventory: "Vị trí",
    price: "Giá bán"
};

/**
 * Get filter groups configuration
 */
export const getFilterGroups = (apiFilters: any): FilterGroup[] => [
    {
        id: 'is_active',
        title: 'Trạng thái',
        options: [
            { id: 'true', label: 'Active', selected: apiFilters.is_active === true },
            { id: 'false', label: 'Inactive', selected: apiFilters.is_active === false },
        ]
    },
    {
        id: 'display_type',
        title: 'Loại hiển thị',
        options: [
            { id: 'Checkbox', label: 'Checkbox', selected: apiFilters.display_type === 'Checkbox' },
            { id: 'Radio', label: 'Radio', selected: apiFilters.display_type === 'Radio' },
        ]
    }
];
