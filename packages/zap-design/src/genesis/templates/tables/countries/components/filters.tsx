import { CountryFilters } from "@/services/country/country.model";

export const COUNTRY_LABELS = {
    addItem: "New country",
    itemName: "Country Name",
    itemCode: "ISO Code",
    category: "Region",
    type: "Status",
    inventory: "Phone Code",
    price: "Currency",
};

export const getFilterGroups = (filters: CountryFilters) => [
    {
        id: 'is_active',
        title: 'Status',
        options: [
            { id: 'true', label: 'Active', count: 0, selected: filters.is_active === true },
            { id: 'false', label: 'Inactive', count: 0, selected: filters.is_active === false },
        ]
    }
];
