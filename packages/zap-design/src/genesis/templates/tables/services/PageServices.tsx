import React, { useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { useServices } from '@/hooks/service/use-services';
import { Service } from '@/services/service/service.model';
import { getServiceColumns } from './components/columns';
import { getServiceFilterGroups } from './components/filters';
import { ServiceInspector } from './components/inspector';

// Locales
const en = {
    label_name: "Name",
    label_price: "Price",
    label_category: "Category",
    label_status: "Status",
    label_addService: "Add Service",
    label_inspector: "Inspector",
    label_filters: "Filters",
    status_active: "Active",
    status_inactive: "Inactive",
    category_housekeeping: "Housekeeping",
    category_dining: "Dining",
    category_maintenance: "Maintenance",
    msg_selectService: "Select a service to view details",
    nav_zapOs: "ZAP OS",
    nav_overview: "Overview",
    nav_settings: "Settings",
    nav_services: "Services",
    nav_setup: "Setup"
};

const vi = {
    label_name: "Tên",
    label_price: "Giá",
    label_category: "Danh mục",
    label_status: "Trạng thái",
    label_addService: "Thêm dịch vụ",
    label_inspector: "Kiểm tra",
    label_filters: "Bộ lọc",
    status_active: "Hoạt động",
    status_inactive: "Ngừng",
    category_housekeeping: "Dọn dẹp",
    category_dining: "Ăn uống",
    category_maintenance: "Bảo trì",
    msg_selectService: "Chọn một dịch vụ để xem chi tiết",
    nav_zapOs: "ZAP OS",
    nav_overview: "Tổng quan",
    nav_settings: "Cài đặt",
    nav_services: "Dịch vụ",
    nav_setup: "Thiết lập"
};

export default function PageServicesTemplate() {
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
    const [selectedItem, setSelectedItem] = useState<Service | null>(null);

    // --- Data Fetching ---
    const {
        services,
        isLoading,
        pagination,
        handlePageChange: baseHandlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters,
        refresh
    } = useServices({
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
    const handleEdit = (item: Service) => {
        setSelectedItem(item);
    };

    const handleView = (item: Service) => {
        setSelectedItem(item);
    };

    const handleDelete = (item: Service) => {
        console.log('Delete item:', item);
    };

    const handleFilterToggle = (groupId: string, optionId: string) => {
        const currentVal = (apiFilters as any)[groupId];
        handleFilterChange({ [groupId]: currentVal === optionId ? null : optionId });
    };

    // --- Mapped Data & Columns ---
    const columns = useMemo(() => getServiceColumns(handleEdit, handleDelete, handleView, t), [t]);
    const filterGroups = useMemo(() => getServiceFilterGroups(apiFilters, t), [apiFilters, t]);

    const tableComponent = (
        <ListTable
            initialItems={services as any}
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
                addItem: t.label_addService,
                itemName: t.label_name,
                type: t.label_status
            }}
            onAddClick={() => console.log('Add clicked')}
        />
    );

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <ServiceInspector
                selectedService={selectedItem}
                filters={filterGroups}
                onFilterToggle={handleFilterToggle}
                t={t}
            />
        </div>
    );

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Icon name="bolt" size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-on-surface uppercase">{t.nav_zapOs}</span>
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
                        <Icon name="payments" size={18} />
                        <span>{t.nav_services}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">{t.nav_setup}</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">{t.nav_services}</span>
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
                    <ThemeHeader title={t.nav_services} badge={null} />
                    <div className="flex-1 overflow-auto pt-8 px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {tableComponent}
                    </div>
                </div>
                {rightDrawerContent}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="Service-Management"
            tier="L6 LAYOUT"
            status="In Progress"
            filePath="src/genesis/templates/tables/services/PageServices.tsx"
            importPath="@/genesis/templates/tables/services/PageServices"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    <ServiceInspector
                        selectedService={selectedItem}
                        filters={filterGroups}
                        onFilterToggle={handleFilterToggle}
                        t={t}
                    />
                </div>
            }
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Service Configuration // List View"
                    fullScreenHref={`/design/${activeTheme}/organisms/services?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
