'use client';

import { ComponentSandboxTemplate } from "@/zap/layout/ComponentSandboxTemplate";
import { SignInTemplate } from "@/genesis/templates/login/SignInTemplate";

export default function SignInSandboxPage() {
    return (
        <ComponentSandboxTemplate
            componentName="SignInTemplate"
            tier="L7 PAGE"
            status="In Progress"
            filePath="src/genesis/templates/login/SignInTemplate.tsx"
            importPath="@/genesis/templates/login/SignInTemplate"
            inspectorControls={
                <div className="text-label-small text-on-surface-variant p-4">
                    Template pages are generally static structural scaffolding for organism combinations.
                </div>
            }
            foundationInheritance={{
                colorTokens: ["bg-layer-panel", "bg-layer-0", "bg-layer-surface"],
                typographyScales: ["font-body text-transform-secondary", "text-transform-primary"]
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
            foundationRules={[]}
        >
            <div className="w-full h-full relative border border-outline-variant shadow-sm rounded-xl overflow-hidden min-h-[800px]">
                <SignInTemplate />
            </div>
        </ComponentSandboxTemplate>
    );
}
