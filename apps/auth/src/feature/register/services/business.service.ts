import { BusinessInfoInput } from '../models/register.model';
import { mockDb } from '@/mocks/database/db';

class BusinessService {
  async saveBusinessMatch(merchantId: string, input: BusinessInfoInput) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    mockDb.saveBusinessInfo(merchantId, input);
    
    return {
      success: true,
      message: 'Business info saved successfully',
    };
  }

  async saveBusinessMcc(merchantId: string, input: import('../models/register.model').BusinessMccInput) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    mockDb.saveBusinessCategory(merchantId, input.category_id);
    // In a real app, we'd also save input.business_name and input.phone_number
    
    return {
      success: true,
      message: 'Business info and category saved successfully',
    };
  }

  async saveAnnualRevenue(merchantId: string, input: import('../models/register.model').AnnualRevenueInput) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    mockDb.saveAnnualRevenue(merchantId, input.revenue_id);
    
    return {
      success: true,
      message: 'Annual revenue saved successfully',
    };
  }
}

export const businessService = new BusinessService();
