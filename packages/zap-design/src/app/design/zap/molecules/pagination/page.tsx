'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../../../../../genesis/molecules/pagination';

export default function PaginationSandboxPage() {
    const [gap, setGap] = useState([4]);
    // Fetch initial settings
    const inspectorControls = (
        <>
            <div className="space-y-4">
                
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--pagination-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Slider value={gap} onValueChange={setGap} min={0} max={32} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                
            </div>
        </>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Pagination"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/pagination.tsx"
            importPath="@/components/ui/pagination"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: [],
                typographyScales: ["font-body", "text-transform-secondary"]
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
            foundationRules={[]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="pagination" title="Pagination Sandbox" description="Interactive components for Pagination" icon="widgets" />
                    <CanvasBody.Demo className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}