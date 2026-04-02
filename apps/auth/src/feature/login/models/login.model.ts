export interface LoginFormValues {
  merchant: string;
  account: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  merchant_id: string;
  email: string;
  name: string;
  logo_url: string;
}

export interface LoginError {
  code: string;
  message: string;
}

// Check Account
export interface CheckAccountRequest {
  identifier: string; // email or phone
}

export interface CheckAccountResponse {
  exists: boolean;
  method: 'otp' | 'password';
}

// Send OTP
export interface SendOtpRequest {
  identifier: string;
}

export interface SendOtpResponse {
  sent: boolean;
  expires_in: number;
}

// Verify OTP
export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

// Auth Health
export interface AuthHealthResponse {
  status: string;
  uptime: number;
}
