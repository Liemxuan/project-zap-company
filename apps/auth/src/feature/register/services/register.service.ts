'use server';

import {
  SignupFormValues,
  SignupResponse,
  RegisterCheckAccountRequest,
  RegisterCheckAccountResponse,
  CheckEmailRequest,
  CheckEmailResponse,
  CheckPhoneRequest,
  CheckPhoneResponse,
  CheckMerchantUrlRequest,
  CheckMerchantUrlResponse,
  RegisterSendOtpRequest,
  RegisterSendOtpResponse,
  RegisterCheckOtpRequest,
  RegisterCheckOtpResponse,
} from '../models/register.model';
import { API_BASE_URL, API_ENDPOINTS } from '@/const';
import { httpService } from '@/core/api/http.service';
import type { ApiResponse } from '@/core/api/api.types';
import {
  mockRegisterCheckAccountData,
  mockCheckEmailData,
  mockCheckPhoneData,
  mockCheckMerchantUrlData,
  mockRegisterSendOtpData,
  mockRegisterCheckOtpData,
} from '@/mocks/register.mock';

export async function registerCheckAccountService(
  payload: RegisterCheckAccountRequest
): Promise<ApiResponse<RegisterCheckAccountResponse>> {
  return httpService.post(
    `${API_BASE_URL}${API_ENDPOINTS.REGISTER_CHECK_ACCOUNT}`,
    payload,
    mockRegisterCheckAccountData
  );
}

export async function checkEmailService(
  payload: CheckEmailRequest
): Promise<ApiResponse<CheckEmailResponse>> {
  return httpService.post(
    `${API_BASE_URL}${API_ENDPOINTS.REGISTER_CHECK_EMAIL}`,
    payload,
    mockCheckEmailData
  );
}

export async function checkPhoneService(
  payload: CheckPhoneRequest
): Promise<ApiResponse<CheckPhoneResponse>> {
  return httpService.post(
    `${API_BASE_URL}${API_ENDPOINTS.REGISTER_CHECK_PHONE}`,
    payload,
    mockCheckPhoneData
  );
}

export async function checkMerchantUrlService(
  payload: CheckMerchantUrlRequest
): Promise<ApiResponse<CheckMerchantUrlResponse>> {
  return httpService.post(
    `${API_BASE_URL}${API_ENDPOINTS.REGISTER_CHECK_MERCHANT_URL}`,
    payload,
    mockCheckMerchantUrlData
  );
}

export async function sendOtpRegisterService(
  payload: RegisterSendOtpRequest
): Promise<ApiResponse<RegisterSendOtpResponse>> {
  return httpService.post(
    `${API_BASE_URL}${API_ENDPOINTS.REGISTER_SEND_OTP}`,
    payload,
    mockRegisterSendOtpData
  );
}

export async function checkOtpRegisterService(
  payload: RegisterCheckOtpRequest
): Promise<ApiResponse<RegisterCheckOtpResponse>> {
  return httpService.post(
    `${API_BASE_URL}${API_ENDPOINTS.REGISTER_CHECK_OTP}`,
    payload,
    mockRegisterCheckOtpData
  );
}

/**
 * Signup Action
 * Server action for direct signup submission
 */
export async function signupAction(values: SignupFormValues): Promise<SignupResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Signup failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Signup successful',
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
