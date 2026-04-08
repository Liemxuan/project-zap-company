import { RegisterInput } from '../../feature/register/models/register.model';

export const mockDb = {
  users: [] as any[],
  merchants: [] as any[],
  
  saveUser: (user: any) => {
    mockDb.users.push(user);
    console.log('MockDB: User saved', user);
  },
  
  saveMerchant: (merchant: any) => {
    mockDb.merchants.push(merchant);
    console.log('MockDB: Merchant saved', merchant);
  },
  
  saveBusinessInfo: (merchantId: string, info: any) => {
    const merchant = mockDb.merchants.find(m => m.id === merchantId);
    if (merchant) {
      Object.assign(merchant, info);
      console.log('MockDB: Business Info updated for', merchantId, info);
    } else {
      // If merchant doesn't exist (unlikely in this flow), create a placeholder
      mockDb.merchants.push({ id: merchantId, ...info });
      console.log('MockDB: Business Info saved (new merchant)', merchantId, info);
    }
  },

  saveBusinessCategory: (merchantId: string, categoryId: string) => {
    const merchant = (mockDb.merchants as any[]).find(m => m.id === merchantId);
    if (merchant) {
      merchant.category_id = categoryId;
      console.log('MockDB: Business Category saved for', merchantId, categoryId);
    }
  },

  saveAnnualRevenue: (merchantId: string, revenueId: string) => {
    const merchant = (mockDb.merchants as any[]).find(m => m.id === merchantId);
    if (merchant) {
      merchant.revenue_id = revenueId;
      console.log('MockDB: Annual Revenue saved for', merchantId, revenueId);
    }
  }
};
