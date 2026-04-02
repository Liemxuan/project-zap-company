// Signup Form Types
export interface SignupFormValues {
  merchant_name: string;
  merchant_url: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  dialing_code: string;
  phone: string;
}

export interface SignupResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// Check Account
export interface RegisterCheckAccountRequest {
  email?: string;
  phone?: string;
}

export interface RegisterCheckAccountResponse {
  available: boolean;
}

// Check Email
export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  available: boolean;
}

// Check Phone
export interface CheckPhoneRequest {
  phone: string;
}

export interface CheckPhoneResponse {
  valid: boolean;
  available: boolean;
}

// Check Merchant URL
export interface CheckMerchantUrlRequest {
  merchant_url: string;
}

export interface CheckMerchantUrlResponse {
  available: boolean;
}

// Send OTP (Register)
export interface RegisterSendOtpRequest {
  identifier: string;
}

export interface RegisterSendOtpResponse {
  sent: boolean;
  expires_in: number;
}

// Check OTP (Register)
export interface RegisterCheckOtpRequest {
  identifier: string;
  otp: string;
}

export interface RegisterCheckOtpResponse {
  verified: boolean;
  token: string;
}
