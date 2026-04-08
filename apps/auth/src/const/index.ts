// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  THEME: 'zap_theme',
  LANG: 'zap_lang',
  MERCHANT: 'zap_merchant',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',

  // Auth Group
  AUTH_CHECK_ACCOUNT: '/auth/check-account',
  AUTH_SEND_OTP: '/auth/send-otp',
  AUTH_VERIFY_OTP: '/auth/verify-otp',
  AUTH_HEALTH: '/auth/health',

  // Register Group
  REGISTER_CHECK_ACCOUNT: '/register/check-account',
  REGISTER_CHECK_EMAIL: '/register/check-email',
  REGISTER_CHECK_PHONE: '/register/check-phone',
  REGISTER_CHECK_MERCHANT_URL: '/register/check-merchant-url',
  REGISTER_SEND_OTP: '/register/send-otp',
  REGISTER_CHECK_OTP: '/register/check-otp',
  REGISTER_SIGNUP: '/auth/signup',

  // Products
  PRODUCT_LIST: '/products/list',
  PRODUCT_GET: '/products/:id',
  PRODUCT_CREATE: '/products',
  PRODUCT_UPDATE: '/products/:id',
  PRODUCT_DELETE: '/products/:id',

  // Categories
  CATEGORY_LIST: '/categories/list',

  // Brands
  BRAND_LIST: '/brands/list',

  // Units
  UNIT_LIST: '/units/list',

  // Modifier Groups
  MODIFIER_GROUP_LIST: '/modifiergroups/list',

  // Locations
  LOCATION_LIST: '/locations/list',

  // Dining Options
  DINING_OPTION_LIST: '/dining-option-list',
} as const;

// Supported Languages
export const SUPPORTED_LANGS = ['en', 'vi', 'fr', 'ja'] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: SupportedLang = 'en';

// Theme
export const THEMES = ['light', 'dark'] as const;
export type Theme = typeof THEMES[number];
export const DEFAULT_THEME: Theme = 'light';

// Pagination
export const PAGINATION_LIMIT = 10;

// Env config
export const IS_MOCK = process.env.NEXT_PUBLIC_IS_MOCK === 'true';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
