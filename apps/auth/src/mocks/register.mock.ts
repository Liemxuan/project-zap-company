import type { ApiResponse } from '@/core/api/api.types';
import type {
  RegisterCheckAccountResponse,
  CheckEmailResponse,
  CheckPhoneResponse,
  CheckMerchantUrlResponse,
  RegisterSendOtpResponse,
  RegisterCheckOtpResponse,
  RegisterInput,
  RegisterResponse,
} from '@/feature/register/models/register.model';
import { mockDb } from './database/db';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data for Register Endpoints (ApiResponse<T> format)
// ─────────────────────────────────────────────────────────────────────────────

export const mockRegisterCheckAccountData: ApiResponse<RegisterCheckAccountResponse> = {
  success: true,
  message: 'Account availability check successful',
  code: 200,
  data: {
    available: true,
  },
};

export const mockCheckEmailData: ApiResponse<CheckEmailResponse> = {
  success: true,
  message: 'Email availability check successful',
  code: 200,
  data: {
    available: true,
  },
};

export const mockCheckPhoneData: ApiResponse<CheckPhoneResponse> = {
  success: true,
  message: 'Phone validation and availability check successful',
  code: 200,
  data: {
    valid: true,
    available: true,
  },
};

export const mockCheckMerchantUrlData: ApiResponse<CheckMerchantUrlResponse> = {
  success: true,
  message: 'Merchant URL availability check successful',
  code: 200,
  data: {
    available: true,
  },
};

export const mockRegisterSendOtpData: ApiResponse<RegisterSendOtpResponse> = {
  success: true,
  message: 'OTP sent successfully',
  code: 200,
  data: {
    sent: true,
    expires_in: 600,
  },
};

export const mockRegisterCheckOtpData: ApiResponse<RegisterCheckOtpResponse> = {
  success: true,
  message: 'OTP verified successfully',
  code: 200,
  data: {
    verified: true,
    token: 'mock_registration_token_xyz',
  },
};

/**
 * Mock Register API
 * Simulate registration process with network delay
 */
export async function mockRegisterApi(
  input: RegisterInput
): Promise<ApiResponse<RegisterResponse>> {
  // Simulate network delay 600-1200ms
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 600));

  // Basic validation simulation
  if (input.email.includes('error')) {
    throw {
      success: false,
      message: 'Registration failed: Email already exists',
      code: 400,
    };
  }

  // Success simulation
  const merchantId = input.merchant_name || 'merchant_new_' + Math.random().toString(36).substr(2, 9);
  const userId = 'user_' + Math.random().toString(36).substr(2, 9);

  const newUser = {
    id: userId,
    email: input.email,
    name: input.email.split('@')[0],
    merchant_id: merchantId,
    created_at: new Date().toISOString(),
  };

  const newMerchant = {
    id: merchantId,
    name: input.merchant_name,
    owner_id: userId,
    country: input.country || 'US',
    created_at: new Date().toISOString(),
  };

  mockDb.saveUser(newUser);
  mockDb.saveMerchant(newMerchant);

  return {
    success: true,
    message: 'Account created successfully',
    code: 201,
    data: {
      token: 'mock_jwt_register_' + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      email: input.email,
      name: newUser.name,
      merchant_id: merchantId,
    },
  };
}
