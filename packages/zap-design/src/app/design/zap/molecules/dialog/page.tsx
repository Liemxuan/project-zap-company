'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '../../../../../genesis/molecules/dialog';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Input } from '../../../../../genesis/atoms/interactive/inputs';
import { Label } from '../../../../../genesis/atoms/typography/label';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function DialogSandboxPage() {    const [gap, setGap] = useState([24]);
    const [padding, setPadding] = useState([32]);
    const [radius, setRadius] = useState([24]);
    const [borderWidth, setBorderWidth] = useState([1]);

    // Fetch initial settings
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/dialog" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Dialog Structural Settings", type: "Docs Link", filePath: "zap/molecules/dialog/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dialog-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Slider value={gap} onValueChange={setGap} min={0} max={64} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dialog-padding</span>
                                    <span className="font-bold">{padding[0]}px</span>
                                </div>
                                <Slider value={padding} onValueChange={setPadding} min={0} max={64} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dialog-radius</span>
                                    <span className="font-bold">{radius[0]}px</span>
                                </div>
                                <Slider value={radius} onValueChange={setRadius} min={0} max={48} step={1} className="w-full" />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dialog-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Dialog"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/dialog.tsx"
            importPath="@/components/ui/dialog"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: [],
                typographyScales: ["font-display", "font-body", "text-transform-primary", "text-transform-secondary"]
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
            foundationRules={[]}
        >
            <div 
                className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl"
            >
                <Dialog modal={false}>
                    <DialogTrigger asChild>
                        <Button variant="flat">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent 
                        className="sm:max-w-[425px]"
                        onInteractOutside={(e) => e.preventDefault()}
                        style={Object.assign({}, {
                             '--dialog-gap': `${gap[0]}px`,
                             '--dialog-padding': `${padding[0]}px`,
                             '--dialog-radius': `${radius[0]}px`,
                             '--dialog-border-width': `${borderWidth[0]}px`,
                        } as React.CSSProperties)}
                    >
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">
                                    Name
                                </Label>
                                <Input id="name" defaultValue="Pedro Duarte" type="text" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="username">
                                    Username
                                </Label>
                                <Input id="username" defaultValue="@peduarte" type="text" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">
                                    Email
                                </Label>
                                <Input id="email" defaultValue="pedro@zeus.com" type="email" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="flat" type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </ComponentSandboxTemplate>
    );
}