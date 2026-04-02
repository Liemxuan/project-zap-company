import type {
  LoginResponse,
  CheckAccountResponse,
  SendOtpResponse,
  AuthHealthResponse,
} from '@/feature/login/models/login.model';
import type { ApiResponse } from '@/core/api/api.types';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Users (test credentials)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_USERS: Record<string, { password: string; response: LoginResponse }> = {
  'admin@zap': {
    password: '1234',
    response: {
      token: 'mock_token_admin_xyz',
      merchant_id: 'merchant-admin-001',
      email: 'admin@zap',
      name: 'Admin User',
      logo_url: 'https://api.pendogo.vn/logo.png',
    },
  },
  'manager@zap': {
    password: 'manager123',
    response: {
      token: 'mock_token_manager_xyz',
      merchant_id: 'merchant-mgr-002',
      email: 'manager@zap',
      name: 'Store Manager',
      logo_url: 'https://api.pendogo.vn/logo.png',
    },
  },
  'name@zap': {
    password: '1234',
    response: {
      token: 'mock_token_demo_xyz',
      merchant_id: 'merchant-demo-003',
      email: 'name@zap',
      name: 'Demo User',
      logo_url: 'https://api.pendogo.vn/logo.png',
    },
  },
  'vana@pendo-test-011.vn': {
    password: 'password123',
    response: {
      token: 'mock_token_vana_xyz',
      merchant_id: '6aaf31b3-1ad9-4311-a4d1-171da234a9ff',
      email: 'vana@pendo-test-011.vn',
      name: 'Nguyen Van A',
      logo_url: 'https://api.pendogo.vn/logo.png',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock API Error Codes
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_ERRORS = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  MERCHANT_NOT_FOUND:  'merchant_not_found',
  ACCOUNT_LOCKED:      'account_locked',
  NETWORK_ERROR:       'network_error',
  TIMEOUT:             'timeout',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Test cases (documented for QA)
// ─────────────────────────────────────────────────────────────────────────────
//
// ✅ SUCCESS:
//    email: admin@zap       | password: 1234         | merchant: any
//    email: manager@zap     | password: manager123    | merchant: any
//    email: name@zap        | password: 1234          | merchant: any
//
// ❌ WRONG PASSWORD:
//    email: admin@zap       | password: wrong
//
// ❌ WRONG MERCHANT:
//    merchant: "locked"     → triggers merchant_not_found
//
// ❌ LOCKED ACCOUNT:
//    email: locked@zap      → triggers account_locked
//
// ❌ NETWORK ERROR:
//    email: network@zap     → throws simulated network failure
//
// ─────────────────────────────────────────────────────────────────────────────

// Simulate network delay 400–900ms
export const mockDelay = (ms?: number) =>
  new Promise((resolve) => setTimeout(resolve, ms ?? 400 + Math.random() * 500));

export type MockLoginInput = {
  merchant: string;
  account: string;
  password: string;
};

export async function mockLoginApi(input: MockLoginInput): Promise<LoginResponse> {
  await mockDelay();

  const email = input.account.trim().toLowerCase();

  // Simulate merchant validation
  if (input.merchant.trim().toLowerCase() === 'locked') {
    throw new Error(MOCK_ERRORS.MERCHANT_NOT_FOUND);
  }

  // Simulate locked account
  if (email === 'locked@zap') {
    throw new Error(MOCK_ERRORS.ACCOUNT_LOCKED);
  }

  // Simulate network failure
  if (email === 'network@zap') {
    throw new TypeError('Failed to fetch');
  }

  // Simulate timeout (2.5s then throw)
  if (email === 'timeout@zap') {
    await mockDelay(2500);
    throw new Error(MOCK_ERRORS.TIMEOUT);
  }

  // Look up user
  const user = MOCK_USERS[email];
  if (!user) {
    throw new Error(MOCK_ERRORS.INVALID_CREDENTIALS);
  }

  if (input.password !== user.password) {
    throw new Error(MOCK_ERRORS.INVALID_CREDENTIALS);
  }

  return user.response;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data for new auth endpoints (ApiResponse<T> format)
// ─────────────────────────────────────────────────────────────────────────────

export const mockCheckAccountData: ApiResponse<CheckAccountResponse> = {
  success: true,
  message: 'Account check successful',
  code: 200,
  data: {
    exists: true,
    method: 'otp',
  },
};

export const mockSendOtpData: ApiResponse<SendOtpResponse> = {
  success: true,
  message: 'OTP sent successfully',
  code: 200,
  data: {
    sent: true,
    expires_in: 600,
  },
};

export const mockVerifyOtpData: ApiResponse<LoginResponse> = {
  success: true,
  message: 'OTP verified, login successful',
  code: 200,
  data: {
    token: 'mock_token_otp_verified_xyz',
    merchant_id: 'merchant-otp-001',
    email: 'otp@zap',
    name: 'OTP Verified User',
    logo_url: 'https://api.pendogo.vn/logo.png',
  },
};

export const mockAuthHealthData: ApiResponse<AuthHealthResponse> = {
  success: true,
  message: 'Auth service is healthy',
  code: 200,
  data: {
    status: 'OK',
    uptime: 99999,
  },
};
