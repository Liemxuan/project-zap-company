
'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { CreditCardInput } from '../../../../../genesis/atoms/formatters/credit-card';
import { CurrencyInput } from '../../../../../genesis/atoms/formatters/currency';
import { PhoneNumberInput } from '../../../../../genesis/atoms/formatters/phone';

export default function FormattersSandboxPage() {
    return (
        <ComponentSandboxTemplate
            componentName="Formatters"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/formatters/"
            importPath="@/genesis/atoms/formatters/*"
            foundationInheritance={{
                colorTokens: [],
                typographyScales: []
            }}
            platformConstraints={{ web: "Full support", mobile: "Native keyboard" }}
            foundationRules={[
                "Formatters wrap the base Input component with react-number-format.",
                "CreditCardInput: #### #### #### #### pattern with mask.",
                "CurrencyInput: $X,XXX.XX with thousandSeparator and fixed decimal.",
                "PhoneNumberInput: (###) ###-#### default format, customizable.",
            ]}
        >
            <div className="w-full space-y-10 animate-in fade-in duration-500 pb-8">

                {/* Credit Card */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Credit Card Input</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        Pattern: <code>#### #### #### ####</code> · Mask: <code>_</code>
                    </span>
                    <Wrapper identity={{ displayName: "CreditCardInput", type: "Atom", filePath: "genesis/atoms/formatters/credit-card.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 w-full max-w-sm">
                            <CreditCardInput placeholder="0000 0000 0000 0000" />
                        </div>
                    </Wrapper>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Currency Input</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        Prefix: <code>$</code> · Thousand separator · 2 decimal places
                    </span>
                    <Wrapper identity={{ displayName: "CurrencyInput", type: "Atom", filePath: "genesis/atoms/formatters/currency.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 w-full max-w-sm">
                            <CurrencyInput placeholder="$0.00" />
                        </div>
                    </Wrapper>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Phone Number Input</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        Default format: <code>(###) ###-####</code> · Customizable via <code>format</code> prop
                    </span>
                    <Wrapper identity={{ displayName: "PhoneNumberInput", type: "Atom", filePath: "genesis/atoms/formatters/phone.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 w-full max-w-sm">
                            <PhoneNumberInput placeholder="(555) 555-5555" />
                        </div>
                    </Wrapper>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
