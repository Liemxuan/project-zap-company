"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loginAction } from "@olympus/zap-auth/src/actions";
import { LoginForm } from "zap-design/src/genesis/organisms/auth/LoginForm";
import { toast } from "sonner";
import { AuthStorage } from "../utils/auth-storage";

function AuthFormInner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [merchantName, setMerchantName] = useState('ZAP Inc.');
  const [email, setEmail] = useState('name@zap');
  const [password, setPassword] = useState('1234');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeLang, setActiveLang] = useState('🇺🇸 EN');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load dark mode preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }

    // Load saved credentials from localStorage
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('zap_remember_email');
      const savedPassword = localStorage.getItem('zap_remember_password');
      const savedMerchant = localStorage.getItem('zap_remember_merchant');
      const savedRememberMe = localStorage.getItem('zap_remember_me') === 'true';

      if (savedEmail && savedRememberMe) {
        setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        if (savedMerchant) setMerchantName(savedMerchant);
        setRememberMe(true);
      }
    }
  }, []);

  const ERROR_MESSAGES: Record<string, string> = {
    invalid_credentials: 'Invalid email or password.',
    account_locked: 'Account is locked. Please contact support.',
    merchant_not_found: 'Merchant not found. Check your store name.',
    network_error: 'Network unavailable. Please try again.',
    timeout: 'Request timed out. Please try again.',
  };

  const resolveError = (code: string) =>
    ERROR_MESSAGES[code] ?? 'Authorization failed. Please try again.';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginAction(email, password);
      if (result.error) {
        const msg = resolveError(result.error);
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      // Save to localStorage if remember me is checked
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('zap_remember_email', email);
          localStorage.setItem('zap_remember_password', password);
          localStorage.setItem('zap_remember_merchant', merchantName);
          localStorage.setItem('zap_remember_me', 'true');
        } else {
          localStorage.removeItem('zap_remember_email');
          localStorage.removeItem('zap_remember_password');
          localStorage.removeItem('zap_remember_merchant');
          localStorage.removeItem('zap_remember_me');
        }

        // Save token and user data to localStorage
        if (result.data) {
          AuthStorage.saveAuthData({
            token: result.data.token,
            email: result.data.email,
            merchant_id: result.data.merchant_id,
            name: result.data.name,
            logo_url: result.data.logo_url,
          });
        }
      }

      toast.success('Access granted! Redirecting...');
      const callbackUrl = searchParams.get('callbackUrl');
      if (callbackUrl) {
        window.location.href = callbackUrl;
      } else {
        const formattedMerchant = merchantName.toLowerCase().replace(/\s+/g, '_');
        const langCode = activeLang.includes('VI') ? 'vi' : 'en';
        router.push(`/${formattedMerchant}/${langCode}/products`);
      }
    } catch (err) {
      const msg = resolveError('network_error');
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const cycleLanguage = () => {
    const languages = ['🇺🇸 EN', '🇻🇳 VI', '🇫🇷 FR', '🇯🇵 JA'];
    const nextIndex = (languages.indexOf(activeLang) + 1) % languages.length;
    setActiveLang(languages[nextIndex]);
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <LoginForm
      onSubmit={handleSignIn}
      merchantName={merchantName}
      onMerchantNameChange={(value) => {
        setMerchantName(value);
        setError('');
      }}
      email={email}
      onEmailChange={(value) => {
        setEmail(value);
        setError('');
      }}
      password={password}
      onPasswordChange={(value) => {
        setPassword(value);
        setError('');
      }}
      rememberMe={rememberMe}
      onRememberMeChange={setRememberMe}
      isProcessing={loading}
      error={error}
      activeLang={activeLang}
      onCycleLang={cycleLanguage}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      onSignUp={handleSignUp}
      showSocialLogin={false}
    />
  );
}

export function AuthForm() {
  return (
    <Suspense fallback={<div>Loading Auth...</div>}>
      <AuthFormInner />
    </Suspense>
  );
}
