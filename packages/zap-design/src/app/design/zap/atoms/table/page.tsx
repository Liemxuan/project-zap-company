'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import {
    Table, TableHeader, TableBody, TableRow,
    TableHead, TableCell
} from '../../../../../genesis/atoms/data-display/table';
import { Pill } from '../../../../../genesis/atoms/status/pills';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { ProductImage } from '../../../../../genesis/atoms/data-display/ProductImage';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

const SAMPLE_DATA = [
    { id: 'ZAP-001', status: 'Active', protocol: 'TLS 1.3', load: '12%' },
    { id: 'ZAP-002', status: 'Warning', protocol: 'SSH v2', load: '88%' },
    { id: 'ZAP-003', status: 'Offline', protocol: 'HTTP/3', load: '0%' },
    { id: 'ZAP-004', status: 'Active', protocol: 'gRPC', load: '45%' },
];

const ECOM_DATA = [
    { id: 'SKU-1024', name: 'ZAP Mechanical Keyboard', category: 'Accessories', stock: 45, price: '$189.00', status: 'In Stock', img: "/lego/keyboard.png" },
    { id: 'SKU-2048', name: 'Swarm Graphic T-Shirt', category: 'Apparel', stock: 12, price: '$35.00', status: 'Low Stock', img: "/lego/apparel.png" },
    { id: 'SKU-4096', name: 'Quantum Processor Node', category: 'Hardware', stock: 0, price: '$899.00', status: 'Out of Stock', img: "/lego/hardware.png" },
    { id: 'SKU-8192', name: 'Aurora Smart Display', category: 'Electronics', stock: 124, price: '$499.00', status: 'In Stock', img: "/lego/electronics.png" },
];

export default function TableSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[2].value); // Default to medium rounded
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Container Radius</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(e.target.value)}
                        >
                            {BORDER_RADIUS_TOKENS.map(t => (
                                <option key={t.name} value={t.value}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Grid Stroke</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={borderWidth}
                            onChange={(e) => setBorderWidth(e.target.value)}
                        >
                            {BORDER_WIDTH_TOKENS.map(t => (
                                <option key={t.name} value={t.value}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--table-border-width']) setBorderWidth(variables['--table-border-width']);
        if (variables['--table-border-radius']) setBorderRadius(variables['--table-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Table"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/data-display/table.tsx"
            importPath="@/genesis/atoms/data-display/table"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container-high', '--md-sys-color-outline-variant'],
                typographyScales: ['--font-body', '--font-display']
            }}
            platformConstraints={{
                web: "Accessible data table with semantic header and body roles.",
                mobile: "Ensures horizontal scroll responsiveness for wide datasets."
            }}
            foundationRules={[
                "Tables should use --color-outline-variant for internal borders.",
                "Header text must use text-transform-primary for semantic structural weight."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="table_chart"
                        description="Live-configured data matrix testing L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-2xl bg-layer-panel border border-border/40 shadow-xl overflow-hidden" style={{ 
                            borderRadius: borderRadius,
                            '--table-border-width': borderWidth
                        } as any}>
                           <Table className="w-full">
                               <TableHeader className="bg-layer-surface/50 border-b border-border/20">
                                   <TableRow>
                                       <TableHead className="px-6 py-4 text-labelMedium font-display font-bold text-primary text-transform-primary">Protocol ID</TableHead>
                                       <TableHead className="px-6 py-4 text-labelMedium font-display font-bold text-primary text-transform-primary">Status</TableHead>
                                       <TableHead className="px-6 py-4 text-labelMedium font-display font-bold text-primary text-transform-primary">Type</TableHead>
                                       <TableHead className="px-6 py-4 text-labelMedium font-display font-bold text-primary text-transform-primary text-right">System Load</TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {SAMPLE_DATA.map((row) => (
                                       <TableRow key={row.id} className="hover:bg-primary/5 transition-colors border-b border-border/10 last:border-0">
                                           <TableCell className="px-6 py-4 text-bodySmall font-mono font-bold text-primary">{row.id}</TableCell>
                                           <TableCell className="px-6 py-4">
                                               <Pill variant={row.status === 'Active' ? 'success' : row.status === 'Warning' ? 'warning' : 'error'}>
                                                   {row.status}
                                               </Pill>
                                           </TableCell>
                                           <TableCell className="px-6 py-4 text-bodySmall font-body text-muted-foreground">{row.protocol}</TableCell>
                                           <TableCell className="px-6 py-4 text-bodySmall font-mono font-bold text-right text-primary">{row.load}</TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="high-density-grid" 
                        number="02"
                        title="High-Density Grid"
                        icon="grid_on"
                        description="Structural layout testing for data-intensive administrative modules."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-4xl p-6 bg-layer-panel border border-border/40 rounded-xl shadow-md">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon name="terminal" className="text-primary w-4 h-4" />
                                <span className="text-labelSmall font-body text-primary text-transform-primary font-bold">Cortex Registry</span>
                            </div>
                            <Table className="w-full border-collapse">
                                <TableBody>
                                    {[
                                        ['Neural Weight', '2.4 TB', 'Active', '92%'],
                                        ['Token Cache', '512 GB', 'Active', '14%'],
                                        ['Vector Store', '1.1 TB', 'Standby', '2%'],
                                    ].map((row, i) => (
                                        <TableRow key={i} className="border-t border-border/10 first:border-0 h-10">
                                            <TableCell className="text-bodySmall font-body text-primary font-bold">{row[0]}</TableCell>
                                            <TableCell className="text-bodySmall font-mono text-muted-foreground">{row[1]}</TableCell>
                                            <TableCell className="text-[10px]"><Pill variant="neutral">{row[2]}</Pill></TableCell>
                                            <TableCell className="text-bodySmall font-mono text-right text-primary">{row[3]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="ecommerce-catalog" 
                        number="03"
                        title="E-Commerce Catalog"
                        icon="shopping_basket"
                        description="Rich data table structured for products, thumbnails, pricing, and nested status arrays."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full bg-layer-panel border border-border/40 rounded-xl shadow-md overflow-hidden">
                            <Table className="w-full">
                                <TableHeader className="bg-layer-surface/50 border-b border-border/20">
                                    <TableRow>
                                        <TableHead className="pl-6 pr-3 py-4 text-labelMedium font-display font-bold text-primary text-transform-primary w-[72px]">Product</TableHead>
                                        <TableHead className="pl-3 pr-6 py-4 text-labelMedium font-display font-bold text-primary text-transform-primary">Details</TableHead>
                                        <TableHead className="px-6 py-4 text-labelMedium font-display font-bold text-primary text-transform-primary">Category</TableHead>
                                        <TableHead className="px-6 py-4 text-labelMedium font-display font-bold text-primary text-transform-primary text-right">Unit Price</TableHead>
                                        <TableHead className="px-6 py-4 text-labelMedium font-display font-bold text-primary text-transform-primary text-right">Stock</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ECOM_DATA.map((product) => (
                                        <TableRow key={product.id} className="hover:bg-primary/5 transition-colors border-b border-border/10 last:border-0 h-20">
                                            <TableCell className="pl-6 pr-3 text-center align-middle w-[72px]">
                                                <div className="flex justify-center items-center w-full h-full">
                                                    <ProductImage src={product.img} alt={product.name} size="sm" interactive={true} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="pl-3 pr-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-bodySmall font-display font-bold text-foreground">{product.name}</span>
                                                    <span className="text-[11px] font-mono text-muted-foreground">{product.id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6">
                                                <span className="text-bodySmall font-body px-2 py-1 rounded bg-secondary/10 text-secondary-foreground">{product.category}</span>
                                            </TableCell>
                                            <TableCell className="px-6 text-right">
                                                <span className="text-bodySmall font-bold font-mono text-primary">{product.price}</span>
                                            </TableCell>
                                            <TableCell className="px-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Pill variant={product.stock === 0 ? 'error' : product.stock < 20 ? 'warning' : 'success'}>
                                                        {product.status}
                                                    </Pill>
                                                    <span className="text-[12px] font-mono text-muted-foreground whitespace-nowrap">{product.stock}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
