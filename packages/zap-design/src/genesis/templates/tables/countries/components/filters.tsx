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

export const getFilterGroups = (filters: CountryFilters, t: any) => [
    {
        id: 'is_active',
        title: t.label_status,
        options: [
            { id: 'true', label: t.status_active, count: 0, selected: filters.is_active === true },
            { id: 'false', label: t.status_inactive, count: 0, selected: filters.is_active === false },
        ]
    }
];
