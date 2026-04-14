import { Policy, PolicyFilters } from './policy.model';

const MOCK_POLICIES: Policy[] = [
    {
        id: "POL-01",
        name: "Privacy Policy",
        acronymn: "PP",
        type: "Legal",
        applied_to: "Customer",
        content: "This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from the Site...",
        status: "Active",
        updated_at: "2026-04-14T02:00:00Z"
    },
    {
        id: "POL-02",
        name: "Terms of Service",
        acronymn: "TS",
        type: "Legal",
        applied_to: "Customer",
        content: "Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use...",
        status: "Active",
        updated_at: "2026-04-14T02:30:00Z"
    },
    {
        id: "POL-03",
        name: "Refund Policy",
        acronymn: "RP",
        type: "Operational",
        applied_to: "Customer",
        content: "We have a 30-day return policy, which means you have 30 days after receiving your item to request a return...",
        status: "Draft",
        updated_at: "2026-04-14T03:00:00Z"
    },
    {
        id: "POL-04",
        name: "Merchant Agreement",
        acronymn: "MA",
        type: "Legal",
        applied_to: "Merchant",
        content: "This Merchant Agreement is between the merchant and the platform regarding the terms of service and payment processing...",
        status: "Active",
        updated_at: "2026-04-14T04:00:00Z"
    }
];

export const policyService = {
    getPolicies: async (params: {
        page_index: number;
        page_size: number;
        search?: string;
        filters?: PolicyFilters;
    }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let items = [...MOCK_POLICIES];

        if (params.search) {
            const searchLower = params.search.toLowerCase();
            items = items.filter(i => 
                i.name.toLowerCase().includes(searchLower) || 
                i.id.toLowerCase().includes(searchLower)
            );
        }

        if (params.filters?.status) {
            items = items.filter(i => i.status === params.filters?.status);
        }
        
        if (params.filters?.type) {
            items = items.filter(i => i.type === params.filters?.type);
        }

        const total_record = items.length;
        const total_page = Math.ceil(total_record / params.page_size);
        const start = (params.page_index - 1) * params.page_size;
        const paginatedItems = items.slice(start, start + params.page_size);

        return {
            success: true,
            data: {
                items: paginatedItems,
                total_record,
                total_page
            }
        };
    }
};
