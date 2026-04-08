export interface RegisterInput {
  email: string;
  password: string;
  locale: string;
  country?: string;
  agree: boolean;
  merchant_name?: string;
  merchant_url?: string;
  first_name?: string;
  last_name?: string;
  dialing_code?: string;
  phone?: string;
}

/** Legacy alias for Signup components */
export type SignupFormValues = RegisterInput;

export interface RegisterResponse {
  token: string;
  user_id: string;
  email: string;
  name: string;
  merchant_id: string;
}

export interface CheckEmailResponse {
  available: boolean;
}

export interface CheckPhoneResponse {
  valid: boolean;
  available: boolean;
}

export interface CheckMerchantUrlResponse {
  available: boolean;
}

export interface RegisterSendOtpResponse {
  sent: boolean;
  expires_in: number;
}

export interface RegisterCheckOtpResponse {
  verified: boolean;
  token: string;
}

export interface BusinessInfoInput {
  business_name: string;
  business_address: string;
  has_physical_address: boolean;
}

export interface BusinessInfoResponse {
  success: boolean;
  message: string;
}

export interface BusinessCategory {
  id: string;
  label: string;
  category: string;
}

export interface BusinessMccInput {
  category_id: string;
  business_name: string;
  phone_number: string;
}

export interface RegisterCheckAccountResponse {
  available: boolean;
}

export interface LocaleOption {
  value: string;
  label: string;
  icon?: string;
}

export interface AnnualRevenueOption {
  id: string;
  label: string;
  subtext?: string;
}

export interface AnnualRevenueInput {
  revenue_id: string;
}
