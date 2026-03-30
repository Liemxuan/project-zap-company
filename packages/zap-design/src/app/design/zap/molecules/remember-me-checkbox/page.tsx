'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { RememberMeCheckbox } from '../../../../../genesis/molecules/forms/RememberMeCheckbox';

export default function RememberMeCheckboxPage() {
    const [checked, setChecked] = useState(false);
    const [checkedAlt, setCheckedAlt] = useState(true);

    return (
        <ComponentSandboxTemplate
            componentName="Remember Me Checkbox"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="genesis/molecules/forms/RememberMeCheckbox.tsx"
            importPath="@/genesis/molecules/forms/RememberMeCheckbox"
        >
            <div className="flex flex-col gap-8 p-6">
                <div className="space-y-4">
                    <h3 className="text-labelLarge text-on-surface font-display">Default (Unchecked)</h3>
                    <RememberMeCheckbox checked={checked} onChange={setChecked} />
                    <p className="text-bodySmall text-on-surface-variant">State: {checked ? 'Checked' : 'Unchecked'}</p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-labelLarge text-on-surface font-display">Pre-checked</h3>
                    <RememberMeCheckbox checked={checkedAlt} onChange={setCheckedAlt} />
                </div>
                <div className="space-y-4">
                    <h3 className="text-labelLarge text-on-surface font-display">Custom Label</h3>
                    <RememberMeCheckbox checked={false} onChange={() => {}} label="Stay Signed In" />
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
