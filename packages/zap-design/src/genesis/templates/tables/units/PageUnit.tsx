import React, { useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/genesis/molecules/dialog';
import { Heading } from '@/genesis/atoms/typography/headings';
import UnitDetail from './detail/unitDetail';
import { useUnits } from '@/hooks/unit/use-units';
import { Unit } from '@/services/unit/unit.model';
import { getUnitColumns } from './components/columns';
import { getUnitFilterGroups } from './components/filters';
import { UnitInspector } from './components/inspector';

// Locales
import en from '@/locale/unit/en';
import vi from '@/locale/unit/vi';
import { unitService } from '@/services/unit/unit.service';

/**
 * PageUnitTemplate
 * Standardized Administrative Module for Units of Measure (UOM)
 */
export default function PageUnitTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    const pageParam = searchParams.get('p');
    const initialPage = pageParam ? parseInt(pageParam) : 1;

    const lang = searchParams.get('lang');
    const t = lang === 'vi' ? vi : en;

    // --- State ---
    const [selectedItem, setSelectedItem] = useState<Unit | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    // --- Data Fetching ---
    const {
        units,
        isLoading,
        pagination,
        handlePageChange: baseHandlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters,
        refresh
    } = useUnits({
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
    const handleEdit = async (item: Unit) => {
        setIsFetchingDetail(true);
        try {
            const res = await unitService.getUnitDetail(item.id);
            if (res.success) {
                setSelectedItem(res.data);
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Failed to fetch unit detail:', error);
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const handleView = async (item: Unit) => {
        setIsFetchingDetail(true);
        try {
            const res = await unitService.getUnitDetail(item.id);
            if (res.success) {
                setSelectedItem(res.data);
                setIsViewing(true);
            }
        } catch (error) {
            console.error('Failed to fetch unit detail:', error);
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const handleDelete = (item: Unit) => {
        console.log('Delete item:', item);
    };

    const handleFilterToggle = (groupId: string, optionId: string) => {
        const currentVal = (apiFilters as any)[groupId];
        handleFilterChange({ [groupId]: currentVal === optionId ? null : optionId });
    };

    // --- Mapped Data & Columns ---
    const columns = useMemo(() => getUnitColumns(handleEdit, handleDelete, handleView, t), [handleEdit, handleDelete, handleView, t]);
    const filterGroups = useMemo(() => getUnitFilterGroups(apiFilters, t), [apiFilters, t]);

    const tableComponent = (
        <ListTable
            initialItems={units as any}
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
                addItem: t.label_addUnit,
                itemName: t.label_unitName,
                type: t.label_status
            }}
            onAddClick={() => setIsCreating(true)}
        />
    );

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <UnitInspector
                selectedUnit={selectedItem}
                filters={filterGroups}
                onFilterToggle={handleFilterToggle}
                t={t}
            />
        </div>
    );

    const renderUnitDialog = (
        mode: 'create' | 'edit' | 'view',
        open: boolean,
        setOpen: (open: boolean) => void
    ) => {
        var title = '';
        switch (mode) {
            case "create":
                title = t.dialog_createUnit;
                break;
            case "edit":
                title = t.dialog_editUnit;
                break;
            case "view":
                title = t.dialog_viewUnit;
                break;
        }
        const itemToPass = mode === 'create' ? null : selectedItem;

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="max-w-[800px] w-full p-0 border-none rounded-2xl bg-white shadow-2xl overflow-hidden"
                    showClose={true}
                    closeButtonPosition="header-left"
                    closeButtonShape='circle'
                >
                    <DialogHeader className='relative py-8 bg-surface/5'>
                        <div className='w-full text-center'>
                            <DialogTitle className='text-transform-primary text-on-surface font-bold'>
                                {title}
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <DialogBody className="p-0">
                        <UnitDetail
                            key={mode === 'create' ? 'create' : selectedItem?.id}
                            mode={mode}
                            item={itemToPass}
                            onCancel={() => setOpen(false)}
                            onSave={() => {
                                setOpen(false);
                                refresh();
                            }}
                            t={t}
                        />
                    </DialogBody>
                </DialogContent>
            </Dialog>
        );
    };

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
            {/* Sidebar Mock */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Icon name="bolt" size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-on-surface uppercase">{t.nav_zapOs}</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>{t.nav_overview}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="settings" size={18} />
                        <span>{t.nav_settings}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="straighten" size={18} />
                        <span>{t.nav_unitsOfMeasure}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">{t.nav_inventory}</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">{t.nav_units}</span>
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
                    <ThemeHeader title={t.nav_unitsOfMeasure} badge={null} />
                    <div className="flex-1 overflow-auto pt-8 px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {tableComponent}
                    </div>
                </div>
                {rightDrawerContent}
                {renderUnitDialog('create', isCreating, setIsCreating)}
                {renderUnitDialog('edit', isEditing, setIsEditing)}
                {renderUnitDialog('view', isViewing, setIsViewing)}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="Units-Management"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/units/PageUnit.tsx"
            importPath="@/genesis/templates/tables/units/PageUnit"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    <UnitInspector
                        selectedUnit={selectedItem}
                        filters={filterGroups}
                        onFilterToggle={handleFilterToggle}
                        t={t}
                    />
                </div>
            }
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title={t.unit_collection_title}
                    fullScreenHref={`/design/${activeTheme}/organisms/units?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
            {renderUnitDialog('create', isCreating, setIsCreating)}
            {renderUnitDialog('edit', isEditing, setIsEditing)}
            {renderUnitDialog('view', isViewing, setIsViewing)}
        </ComponentSandboxTemplate>
    );
}
