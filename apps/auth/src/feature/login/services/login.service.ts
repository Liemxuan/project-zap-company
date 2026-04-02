import type {
  LoginFormValues,
  LoginResponse,
  CheckAccountRequest,
  CheckAccountResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  AuthHealthResponse,
} from '../models/login.model';
import { IS_MOCK, API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '@/const';
import { httpService } from '@/core/api/http.service';
import type { ApiResponse } from '@/core/api/api.types';
import {
  mockLoginApi,
  mockCheckAccountData,
  mockSendOtpData,
  mockVerifyOtpData,
  mockAuthHealthData,
} from '@/mocks/login.mock';

export async function loginService(values: LoginFormValues): Promise<LoginResponse> {
  if (IS_MOCK) {
    // Route through the mock API — handles all test scenarios
    return mockLoginApi({
      merchant: values.merchant,
      account: values.account,
      password: values.password,
    });
  }

  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'login_failed');
  }

  const result = await res.json();
  // Return the nested data from the CRM gateway response
  return result.data;
}

export async function checkAccountService(
  identifier: string
): Promise<ApiResponse<CheckAccountResponse>> {
  return httpService.post(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH_CHECK_ACCOUNT}`,
    { identifier } as CheckAccountRequest,
    mockCheckAccountData
  );
}

export async function sendOtpLoginService(
  identifier: string
): Promise<ApiResponse<SendOtpResponse>> {
  return httpService.post(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH_SEND_OTP}`,
    { identifier } as SendOtpRequest,
    mockSendOtpData
  );
}

export async function verifyOtpLoginService(
  payload: VerifyOtpRequest
): Promise<ApiResponse<LoginResponse>> {
  return httpService.post(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH_VERIFY_OTP}`,
    payload,
    mockVerifyOtpData
  );
}

export async function getAuthHealthService(): Promise<ApiResponse<AuthHealthResponse>> {
  return httpService.get(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH_HEALTH}`,
    undefined,
    mockAuthHealthData
  );
}

export function saveSession(response: LoginResponse): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
  // Optional: save other metadata if needed
  localStorage.setItem('user_email', response.email);
  localStorage.setItem('merchant_id', response.merchant_id);
}
