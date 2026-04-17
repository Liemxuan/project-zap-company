'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/genesis/molecules/dialog';
import CateDetail from './detail/cateDetail';

// Components
import { getColumns } from './components/columns';
import { CategoryInspector } from './components/inspector';

// Hooks
import { useCategories } from '@/hooks/category/use-categories';

// Locales
import en from '@/locale/category/en';
import vi from '@/locale/category/vi';

/**
 * Category Template
 * Route: /design/[theme]/organisms/categories
 */
export default function PageCategoryTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';
    const pathname = usePathname();
    const router = useRouter();

    const lang = searchParams.get('lang');
    const t = lang === 'vi' ? vi : en;

    const pageParam = searchParams.get('p');
    const initialPage = pageParam ? parseInt(pageParam) : 1;

    // --- State ---
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    // --- Data Fetching ---
    const {
        categories,
        isLoading,
        pagination,
        handlePageChange: baseHandlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters,
        refresh
    } = useCategories({
        pageSize: 10,
        initialPage
    });

    const handlePageChange = (index: number) => {
        baseHandlePageChange(index);
        const params = new URLSearchParams(searchParams.toString());
        params.set('p', index.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // --- Handlers ---
    const handleAction = async (type: string, item: any) => {
        setSelectedItem(item);
        if (type === 'edit') {
            setIsEditing(true);
        } else if (type === 'view') {
            setIsViewing(true);
        } else if (type === 'delete') {
            console.log('Delete category:', item.id);
        }
    };

    // --- Data Mapping ---
    const MAPPED_CATEGORIES = useMemo(() => categories.map(cat => ({
        ...cat,
        id: cat.id,
        name: cat.name,
        media_url: cat.media_url,
        acronymn: cat.acronymn || (cat.name ? cat.name.split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2) : 'CAT'),
        item_count: cat.item_count ?? 0,
        is_active: cat.is_active ?? true
    })), [categories]);

    const columns = useMemo(() => getColumns({ t, handleAction }), [t]);

    const labels = useMemo(() => ({
        addItem: t.label_addCategory || "Add Category",
        itemName: t.label_categoryName || "Category Name",
        itemCode: "Slug",
        category: "Parent",
        type: t.label_status || "Status",
        inventory: t.column_itemCount || "Items",
        price: "Internal ID"
    }), [t]);

    const tableComponent = (
        <ListTable
            initialItems={MAPPED_CATEGORIES as any}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onPageChange={(p) => handlePageChange(p + 1)}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            columns={columns as any}
            labels={labels}
            onAddClick={() => setIsCreating(true)}
        />
    );

    const renderCategoryDialog = (
        mode: 'create' | 'edit' | 'view',
        open: boolean,
        setOpen: (open: boolean) => void
    ) => {
        let title = '';
        switch (mode) {
            case "create":
                title = t.dialog_createCategory || 'Create Category';
                break;
            case "edit":
                title = t.dialog_editCategory || 'Edit Category';
                break;
            case "view":
                title = t.dialog_viewCategory || 'Category Detail';
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
                        <CateDetail
                            key={mode === 'create' ? 'create' : selectedItem?.id}
                            mode={mode}
                            item={itemToPass}
                            onCancel={() => setOpen(false)}
                            onSave={() => {
                                setOpen(false);
                                refresh();
                            }}
                            t={t}
                            refresh={refresh}
                        />
                    </DialogBody>
                </DialogContent>
            </Dialog>
        );
    };

    const InspectorPanel = (
        <CategoryInspector
            t={t}
            inspectorState={inspectorState}
            setInspectorState={setInspectorState}
            apiFilters={apiFilters}
            handleFilterChange={handleFilterChange}
        />
    );

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
            {/* Nav */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Icon name="bolt" size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-on-surface uppercase">{t.nav_zapOs || 'ZAP OS'}</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>{t.nav_overview || 'Overview'}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="category" size={18} />
                        <span>{t.nav_categories || 'Categories'}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="inventory" size={18} />
                        <span>{t.nav_catalog || 'Products'}</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">{t.nav_catalog || 'Catalog'}</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">{t.nav_categories || 'Categories'}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {tableComponent}
                </div>
            </div>

            {/* Side Drawer Filter */}
            {InspectorPanel}
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title={t.nav_categories || "Categories"} badge={null} />
                    <div className="flex-1 overflow-auto pt-8 px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {tableComponent}
                    </div>
                </div>
                {InspectorPanel}
                {renderCategoryDialog('create', isCreating, setIsCreating)}
                {renderCategoryDialog('edit', isEditing, setIsEditing)}
                {renderCategoryDialog('view', isViewing, setIsViewing)}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="Categories"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/categories/PageCategories.tsx"
            importPath="@/genesis/templates/tables/categories/PageCategories"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    {InspectorPanel}
                </div>
            }
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title={t.categories_collection_title || "Categories // Collection"}
                    fullScreenHref={`/design/${activeTheme}/organisms/categories?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
            {renderCategoryDialog('create', isCreating, setIsCreating)}
            {renderCategoryDialog('edit', isEditing, setIsEditing)}
            {renderCategoryDialog('view', isViewing, setIsViewing)}
        </ComponentSandboxTemplate>
    );
}
