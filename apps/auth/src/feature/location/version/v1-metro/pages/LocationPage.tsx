'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useTheme } from 'zap-design/src/components/ThemeContext';
import { SideNav } from 'zap-design/src/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
import { CanvasDesktop } from 'zap-design/src/components/dev/CanvasDesktop';
import { Inspector } from 'zap-design/src/zap/layout/Inspector';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'zap-design/src/genesis/molecules/accordion';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';
import { Badge } from 'zap-design/src/genesis/atoms/status/badges';
import { LocationTableExpanded, type LocationFilters } from '../components/LocationTableExpanded';
import { LocationDetail } from '../components/LocationDetail';
import { useLocations } from '../hooks/use-locations';
import { useTranslation } from '../../../hooks/use-translation';
import { DataFilter, FilterGroup } from 'zap-design/src/genesis/molecules/data-filter';

type DataFilterGroup = {
  id: string;
  title: string;
  options: Array<{
    id: string;
    label: string;
    selected?: boolean;
  }>;
};

interface Props {
  merchant?: string;
  lang?: string;
}

export function LocationPage({ merchant }: Props) {
  const { inspectorState, setInspectorState } = useTheme();
  const { t, lang, loading: tLoading } = useTranslation('location');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [filters, setFilters] = useState<LocationFilters>({
    is_active: [],
    location_type_text: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const memoizedFilter = useMemo(() => ({
    filters: filters
  }), [filters]);

  const {
    locations,
    loading,
    totalRecords,
    totalPages,
    handleSearch,
    handleDeleteLocation
  } = useLocations(currentPage, pageSize, memoizedFilter);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  if (tLoading) return null;

  const filterGroups: FilterGroup[] = [
    {
      id: 'is_active',
      title: t('filter_status', 'Status'),
      options: [
        { id: '1', label: t('status_active', 'Active'), selected: filters.is_active?.includes(true) },
        { id: '0', label: t('status_inactive', 'Inactive'), selected: filters.is_active?.includes(false) },
      ]
    },
    {
      id: 'location_type_text',
      title: t('filter_type', 'Location Type'),
      options: [
        { id: 'store', label: t('type_store', 'Store'), selected: filters.location_type_text?.includes('store') },
        { id: 'warehouse', label: t('type_warehouse', 'Warehouse'), selected: filters.location_type_text?.includes('warehouse') },
      ]
    }
  ];

  const handleFilterToggle = (groupId: string, optionId: string) => {
    setFilters(current => {
      const currentList: any[] = (current as any)[groupId] || [];
      const val = groupId === 'is_active' ? optionId === '1' : optionId;
      const updatedList = currentList.includes(val)
        ? currentList.filter(x => x !== val)
        : [...currentList, val];

      const newFilters = { ...current, [groupId]: updatedList };
      setCurrentPage(1);
      return newFilters;
    });
  };

  const inspectorContent = (
    <div className="flex flex-col gap-0 w-full min-w-[320px] px-4 pt-4">
      <Accordion type="single" collapsible variant="navigation" defaultValue="item-1" className="bg-transparent w-full space-y-2">
        <AccordionItem value="item-1" className="border-none m-0">
          <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
            <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
              <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
              <span className="truncate uppercase">{t('filters', 'Filters')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
            <DataFilter title="" groups={filterGroups} onToggle={handleFilterToggle} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  const mainContent = (
    <LocationTableExpanded
      locations={locations}
      loading={loading}
      totalRecords={totalRecords}
      totalPages={totalPages}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={(newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
      }}
      onSearchChange={(q) => handleSearch(q)}
      onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
      onAddLocation={() => setShowAddForm(true)}
      onEditLocation={(location) => {
        setSelectedLocation(location);
        setIsEditing(true);
      }}
      onDeleteLocation={(id) => {
        if (confirm(t('confirm_delete', 'Are you sure you want to delete this location?'))) {
          handleDeleteLocation(id);
        }
      }}
      isFilterActive={inspectorState === 'expanded'}
      t={t}
      lang={lang || 'en'}
    />
  );

  const detailOverlay = (showAddForm || isEditing) && (
    <LocationDetail
      locationId={isEditing ? selectedLocation?.id : undefined}
      onCancel={() => {
        setShowAddForm(false);
        setIsEditing(false);
        setSelectedLocation(null);
      }}
    />
  );

  const layoutContent = (
    <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
      {/* Fake Side Navigation (Parity with Template) */}
      <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
        <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <Icon name="bolt" size={14} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-sm tracking-widest font-display text-transform-primary text-on-surface">ZAP OS</span>
        </div>
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 text-sm text-on-surface cursor-pointer transition-colors">
            <Icon name="dashboard" size={18} className="text-on-surface-variant shrink-0" />
            <span className="font-medium">Overview</span>
          </div>
          <div className="px-3 py-2.5 rounded-md text-on-surface hover:bg-surface-variant/40 flex items-center gap-3 text-sm cursor-pointer transition-colors">
            <Icon name="list_alt" size={18} className="shrink-0 text-on-surface-variant" />
            <span className="font-medium">System Logs</span>
          </div>
          <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 text-sm cursor-pointer border border-primary/20 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md"></div>
            <Icon name="corporate_fare" size={18} className="shrink-0" />
            <span className="font-medium">Locations</span>
          </div>
          <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 text-sm text-on-surface cursor-pointer transition-colors">
            <Icon name="settings" size={18} className="text-on-surface-variant shrink-0" />
            <span className="font-medium">Configuration</span>
          </div>
        </div>
        <div className="p-4 border-t border-border mt-auto bg-surface-variant/30">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-layer-base border border-border flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold">ZT</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate text-on-surface">Zeus Tom</span>
              <span className="text-[10px] text-on-surface-variant truncate tracking-wide">CSO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
        {/* Fake Header */}
        <div className="h-14 border-b border-border bg-layer-base flex items-center px-4 lg:px-6 justify-between shrink-0 shadow-sm z-10 relative">
          <div className="flex items-center">
            <button title="Menu" aria-label="Menu" className="md:hidden mr-2 -ml-2 shrink-0 p-2 hover:bg-surface-variant rounded-md transition-colors text-on-surface-variant">
              <Icon name="menu" size={20} />
            </button>
            <div className="flex items-center text-xs lg:text-sm">
              <span className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Catalog</span>
              <Icon name="chevron_right" size={16} className="text-on-surface-variant/50 mx-1 shrink-0" />
              <span className="font-medium text-on-surface">Locations</span>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-4 font-body">
            <button title="Notifications" aria-label="Notifications" className="relative w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors text-on-surface-variant">
              <Icon name="notifications" size={18} />
            </button>
            <div className="h-6 w-px bg-border my-auto hidden sm:block" />
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold leading-tight">us-west-1</span>
              <span className="text-[9px] tracking-widest text-green-500 font-dev text-transform-tertiary mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Healthy
              </span>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0 min-w-0 bg-layer-base">
          {mainContent}
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="flex h-screen w-full relative overflow-hidden bg-layer-canvas selection:bg-primary/10 transition-colors duration-300">
        <SideNav />
        <div className="flex-1 flex flex-col h-screen min-w-0 relative">
          <div className="sticky top-0 z-40 bg-layer-base/80 backdrop-blur-md border-b border-outline-variant">
            <ThemeHeader
              title={t('page_title_locations_assembly', 'LOCATIONS ASSEMBLY')}
              breadcrumb="ZAP DESIGN ENGINE / METRO / LAYOUT"
              badge="COMPONENT SANDBOX"
              showBackground={false}
            />
          </div>
          <div className="flex-1 flex flex-col pt-8 px-4 lg:pt-11 lg:px-12 pb-16 overflow-auto bg-layer-base">
            {mainContent}
          </div>
        </div>
        {inspectorState === 'expanded' && (
          <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative animate-in slide-in-from-right duration-300">
            <Inspector title={t('inspector_title', 'LOCATIONS CONSOLE')} width={320}>
              {inspectorContent}
            </Inspector>
          </div>
        )}
        {detailOverlay}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full relative bg-layer-canvas overflow-hidden font-sans">
      <SideNav />
      <div className="flex-1 flex flex-col h-screen min-w-0 relative">
        <div className="sticky top-0 z-40 bg-layer-base border-b border-border">
          <ThemeHeader
            title={t('page_title_locations', 'Locations')}
            breadcrumb="CATALOG / LOCATIONS"
            badge="LOCATION MANAGEMENT"
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
          <CanvasDesktop
            title={t('canvas_title_locations', 'Location Registry // Overview')}
            fullScreenHref={`${pathname}?fullscreen=true`}
          >
            {layoutContent}
          </CanvasDesktop>
        </div>
      </div>
      {inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
          <Inspector title={t('inspector_title', 'LOCATIONS CONSOLE')} width={320}>
            {inspectorContent}
          </Inspector>
        </div>
      )}
      {detailOverlay}
    </div>
  );
}
