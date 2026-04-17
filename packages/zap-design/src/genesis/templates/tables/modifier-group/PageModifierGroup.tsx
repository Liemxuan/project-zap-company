'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/genesis/molecules/dialog';
import ModifierGroupDetail from './detail/ModifierGroupDetail';

// Hooks
import { useModifierGroups } from '@/hooks/modifier-group/use-modifier-groups';
import { ModifierGroup } from '@/services/modifier-group/modifier-group.model';

// Components
import { getModifierGroupColumns } from './components/columns';
import { getModifierGroupFilterGroups } from './components/filters';
import { ModifierGroupInspector } from './components/inspector';

// Locales
import en from '@/locale/modifier-group/en';
import vi from '@/locale/modifier-group/vi';

/**
 * PageModifierGroupTemplate
 * Standardized Administrative Module for Modifier Groups
 */
export default function PageModifierGroupTemplate() {
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
    const [selectedItem, setSelectedItem] = useState<ModifierGroup | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    // --- Data Fetching ---
    const {
        modifierGroups,
        isLoading,
        pagination,
        handlePageChange: baseHandlePageChange,
        handleSearch,
        handleFilterChange,
        refresh
    } = useModifierGroups({
        pageSize: 10,
        initialPage
    });

    const apiFilters = pagination.filters;

    const handlePageChange = (index: number) => {
        baseHandlePageChange(index);
        const params = new URLSearchParams(searchParams.toString());
        params.set('p', index.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // --- Handlers ---
    const handleAction = (type: string, item: any) => {
        setSelectedItem(item);
        if (type === 'create') {
            setSelectedItem(null);
            setIsCreating(true);
        } else if (type === 'edit') {
            setIsEditing(true);
        } else if (type === 'view') {
            setIsViewing(true);
        } else if (type === 'delete') {
            console.log('Delete item:', item.id);
        }
    };

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'status') {
            const currentStatus = (apiFilters.status as string[]) || [];
            const newStatus = currentStatus.includes(optionId)
                ? currentStatus.filter(s => s !== optionId)
                : [...currentStatus, optionId];
            handleFilterChange({ status: newStatus.length > 0 ? newStatus : null });
        }
    };

    const handleRowClick = (item: any) => {
        setSelectedItem(item as ModifierGroup);
        setIsViewing(true);
    };

    // --- Mapped Data & Columns ---
    const columns = useMemo(() => getModifierGroupColumns(handleAction), []);
    const filterGroups = useMemo(() => getModifierGroupFilterGroups(apiFilters), [apiFilters]);

    const labels = useMemo(() => ({
        addItem: t.label_addModifierItem || "Add Modifier Group",
        itemName: t.label_name || "Modifier Group Name",
        type: "Status"
    }), [t]);

    const tableComponent = (
        <ListTable
            initialItems={modifierGroups}
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
            onRowClick={handleRowClick}
            onAddClick={() => handleAction('create', null)}
        />
    );

    const detailDialog = (
        <Dialog
            open={isCreating || isEditing || isViewing}
            onOpenChange={(open) => {
                if (!open) {
                    setIsCreating(false);
                    setIsEditing(false);
                    setIsViewing(false);
                    setSelectedItem(null);
                }
            }}
        >
            <DialogContent className="max-w-none w-screen h-screen p-0 border-none rounded-none bg-white gap-0" closeButtonPosition="header-left">
                <DialogHeader className='relative py-4 border-b border-outline-variant' closeButtonPosition="header-left" closeButtonClassName='border-none bg-surface hover:bg-surface-variant/60'>
                    <div className='max-w-lg mx-auto text-center'>
                        <DialogTitle className='text-transform-primary text-on-surface py-4'>
                            {isCreating ? t.btn_create : (isEditing ? t.btn_edit : t.btn_view)} {t.title}

                        </DialogTitle>
                    </div>
                </DialogHeader>
                <DialogBody className="flex-1 flex flex-col p-0 overflow-hidden">
                    <ModifierGroupDetail
                        mode={isCreating ? 'create' : (isEditing ? 'edit' : 'view')}
                        item={selectedItem}
                        t={t}
                        onCancel={() => {
                            setIsCreating(false);
                            setIsEditing(false);
                            setIsViewing(false);
                            setSelectedItem(null);
                        }}
                        onSave={(data) => {
                            console.log('Saving modifier group:', data);
                            setIsCreating(false);
                            setIsEditing(false);
                            setIsViewing(false);
                            setSelectedItem(null);
                            refresh();
                        }}
                    />
                </DialogBody>
            </DialogContent>
        </Dialog>
    );

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <ModifierGroupInspector
                selectedItem={selectedItem}
                filters={filterGroups}
                onFilterToggle={handleFilterToggle}
            />
        </div>
    );

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
            {/* Sidebar Mock */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Icon name="bolt" size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-on-surface uppercase">ZAP OS</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>Overview</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="settings_input_component" size={18} />
                        <span>Modifier Groups</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">{t.subtitle}</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">{t.title}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {tableComponent}
                </div>
            </div>
            {rightDrawerContent}
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title={t.title} badge={null} />
                    <div className="flex-1 overflow-auto pt-8 px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {tableComponent}
                    </div>
                </div>
                {rightDrawerContent}
                {detailDialog}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="Modifier-groups"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/modifier-group/PageModifierGroup.tsx"
            importPath="@/genesis/templates/tables/modifier-group/PageModifierGroup"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    <ModifierGroupInspector
                        selectedItem={selectedItem}
                        filters={filterGroups}
                        onFilterToggle={handleFilterToggle}
                    />
                </div>
            }
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title={`${t.title} // ${t.subtitle}`}
                    fullScreenHref={`/design/${activeTheme}/organisms/modifier-groups?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
            {detailDialog}
        </ComponentSandboxTemplate>
    );
}
