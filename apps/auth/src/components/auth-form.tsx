"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loginAction } from "@olympus/zap-auth/src/actions";
import { LoginForm } from "zap-design/src/genesis/organisms/auth/LoginForm";
import { toast } from "sonner";

function AuthFormInner() {
  const [loading, setLoading] = useState(false);
  const [merchantName, setMerchantName] = useState('ZAP Inc.');
  const [email, setEmail] = useState('name@zap');
  const [password, setPassword] = useState('1234');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeLang, setActiveLang] = useState('🇺🇸 EN');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAction(email, password);
      if (result.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      toast.success("Authentication successful. Redirecting...");
      const callbackUrl = searchParams.get('callbackUrl');
      if (callbackUrl) {
         window.location.href = callbackUrl;
      } else {
         router.push("/auth/core/user-management");
      }
    } catch (err) {
      toast.error("Auth failed");
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

  return (
    <LoginForm
      onSubmit={handleSignIn}
      merchantName={merchantName}
      onMerchantNameChange={setMerchantName}
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      rememberMe={rememberMe}
      onRememberMeChange={setRememberMe}
      isProcessing={loading}
      activeLang={activeLang}
      onCycleLang={cycleLanguage}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
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
