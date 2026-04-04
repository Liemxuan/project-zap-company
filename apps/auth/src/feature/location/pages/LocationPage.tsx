'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from 'zap-design/src/components/ThemeContext';
import { AppShell } from 'zap-design/src/zap/layout/AppShell';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
import { Inspector } from 'zap-design/src/zap/layout/Inspector';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'zap-design/src/genesis/molecules/accordion';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';
import { LocationTableExpanded, type LocationFilters } from '../components/LocationTableExpanded';
import { useLocations } from '../hooks/use-locations';
import { useTranslation } from '../../../hooks/use-translation';
import { DataFilter, FilterGroup } from 'zap-design/src/genesis/molecules/data-filter';
import { CanvasDesktop } from 'zap-design/src/components/dev/CanvasDesktop';

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  const [filters, setFilters] = useState<LocationFilters>({
    is_active: [],
    warehouse_type: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { locations, loading, totalRecords, totalPages } = useLocations(currentPage, pageSize);

  if (tLoading) return null;

  // Derive filter groups
  const baseGroups: DataFilterGroup[] = [
    {
      id: 'is_active',
      title: t('lbl_active_status', 'Active Status'),
      options: [
        { id: 'active', label: t('status_active', 'Active') },
        { id: 'inactive', label: t('status_inactive', 'Inactive') }
      ]
    }
  ];

  // Map current state onto filter groups
  const filterGroups = baseGroups.map(group => ({
    ...group,
    options: group.options.map(opt => ({
      ...opt,
      selected: group.id === 'is_active' 
        ? filters.is_active?.includes(opt.id === 'active')
        : false
    }))
  }));

  const handleFilterToggle = (groupId: string, optionId: string) => {
    setFilters(current => {
      if (groupId === 'is_active') {
        const val = optionId === 'active';
        const currentList = current.is_active || [];
        const updatedList = currentList.includes(val)
          ? currentList.filter(v => v !== val)
          : [...currentList, val];
        setCurrentPage(1);
        return { ...current, is_active: updatedList };
      }
      return current;
    });
  };

  const inspectorContent = (
    <Inspector title={t('lbl_inspector_title', 'LỌC ĐỊA ĐIỂM')} width={320}>
      <div className="flex flex-col gap-0 w-full px-4 pt-4">
        <Accordion
          type="single"
          collapsible
          variant="navigation"
          value={inspectorState === 'expanded' ? "item-1" : ""}
          onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }}
          className="bg-transparent w-full space-y-2"
        >
          <AccordionItem value="item-1" className="border-none m-0">
            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
              <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                <span className="truncate">{t('filter', 'FILTERS')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
              <DataFilter
                groups={filterGroups as FilterGroup[]}
                onToggle={handleFilterToggle}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Inspector>
  );

  const tableContent = (
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
      onSearchChange={(query) => {
        // Handle search query updates here if needed
        console.log('Search query:', query);
      }}
      onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
      isFilterActive={inspectorState === 'expanded'}
      t={t}
      lang={lang || 'en'}
    />
  );

  return (
    <AppShell inspector={inspectorContent}>
      <div className="flex flex-col w-full h-full overflow-hidden bg-white">
        <div className="bg-layer-panel">
          <ThemeHeader
            title={t('title', 'location management')}
            breadcrumb={`zap inc. / ${merchant ? `${merchant} / ` : ''}${t('breadcrumb', 'inventory / locations')}`}
            badge={t('badge', 'verified')}
            liveIndicator={true}
            showBackground={false}
          />
        </div>

        <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-16 lg:px-24 pb-24 flex flex-col relative z-0 bg-white">
          {!isFullscreen ? (
            <CanvasDesktop
              title={t('canvas_title', 'Location Datagrid // Assembly')}
              fullScreenHref="?fullscreen=true"
            >
              <div className="w-full flex-1 flex flex-col rounded-b-xl overflow-visible min-h-[600px] p-6 lg:p-12 pb-24">
                {tableContent}
              </div>
            </CanvasDesktop>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {tableContent}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
