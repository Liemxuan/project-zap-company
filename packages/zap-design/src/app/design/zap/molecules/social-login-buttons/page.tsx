'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { SocialLoginButtons } from '../../../../../genesis/molecules/forms/SocialLoginButtons';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function SocialLoginButtonsPage() {
    return (
        <ComponentSandboxTemplate
            componentName="Social Login Buttons"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="genesis/molecules/forms/SocialLoginButtons.tsx"
            importPath="@/genesis/molecules/forms/SocialLoginButtons"
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="social-login-buttons" title="Social Login Buttons Sandbox" description="Interactive components for Social Login Buttons" icon="widgets" />
                    <CanvasBody.Demo className="flex flex-col gap-8 p-6 max-w-md mx-auto">
                <div className="space-y-4">
                    <h3 className="text-labelLarge text-on-surface font-display text-transform-primary">Default</h3>
                    <SocialLoginButtons
                        onApple={() => alert('Apple SSO')}
                        onGoogle={() => alert('Google SSO')}
                    />
                </div>
                <div className="space-y-4">
                    <h3 className="text-labelLarge text-on-surface font-display text-transform-primary">Custom Divider</h3>
                    <SocialLoginButtons dividerLabel="or continue with" />
                </div>
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}
