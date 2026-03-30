"use client";

import { useState, useEffect } from "react";
import { AuthLayout } from "zap-design/src/genesis/templates/auth/AuthLayout";
import { LoginForm } from "zap-design/src/genesis/organisms/auth/LoginForm";
import { Orbit } from "lucide-react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";

export function SwarmAuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [merchantName, setMerchantName] = useState("ZAP Core");
  const [email, setEmail] = useState("tom@zap.vn");
  const [password, setPassword] = useState("1234");
  const [rememberMe, setRememberMe] = useState(true);

 
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("swarm_auth") === "true") {
      setIsAuthenticated(true);
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate network delay
    setTimeout(() => {
      setIsProcessing(false);
      sessionStorage.setItem("swarm_auth", "true");
      setIsAuthenticated(true);
    }, 1200);
  };

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const swarmBranding = (
    <div className="flex flex-col items-center justify-center h-full text-center relative z-10 w-full">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <Orbit className="size-32 text-primary relative z-10" strokeWidth={1.5} />
      </div>
      <Heading level={1} className="text-on-surface mb-4">OmniRouter</Heading>
      <Text size="body-main" className="text-on-surface-variant max-w-sm">
        Advanced fleet telemetry and execution matrix designed for enterprise swarm orchestration.
      </Text>
    </div>
  );

  return (
    <AuthLayout
      title="Fleet Authorization"
      subtitle="ZAP Swarm Security credentials required."
      brandingPanel={swarmBranding}
    >
      <LoginForm
        onSubmit={handleLogin}
        merchantName={merchantName}
        onMerchantNameChange={setMerchantName}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
        isProcessing={isProcessing}
        activeLang="en"
        onCycleLang={() => {}}
        isDarkMode={true}
        onToggleTheme={() => {}}
        showMerchantName={false} // Command Center doesn't need merchant ID
        showSocialLogin={false}   // Enforce strict IAM
        showConfigBar={false}
      />
    </AuthLayout>
  );
}
