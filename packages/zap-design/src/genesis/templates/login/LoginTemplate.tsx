'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { Wrapper } from '../../../components/dev/Wrapper';
import { LoginForm } from '../../../genesis/organisms/auth/LoginForm';
import { AuthSplitLayout } from '../../../genesis/layout/auth/AuthSplitLayout';
import { useBorderProperties } from '../../../zap/sections/atoms/border_radius/use-border-properties';
import { L5Inspector } from '../../../genesis/organisms/inspector';
import { Switch } from '../../../genesis/atoms/interactive/switch';
import { InspectorAccordion } from '../../../zap/organisms/laboratory/InspectorAccordion';

/**
 * Login Organism Showcase — renders LoginForm inside ComponentSandboxTemplate
 * with an L5Inspector panel for composition toggles + dynamic border properties.
 * Route: /design/[theme]/organisms/login
 */
export default function LoginTemplate() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // ─── Form State ──────────────────────────────────────────────────
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });
    const [activeLang, setActiveLang] = useState('🇺🇸 EN');
    const [rememberMe, setRememberMe] = useState(false);
    const [merchantName, setMerchantName] = useState('ZAP Inc.');
    const [email, setEmail] = useState('tom@zap.vn');
    const [password, setPassword] = useState('password');

    // ─── Composition Visibility Toggles (Inspector-driven) ──────────
    const [showMerchantName, setShowMerchantName] = useState(true);
    const [showEmail, setShowEmail] = useState(true);
    const [showPassword, setShowPassword] = useState(true);
    const [showRememberMe, setShowRememberMe] = useState(true);
    const [showSocialLogin, setShowSocialLogin] = useState(true);
    const [showConfigBar, setShowConfigBar] = useState(true);

    // ─── Dynamic Border Properties (DB-backed) ─────────────────────
    const {
        state: borderState,
        setComponentOverride,
        clearComponentOverride,
        hydrateState,
        getEffectiveProps
    } = useBorderProperties();

    // Removed duplicate useEffect updating isDarkMode on mount

    useEffect(() => {
        let mounted = true;
        const loadSettings = async () => {
            try {
                const res = await fetch(`/api/border_radius/publish?theme=${activeTheme}`);
                if (res.ok && mounted) {
                    const data = await res.json();
                    if (data.success && data.data && data.data.state) {
                        hydrateState(data.data.state);
                    }
                }
            } catch (err) {
                console.error("Failed to load border radius settings:", err);
            }
        };
        loadSettings();
        return () => { mounted = false; };
    }, [activeTheme, hydrateState]);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDarkMode(!isDarkMode);
    };

    const cycleLanguage = () => {
        const languages = ['🇺🇸 EN', '🇻🇳 VI', '🇫🇷 FR', '🇯🇵 JA'];
        const nextIndex = (languages.indexOf(activeLang) + 1) % languages.length;
        setActiveLang(languages[nextIndex]);
    };

    const effectiveProps = getEffectiveProps('LoginForm');

    // ─── Composition Toggles (for Inspector) ────────────────────────
    const compositionToggles = [
        { label: 'Merchant Name', checked: showMerchantName, onChange: setShowMerchantName, icon: 'business' },
        { label: 'Email', checked: showEmail, onChange: setShowEmail, icon: 'mail' },
        { label: 'Password', checked: showPassword, onChange: setShowPassword, icon: 'lock' },
        { label: 'Remember Me', checked: showRememberMe, onChange: setShowRememberMe, icon: 'check_box' },
        { label: 'Social Login', checked: showSocialLogin, onChange: setShowSocialLogin, icon: 'login' },
        { label: 'Config Bar', checked: showConfigBar, onChange: setShowConfigBar, icon: 'tune' },
    ];

    // ─── Inspector Panel ────────────────────────────────────────────
    const inspectorControls = (
        <L5Inspector
            componentName="LoginForm"
            borderState={borderState}
            setComponentOverride={setComponentOverride}
            clearComponentOverride={clearComponentOverride}
            effectiveProps={effectiveProps}
            publishContext={{
                activeTheme,
                filePath: "genesis/templates/login/LoginTemplate.tsx",
            }}
        >
            {/* Composition Toggles Accordion */}
            <InspectorAccordion title="Composition" icon="view_stream" defaultOpen={true}>
                <Wrapper identity={{ displayName: "Composition Toggles", type: "Control Group", filePath: "genesis/templates/login/LoginTemplate.tsx" }}>
                    <div className="space-y-3 pt-1">
                        {compositionToggles.map(({ label, checked, onChange, icon }) => (
                            <div key={label} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px] text-muted-foreground opacity-60">{icon}</span>
                                    <span className="text-[11px] font-bold font-display text-transform-primary text-muted-foreground group-hover:text-foreground transition-colors">
                                        {label}
                                    </span>
                                </div>
                                <Switch size="sm" checked={checked} onCheckedChange={onChange} />
                            </div>
                        ))}
                    </div>
                </Wrapper>
            </InspectorAccordion>
        </L5Inspector>
    );

    const layoutContent = (
        <AuthSplitLayout
            className={isFullscreen ? "min-h-screen h-screen w-full" : "min-h-full h-full"}
            formSlot={
                <LoginForm
                    onSubmit={(e) => e.preventDefault()}
                    merchantName={merchantName}
                    onMerchantNameChange={setMerchantName}
                    email={email}
                    onEmailChange={setEmail}
                    password={password}
                    onPasswordChange={setPassword}
                    rememberMe={rememberMe}
                    onRememberMeChange={setRememberMe}
                    activeLang={activeLang}
                    onCycleLang={cycleLanguage}
                    isDarkMode={isDarkMode}
                    onToggleTheme={toggleTheme}
                    showMerchantName={showMerchantName}
                    showEmail={showEmail}
                    showPassword={showPassword}
                    showRememberMe={showRememberMe}
                    showSocialLogin={showSocialLogin}
                    showConfigBar={showConfigBar}
                />
            }
            heroSlot={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-indigo-500/20 to-surface-container overflow-hidden flex items-center justify-center">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                    <span className="material-symbols-outlined text-[300px] text-white/5 z-0 transform -rotate-12 translate-y-12">shield_lock</span>
                </div>
            }
        />
    );

    if (isFullscreen) {
        return (
            <div className="w-screen h-screen m-0 p-0 overflow-hidden">
                {layoutContent}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="LoginForm"
            tier="L5 ORGANISM"
            status="Verified"
            filePath="genesis/organisms/auth/LoginForm.tsx"
            importPath="@/genesis/organisms/auth/LoginForm"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container', '--md-sys-color-on-surface'],
                typographyScales: ['--font-display (titleMedium)', '--font-body (bodyMedium)']
            }}
            fullWidth={true}
            foundationRules={[
                "LoginForm composes L4 molecules — never hardcode form elements directly.",
                "Visibility toggles control sub-component rendering via Inspector.",
                "Border properties inherit from Universal unless overridden per-component.",
                "All auth state (email, password) lives in the parent page (L7), not here."
            ]}
        >
            <div className="w-full flex justify-center py-6 px-4 md:px-0">
                <CanvasDesktop title="Sign-In Experience // ZAP Auth" fullScreenHref={`/design/${activeTheme}/organisms/signin-a?fullscreen=true`}>
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
