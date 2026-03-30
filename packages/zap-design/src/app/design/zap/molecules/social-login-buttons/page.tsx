'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { SocialLoginButtons } from '../../../../../genesis/molecules/forms/SocialLoginButtons';

export default function SocialLoginButtonsPage() {
    return (
        <ComponentSandboxTemplate
            componentName="Social Login Buttons"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="genesis/molecules/forms/SocialLoginButtons.tsx"
            importPath="@/genesis/molecules/forms/SocialLoginButtons"
        >
            <div className="flex flex-col gap-8 p-6 max-w-md mx-auto">
                <div className="space-y-4">
                    <h3 className="text-labelLarge text-on-surface font-display">Default</h3>
                    <SocialLoginButtons
                        onApple={() => alert('Apple SSO')}
                        onGoogle={() => alert('Google SSO')}
                    />
                </div>
                <div className="space-y-4">
                    <h3 className="text-labelLarge text-on-surface font-display">Custom Divider</h3>
                    <SocialLoginButtons dividerLabel="or continue with" />
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
