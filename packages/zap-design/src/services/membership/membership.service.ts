import { API_ENDPOINTS } from '@/const/api';
import { Membership, MembershipResponse, MembershipDetailResponse } from './membership.model';

/**
 * Service for Membership management
 */
export const membershipService = {
    /**
     * Get list of membership tiers
     */
    async getList(): Promise<MembershipResponse> {
        // In actual implementation, this would call the API
        // return await fetch(API_ENDPOINTS.MEMBERSHIP.LIST).then(res => res.json());
        
        // Return empty structure for now, hooks will handle mock data
        return {
            success: true,
            data: []
        };
    },

    /**
     * Get membership details by ID
     */
    async getById(id: string): Promise<MembershipDetailResponse> {
        // return await fetch(`${API_ENDPOINTS.MEMBERSHIP.DETAIL}/${id}`).then(res => res.json());
        return {
            success: true,
            data: {} as Membership
        };
    }
};
