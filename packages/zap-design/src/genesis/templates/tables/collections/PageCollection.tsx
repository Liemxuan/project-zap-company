'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/genesis/molecules/dialog';
import CollectionDetail from './detail/collectionDetail';

// Hooks
import { useCollections } from '@/hooks/collection/use-collections';
// Locales
import en from '@/locale/collection/en';
import vi from '@/locale/collection/vi';
import { Collection } from '@/services/collection/collection.model';

// Components
import { getColumns } from './components/columns';
import { getFilterGroups } from './components/filters';
import { CollectionInspector } from './components/inspector';
import { collectionService } from '@/services/collection/collection.service';
import { Heading } from '@/genesis/atoms/typography/headings';
import { Button } from '@/genesis/atoms/interactive/button';

/**
 * Collection Template
 * Route: /design/[theme]/organisms/collections
 */
export default function PageCollectionTemplate() {
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';
    const lang = searchParams.get('lang');
    const t = lang === 'vi' ? vi : en;

    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';

    // --- State ---
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Collection | null>(null);

    // --- Data Fetching ---
    const {
        collections,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = useCollections({
        pageSize: 10
    });

    // --- Handlers ---
    const handleAction = (type: string, item: Collection | null) => {
        console.log(`Action: ${type} on item:`, item);
        if (type === 'create') {
            setSelectedItem(null);
            setIsCreating(true);
        }
    };

    const handleView = async (item: Collection) => {
        setIsFetchingDetail(true);
        try {
            const res = await collectionService.getCollectionDetail(item.id);
            if (res.success) {
                setSelectedItem(res.data);
                setIsViewing(true);
            }
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const handleEdit = async (item: Collection) => {
        setIsFetchingDetail(true);
        try {
            const res = await collectionService.getCollectionDetail(item.id);
            if (res.success) {
                setSelectedItem(res.data);
                setIsEditing(true);
            }
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'is_active') {
            const val = optionId === 'true';
            handleFilterChange({ is_active: apiFilters.is_active === val ? null : val });
        }
    };

    // --- Memorized Data ---
    const columns = useMemo(() => getColumns({
        t,
        onAction: handleAction,
        onEdit: handleEdit,
        onView: handleView
    }), [t]);
    const filterGroups = useMemo(() => getFilterGroups(t, apiFilters), [t, apiFilters]);

    // --- Shared Components ---
    const TableTable = (
        <ListTable
            initialItems={collections as any}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onPageChange={(p) => handlePageChange(p + 1)}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            columns={columns as any}
            labels={{
                addItem: t.label_addCollection,
                itemName: t.label_collectionName,
                type: t.label_status
            }}
            onAddClick={() => handleAction('create', null)}
        />
    );

    const InspectorPanel = (
        <CollectionInspector
            t={t}
            inspectorState={inspectorState}
            setInspectorState={setInspectorState}
            filterGroups={filterGroups}
            onFilterToggle={handleFilterToggle}
        />
    );

    const renderCollectionDialog = (
        mode: 'create' | 'edit' | 'view',
        open: boolean,
        setOpen: (open: boolean) => void
    ) => {
        let title = '';
        switch (mode) {
            case "create":
                title = t.dialog_createCollection;
                break;
            case "edit":
                title = t.dialog_editCollection;
                break;
            case "view":
                title = t.dialog_viewCollection;
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
                        <div className='absolute right-4 top-1/2 -translate-y-1/2 flex gap-2'>
                            <Button variant="destructive" size="md" className="text-transform-primary px-5 rounded-lg shadow-sm border" onClick={() => setOpen(false)}>
                                {t.btn_cancel}
                            </Button>
                            {mode !== 'view' && (
                                <Button variant="primary" size="md" className="text-transform-primary px-5 rounded-lg shadow-sm" onClick={() => setOpen(false)}>
                                    {mode === 'create' ? t.btn_create : t.btn_save}
                                </Button>
                            )}
                        </div>
                    </DialogHeader>
                    <DialogBody className="flex-1 flex flex-col p-0 overflow-hidden">
                        <CollectionDetail
                            key={mode === 'create' ? 'create' : selectedItem?.id}
                            mode={mode}
                            item={itemToPass}
                            onCancel={() => setOpen(false)}
                            onSave={() => setOpen(false)}
                        />
                    </DialogBody>
                </DialogContent>
            </Dialog>
        );
    };

    // --- Layouts ---

    // 1. Mock Shell Layout (Internal to the template)
    const mockShellLayout = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative text-on-surface">
            {/* Nav */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Icon name="bolt" size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-on-surface uppercase text-transform-none">{t.nav_zapOs}</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>{t.nav_overview}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="settings" size={18} />
                        <span>{t.nav_settings}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="collections" size={18} />
                        <span>{t.nav_collections}</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">{t.nav_zapOs}</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">{t.nav_collections}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {TableTable}
                </div>
            </div>

            {InspectorPanel}
        </div>
    );

    // --- Rendering ---

    const dialogs = (
        <>
            {renderCollectionDialog('create', isCreating, setIsCreating)}
            {renderCollectionDialog('edit', isEditing, setIsEditing)}
            {renderCollectionDialog('view', isViewing, setIsViewing)}
        </>
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title={t.nav_collections} badge={null} />
                    <div className="flex-1 overflow-auto pt-8 px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {TableTable}
                    </div>
                </div>
                {InspectorPanel}
                {dialogs}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName={t.nav_collections}
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/collections/PageCollection.tsx"
            importPath="@/genesis/templates/tables/collections/PageCollection"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    <CollectionInspector
                        t={t}
                        inspectorState={inspectorState}
                        setInspectorState={setInspectorState}
                        filterGroups={filterGroups}
                        onFilterToggle={handleFilterToggle}
                    />
                </div>
            }
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title={t.collection_title}
                    fullScreenHref={`/design/${activeTheme}/organisms/collections?fullscreen=true`}
                >
                    {mockShellLayout}
                </CanvasDesktop>
            </div>
            {dialogs}
        </ComponentSandboxTemplate>
    );
}
