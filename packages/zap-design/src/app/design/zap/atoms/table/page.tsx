'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import {
    Table, TableHeader, TableBody, TableRow,
    TableHead, TableCell
} from '../../../../../genesis/atoms/data-display/table';

import { Select as ZapSelect } from '../../../../../genesis/atoms/interactive/option-select';
import { Pill } from '../../../../../genesis/atoms/status/pills';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, TYPE_STYLES } from '../../../../../zap/sections/atoms/foundations/schema';
import { toast } from 'sonner';

const SAMPLE_DATA = [
    { id: 'INV-001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
    { id: 'INV-002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
    { id: 'INV-003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
    { id: 'INV-004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
    { id: 'INV-005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
];

export default function TableSandboxPage() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    
    const [typography, setTypography] = useState('inherit');
    const [textCasing, setTextCasing] = useState('inherit');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
const Object_assign = Object.assign;
    const {
        state,
        setComponentOverride,
        clearComponentOverride,
        hydrateState,
        getEffectiveProps
    } = useBorderProperties();

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

    const effectiveProps = getEffectiveProps('Table');
    
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '8px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '1px';

    const renderRadiusSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...BORDER_RADIUS_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <ZapSelect 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const renderWidthSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...BORDER_WIDTH_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <ZapSelect 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const renderTypographySelect = (value: string, onChange: (val: string) => void) => {
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...TYPE_STYLES.map(t => ({ label: t.name, value: t.name }))
        ];
        return (
            <ZapSelect 
                value={value} 
                onChange={onChange}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== 'inherit' && value ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const renderTextCasingSelect = (value: string, onChange: (val: string) => void) => {
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            { label: 'Normal (normal-case)', value: 'normal-case' },
            { label: 'Uppercase (uppercase)', value: 'uppercase' },
            { label: 'Lowercase (lowercase)', value: 'lowercase' },
            { label: 'Capitalize (capitalize)', value: 'capitalize' }
        ];
        return (
            <ZapSelect 
                value={value} 
                onChange={onChange}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== 'inherit' && value ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/table/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Table Structural Settings", type: "Docs Link", filePath: "zap/atoms/table/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Table']?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Table', 'width');
                                        else setComponentOverride('Table', 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Table']?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Table', 'radius');
                                        else setComponentOverride('Table', 'radius', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Typography Override</span>
                                    <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">{typography !== 'inherit' ? typography : 'Inherit'}</span>
                                </span>
                                {renderTypographySelect(typography, setTypography)}
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Text Casing</span>
                                    <span className="font-bold">{textCasing !== 'inherit' ? textCasing : 'Inherit'}</span>
                                </span>
                                {renderTextCasingSelect(textCasing, setTextCasing)}
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    const handleLoadedVariables = React.useCallback((variables: Record<string, string>) => {
        if (variables['--table-typography']) setTypography(variables['--table-typography']);
        if (variables['--table-text-casing']) setTextCasing(variables['--table-text-casing']);
    }, []);

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            // Publish local component values
            const variables = {
                '--table-typography': typography,
                '--table-text-casing': textCasing
            };
            const res1 = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables })
            });

            // Publish global border properties overrides 
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res1.ok && res2.ok) {
                toast.success(`Published Table settings to ${activeTheme}`);
            } else {
                toast.error('Failed to publish');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error during publish');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ComponentSandboxTemplate
            componentName="Table"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/data-display/table.tsx"
            importPath="@/genesis/atoms/data-display/table"
            inspectorControls={inspectorControls}
            inspectorFooter={
                <ThemePublisher 
                    theme={activeTheme} 
                    filePath="src/genesis/atoms/data-display/table.tsx" 
                    onPublish={handlePublish} 
                    isLoading={isSubmitting} 
                />
            }
            foundationInheritance={{
                colorTokens: ['--color-on-surface', '--color-on-surface-variant', '--color-outline-variant', '--color-surface-variant'],
                typographyScales: ['--font-body', '--font-display']
            }}
            platformConstraints={{ web: "Full support", mobile: "Horizontal scroll" }}
            foundationRules={[
                "Table uses 7 composable sub-components: Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption.",
                "Header text uses font-display with text-transform-primary.",
                "Row hover uses bg-surface-variant transition.",
                "Borders use outline-variant color.",
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <div 
                className="w-full space-y-10 animate-in fade-in duration-500 pb-8"
                style={Object_assign({
                    '--table-border-width': previewWidth,
                    '--table-border-radius': previewRadius,
                    '--table-font-size': TYPE_STYLES.find(t => t.name === typography)?.fontSizeRem,
                    '--table-line-height': TYPE_STYLES.find(t => t.name === typography)?.lineHeight,
                    '--table-letter-spacing': TYPE_STYLES.find(t => t.name === typography) ? `${TYPE_STYLES.find(t => t.name === typography)?.letterSpacing}px` : undefined,
                    '--table-font-weight': TYPE_STYLES.find(t => t.name === typography)?.fontWeight,
                    '--table-text-casing': textCasing === 'uppercase' ? 'uppercase' : textCasing === 'lowercase' ? 'lowercase' : textCasing === 'capitalize' ? 'capitalize' : textCasing === 'normal-case' ? 'none' : undefined,
                })}
            >
            

                {/* Standard Table */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Standard Data Table</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        Composable sub-components: <code>Table</code>, <code>TableHeader</code>, <code>TableBody</code>, <code>TableRow</code>, <code>TableHead</code>, <code>TableCell</code>
                    </span>
                    <Wrapper identity={{ displayName: "Table", type: "Atom", filePath: "genesis/atoms/data-display/table.tsx" }}>
                        <div className="bg-layer-panel border-outline-variant overflow-hidden w-full border-[length:var(--table-border-width,var(--layer-border-width,1px))] rounded-[length:var(--table-border-radius,var(--layer-border-radius,8px))]">
                            <Table>

                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Invoice</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {SAMPLE_DATA.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="font-medium">{row.id}</TableCell>
                                            <TableCell>
                                                <Pill variant={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'error'}>
                                                    {row.status}
                                                </Pill>
                                            </TableCell>
                                            <TableCell>{row.method}</TableCell>
                                            <TableCell className="text-right">{row.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Wrapper>
                </div>

                {/* Minimal Table */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Minimal 2-Column Table</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        Key-value layout for settings or property display
                    </span>
                    <Wrapper identity={{ displayName: "Table (Minimal)", type: "Atom", filePath: "genesis/atoms/data-display/table.tsx" }}>
                        <div className="bg-layer-panel border-outline-variant overflow-hidden w-full max-w-md border-[length:var(--table-border-width,var(--layer-border-width,1px))] rounded-[length:var(--table-border-radius,var(--layer-border-radius,8px))]">
                            <Table>
                                <TableBody>
                                    {[
                                        ['Theme', 'Metro Dark'],
                                        ['Border Radius', '8px'],
                                        ['Font Family', 'Inter'],
                                        ['Primary Color', 'Hex: 6750A4'],
                                    ].map(([key, value]) => (
                                        <TableRow key={key}>
                                            <TableCell className="font-medium text-muted-foreground">{key}</TableCell>
                                            <TableCell className="text-right">{value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Wrapper>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
