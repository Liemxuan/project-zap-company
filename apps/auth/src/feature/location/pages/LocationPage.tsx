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
}

export function LocationPage({ merchant }: Props) {
  const { inspectorState, setInspectorState } = useTheme();
  const { t, lang, loading: tLoading } = useTranslation('location');
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  const [filters, setFilters] = useState<LocationFilters>({
    status: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { locations, loading, total } = useLocations(1, 100);

  if (tLoading) return null;

  // Derive filter groups
  const baseGroups: DataFilterGroup[] = [
    {
      id: 'status',
      title: 'Status',
      options: Array.from(new Set(locations.map(l => l.status))).map(status => ({
        id: status,
        label: status,
      }))
    },
    {
      id: 'city',
      title: 'City',
      options: Array.from(new Set(locations.map(l => l.city))).map(city => ({
        id: city,
        label: city,
      }))
    }
  ];

  // Map current state onto filter groups
  const filterGroups = baseGroups.map(group => ({
    ...group,
    options: group.options.map(opt => ({
      ...opt,
      selected: group.id === 'status' 
        ? filters.status.includes(opt.id)
        : false 
    }))
  }));

  const handleFilterToggle = (groupId: string, optionId: string) => {
    if (groupId === 'status') {
      setFilters(current => {
        const currentList = current.status;
        const updatedList = currentList.includes(optionId)
          ? currentList.filter(id => id !== optionId)
          : [...currentList, optionId];
        setCurrentPage(1);
        return { ...current, status: updatedList };
      });
    }
  };

  const inspectorContent = (
    <Inspector title="LOCATIONS LAB" width={320}>
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
            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-[11px] uppercase tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
              <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                <span className="truncate">FILTERS</span>
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
      totalRecords={total}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={(newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
      }}
      t={t}
      lang={lang}
    />
  );

  return (
    <AppShell inspector={inspectorContent}>
      <div className="flex flex-col w-full h-full overflow-hidden bg-white">
        <div className="bg-layer-panel">
          <ThemeHeader
            title="locations assembly"
            breadcrumb={`zap inc. / ${merchant ? `${merchant} / ` : ''}management / assembly`}
            badge="verified"
            liveIndicator={true}
            showBackground={false}
          />
        </div>

        <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-16 lg:px-24 pb-24 flex flex-col relative z-0 bg-white">
          {!isFullscreen ? (
            <CanvasDesktop
              title="Location Datagrid // Assembly"
              fullScreenHref="?fullscreen=true"
            >
              <div className="w-full flex-1 flex flex-col rounded-b-xl overflow-hidden min-h-[600px] p-6 lg:p-12 pb-24">
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
