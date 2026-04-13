import { Promotion, PromotionListRequest, PromotionResponse, PromotionDetailResponse } from './promotion.model';

const USE_MOCK = true;

/**
 * Promotion Service
 */
export const promotionService = {
    /**
     * Get promotions with filtering and pagination
     */
    async getPromotions(request: PromotionListRequest): Promise<PromotionResponse> {
        if (USE_MOCK) {
            // Lazy load mock data to avoid circular dependencies
            const { MOCK_PROMOTIONS } = await import('@/hooks/mock-data');
            
            let filtered = [...MOCK_PROMOTIONS];

            // Search Filter
            if (request.search) {
                const s = request.search.toLowerCase();
                filtered = filtered.filter(item => 
                    item.name.toLowerCase().includes(s) || 
                    item.id.toLowerCase().includes(s)
                );
            }

            // Status Filter
            if (request.filters.is_active !== undefined && request.filters.is_active !== null) {
                filtered = filtered.filter(item => item.is_active === request.filters.is_active);
            }

            // Discount Type Filter
            if (request.filters.discount_type) {
                filtered = filtered.filter(item => item.discount_type === request.filters.discount_type);
            }

            // Automatic Filter
            if (request.filters.is_automatic !== undefined && request.filters.is_automatic !== null) {
                filtered = filtered.filter(item => item.is_automatic === request.filters.is_automatic);
            }

            const total = filtered.length;
            const totalPage = Math.ceil(total / request.page_size);
            const start = (request.page_index - 1) * request.page_size;
            const items = filtered.slice(start, start + request.page_size);

            return {
                success: true,
                data: {
                    items,
                    total_record: total,
                    total_page: totalPage
                }
            };
        }

        // TODO: Real API Implementation
        throw new Error('Not implemented');
    },

    /**
     * Get single promotion detail
     */
    async getPromotion(id: string): Promise<PromotionDetailResponse> {
        if (USE_MOCK) {
            const { MOCK_PROMOTIONS } = await import('@/hooks/mock-data');
            const item = MOCK_PROMOTIONS.find(i => i.id === id);
            
            if (!item) throw new Error('Promotion not found');

            return {
                success: true,
                data: item
            };
        }

        throw new Error('Not implemented');
    }
};
