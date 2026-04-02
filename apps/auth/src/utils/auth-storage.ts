// Client-side auth storage utilities
// Manages token and user data in localStorage

export interface StoredAuthData {
  token: string;
  email: string;
  merchant_id: string;
  name: string;
  logo_url: string;
  timestamp: number;
}

const STORAGE_KEY = 'zap_auth_data';
const TOKEN_KEY = 'access_token';  // Match STORAGE_KEYS.ACCESS_TOKEN from const/index.ts
const USER_KEY = 'zap_user';

export const AuthStorage = {
  // Save auth data to localStorage
  saveAuthData: (data: Partial<StoredAuthData>) => {
    if (typeof window === 'undefined') return;

    const existing = AuthStorage.getAuthData() || {};
    const updated: StoredAuthData = {
      ...existing,
      ...data,
      timestamp: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also save token and user separately for easy access
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data.email || data.merchant_id || data.name) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          email: data.email || existing.email,
          merchant_id: data.merchant_id || existing.merchant_id,
          name: data.name || existing.name,
          logo_url: data.logo_url || existing.logo_url,
        })
      );
    }
  },

  // Get auth data from localStorage
  getAuthData: (): StoredAuthData | null => {
    if (typeof window === 'undefined') return null;

    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get user info from localStorage
  getUser: () => {
    if (typeof window === 'undefined') return null;

    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Clear all auth data from localStorage
  clearAuthData: () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('zap_remember_email');
    localStorage.removeItem('zap_remember_password');
    localStorage.removeItem('zap_remember_merchant');
    localStorage.removeItem('zap_remember_me');
  },

  // Check if token is stored and valid
  hasValidToken: (): boolean => {
    const token = AuthStorage.getToken();
    const authData = AuthStorage.getAuthData();

    if (!token || !authData) return false;

    // Check if token is older than 7 days
    const ageInMs = Date.now() - authData.timestamp;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    return ageInMs < sevenDaysInMs;
  },
};
