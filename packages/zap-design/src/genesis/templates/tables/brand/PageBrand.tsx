'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/genesis/molecules/dialog';
import { BrandDetail } from './detail/brandDetail';
import { usePathname, useRouter } from 'next/navigation';

// Hooks
import { useBrands } from '@/hooks/brand/use-brands';

// Components
import { getColumns } from './components/columns';
import { getFilterGroups, getBrandLabels } from './components/filters';
import { BrandInspector } from './components/inspector';

// Locales
import en from '@/locale/brand/en';
import vi from '@/locale/brand/vi';

/**
 * Brand Template
 * Route: /design/[theme]/organisms/brands
 */
export default function PageBrandTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    const pathname = usePathname();
    const router = useRouter();

    const pageParam = searchParams.get('p');
    const initialPage = pageParam ? parseInt(pageParam) : 1;

    const lang = searchParams.get('lang');
    const t = lang === 'vi' ? vi : en;

    // --- State ---
    const [selectedItem, setSelectedItem] = React.useState<any | null>(null);
    const [isCreating, setIsCreating] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isViewing, setIsViewing] = React.useState(false);
    const [isFetchingDetail, setIsFetchingDetail] = React.useState(false);

    // --- Data Fetching ---
    const {
        brands,
        isLoading,
        pagination,
        handlePageChange: baseHandlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters,
        refresh
    } = useBrands({
        pageSize: 10,
        initialPage
    });

    const handlePageChange = (index: number) => {
        baseHandlePageChange(index);

        // Update URL param 'p'
        const params = new URLSearchParams(searchParams.toString());
        params.set('p', index.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // --- Handlers ---
    const handleAction = async (type: string, item: any) => {
        console.log(`Action: ${type} on item:`, item);
        setSelectedItem(item);
        if (type === 'edit') {
            setIsEditing(true);
        } else if (type === 'view') {
            setIsViewing(true);
        } else if (type === 'delete') {
            // Add delete logic here if needed
        }
    };

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'status_id') {
            const val = parseInt(optionId);
            handleFilterChange({ status_id: apiFilters.status_id === val ? null : val });
        }
    };

    // --- Memorized Data ---
    const MAPPED_BRANDS = useMemo(() => brands.map(brand => ({
        ...brand,
        id: brand.id,
        name: brand.name,
        media_url: brand.logo_url,
        acronymn: brand.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
        is_active: brand.status_id === 1
    })), [brands]);

    const columns = useMemo(() => getColumns({ onAction: handleAction, t }), [t]);
    const filterGroups = useMemo(() => getFilterGroups(apiFilters, t), [apiFilters, t]);

    // Labels from Locale
    const mappedLabels = useMemo(() => getBrandLabels(t), [t]);

    // --- Shared Components ---
    const tableComponent = (
        <ListTable
            initialItems={MAPPED_BRANDS as any}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onPageChange={(p) => handlePageChange(p + 1)}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            columns={columns as any}
            labels={mappedLabels}
            onAddClick={() => setIsCreating(true)}
        />
    );

    const renderBrandDialog = (
        mode: 'create' | 'edit' | 'view',
        open: boolean,
        setOpen: (open: boolean) => void
    ) => {
        let title = '';
        switch (mode) {
            case "create":
                title = t.dialog_createBrand || 'Create Brand';
                break;
            case "edit":
                title = t.dialog_editBrand || 'Edit Brand';
                break;
            case "view":
                title = t.dialog_viewBrand || 'View Brand';
                break;
        }
        const itemToPass = mode === 'create' ? null : selectedItem;

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-none w-screen h-screen p-0 border-none rounded-none bg-white gap-0" closeButtonPosition="header-left">
                    <DialogHeader className='relative py-4 border-b border-outline-variant' closeButtonPosition="header-left" closeButtonClassName='border-none bg-surface hover:bg-surface-variant/60'>
                        <div className='max-w-lg mx-auto text-center'>
                            <DialogTitle className='text-transform-primary text-on-surface py-4'>{title}</DialogTitle>
                        </div>
                    </DialogHeader>
                    <DialogBody className="flex-1 flex flex-col p-0 overflow-hidden">
                        <BrandDetail
                            key={mode === 'create' ? 'create' : selectedItem?.id}
                            mode={mode}
                            item={itemToPass}
                            onCancel={() => setOpen(false)}
                            onSave={() => setOpen(false)}
                            t={t}
                            refresh={refresh}
                        />
                    </DialogBody>
                </DialogContent>
            </Dialog>
        );
    };

    const InspectorPanel = (
        <BrandInspector
            title={t.nav_brandLab}
            inspectorState={inspectorState}
            setInspectorState={setInspectorState}
            filterGroups={filterGroups}
            onFilterToggle={handleFilterToggle}
            t={t}
        />
    );

    // --- Layouts ---
    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
            {/* Nav */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Icon name="bolt" size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-on-surface uppercase text-transform-none">{t.nav_zapOs}</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>{t.nav_overview}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="verified_user" size={18} />
                        <span>{t.nav_brands}</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">{t.nav_catalog}</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">{t.nav_brands}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {tableComponent}
                </div>
            </div>

            {InspectorPanel}
        </div>
    );

    // --- Rendering ---
    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title={t.nav_brands} badge={null} />
                    <div className="flex-1 overflow-auto pt-8 px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {tableComponent}
                    </div>
                </div>
                {InspectorPanel}
                {renderBrandDialog('create', isCreating, setIsCreating)}
                {renderBrandDialog('edit', isEditing, setIsEditing)}
                {renderBrandDialog('view', isViewing, setIsViewing)}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="brands"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/brand/PageBrand.tsx"
            importPath="@/genesis/templates/tables/brand/PageBrand"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    <BrandInspector
                        inspectorState={inspectorState}
                        setInspectorState={setInspectorState}
                        filterGroups={filterGroups}
                        onFilterToggle={handleFilterToggle}
                        t={t}
                    />
                </div>
            }
        >
            <div className="w-full h-full flex items-center justify-center py-8">
                <CanvasDesktop
                    title={t.brands_collection_title}
                    fullScreenHref={`/design/${activeTheme}/organisms/brands?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
            {renderBrandDialog('create', isCreating, setIsCreating)}
            {renderBrandDialog('edit', isEditing, setIsEditing)}
            {renderBrandDialog('view', isViewing, setIsViewing)}
        </ComponentSandboxTemplate>
    );
}
