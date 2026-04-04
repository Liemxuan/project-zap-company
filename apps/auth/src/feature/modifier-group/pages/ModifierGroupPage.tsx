'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from 'zap-design/src/components/ThemeContext';
import { AppShell } from 'zap-design/src/zap/layout/AppShell';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
import { Inspector } from 'zap-design/src/zap/layout/Inspector';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'zap-design/src/genesis/molecules/accordion';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';
import { ModifierGroupTableExpanded, type ModifierGroupFilters } from '../components/ModifierGroupTableExpanded';
import { useModifierGroups } from '../hooks/use-modifier-groups';
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

export function ModifierGroupPage({ merchant }: Props) {
  const { inspectorState, setInspectorState } = useTheme();
  const { t, lang, loading: tLoading } = useTranslation('modifier_group');
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  const [filters, setFilters] = useState<ModifierGroupFilters>({
    status: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { modifierGroups, loading, total: totalRecords } = useModifierGroups(currentPage, pageSize, filters);
  const totalPages = Math.ceil(totalRecords / (pageSize || 10));

  if (tLoading) return null;

  // Derive filter groups
  const baseGroups: DataFilterGroup[] = [
    {
      id: 'active',
      title: t('filter_status', 'Status'),
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
      selected: filters.status.includes(opt.id as any)
    }))
  }));

  const handleFilterToggle = (groupId: string, optionId: string) => {
    setFilters(current => {
      const currentList = current.status;
      const updatedList = currentList.includes(optionId as any)
        ? currentList.filter(id => id !== optionId)
        : [...currentList, optionId as any];
      setCurrentPage(1);
      return {
        ...current,
        status: updatedList
      };
    });
  };

  const inspectorContent = (
    <Inspector title={t('lbl_inspector_title', 'MODIFIER GROUPS')} width={320}>
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
                <span className="truncate uppercase">{t('filter', 'Filters')}</span>
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
    <ModifierGroupTableExpanded
      modifierGroups={modifierGroups}
      loading={loading}
      filters={filters}
      currentPage={currentPage}
      pageSize={pageSize}
      totalRecords={totalRecords}
      totalPages={totalPages}
      onFilterChange={(newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
      }}
      onPageChange={setCurrentPage}
      onPageSizeChange={(newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
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
        {/* Header - Global Admin Breadcrumb */}
        <div className="bg-layer-panel">
          <ThemeHeader
            title={t('title', 'Modifier Group Management')}
            breadcrumb={`zap inc. / ${merchant ? `${merchant} / ` : ''}${t('breadcrumb', 'Inventory / modifier groups')}`}
            badge={t('badge', 'verified')}
            liveIndicator={true}
            showBackground={false}
          />
        </div>

        {/* Content - Toggle between Sandbox and Fullscreen look */}
        <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-16 lg:px-24 pb-24 flex flex-col relative z-0 bg-white">
          {!isFullscreen ? (
            <CanvasDesktop
              title={t('canvas_title', 'Modifier Group Datagrid // Assembly')}
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
