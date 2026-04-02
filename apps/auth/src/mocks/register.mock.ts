import type { ApiResponse } from '@/core/api/api.types';
import type {
  RegisterCheckAccountResponse,
  CheckEmailResponse,
  CheckPhoneResponse,
  CheckMerchantUrlResponse,
  RegisterSendOtpResponse,
  RegisterCheckOtpResponse,
} from '@/feature/register/models/register.model';

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
