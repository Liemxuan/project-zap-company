'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
import { SideNav } from 'zap-design/src/genesis/molecules/navigation/SideNav';
import { ProductTableExpanded, type ProductFilters } from '../components/ProductTableExpanded';
import { useProducts } from '../hooks/use-products';
import { useTranslation } from '../../../hooks/use-translation';
import { Inspector } from 'zap-design/src/zap/layout/Inspector';
import { DataFilter, FilterGroup } from 'zap-design/src/genesis/molecules/data-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'zap-design/src/genesis/molecules/accordion';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';

function FilterPanel({ filterGroups, onToggle }: { filterGroups: FilterGroup[], onToggle: (groupId: string, optionId: string) => void }) {
  return (
    <Accordion type="single" collapsible variant="navigation" defaultValue="item-1" className="bg-transparent w-full space-y-2">
      <AccordionItem value="item-1" className="border-none m-0">
        <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
          <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
            <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
            <span className="truncate">FILTERS</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
          <DataFilter title="" groups={filterGroups} onToggle={onToggle} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function ProductPage() {
  const { t, lang } = useTranslation('product');
  const searchParams = useSearchParams();
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  const [filters, setFilters] = useState<ProductFilters>({
    category: [],
    status: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [inspectorState, setInspectorState] = useState<'expanded' | 'collapsed'>('expanded');

  const { products, loading, totalRecords, totalPages } = useProducts(currentPage, pageSize);

  const categories = Array.from(new Set(products.map(p => p.cate_name).filter(Boolean)));
  const statuses = Array.from(new Set(products.map(p => p.status.toString())));

  const baseGroups: FilterGroup[] = [
    {
      id: 'category',
      title: 'Category',
      options: categories.map(cat => ({ id: cat, label: cat }))
    },
    {
      id: 'status',
      title: 'Status',
      options: statuses.map(s => ({ id: s, label: t(`status_${s}`, s) }))
    }
  ];

  const filterGroups = baseGroups.map(group => ({
    ...group,
    options: group.options.map(opt => ({
      ...opt,
      selected: (filters[group.id as keyof ProductFilters] || []).includes(opt.id)
    }))
  }));

  const handleFilterToggle = (groupId: string, optionId: string) => {
    setFilters(current => {
      const currentList = current[groupId as keyof ProductFilters] || [];
      const updatedList = currentList.includes(optionId)
        ? currentList.filter(id => id !== optionId)
        : [...currentList, optionId];
      return {
        ...current,
        [groupId as keyof ProductFilters]: updatedList
      };
    });
    setCurrentPage(1);
  };

  const rightDrawerContent = inspectorState === 'expanded' && (
      <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
          <Inspector title="CATALOG SETTINGS" width={320}>
              <div className="flex flex-col gap-0 w-full px-4 pt-4">
                  <FilterPanel filterGroups={filterGroups} onToggle={handleFilterToggle} />
              </div>
          </Inspector>
      </div>
  );
  const tableContent = (
    <ProductTableExpanded
      products={products}
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
      isFilterActive={inspectorState === 'expanded'}
      onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
      t={t}
      lang={lang || 'en'}
    />
  );

  // Fullscreen mode - 100% layout like port 3000
  if (isFullscreen) {
    return (
      <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
        {/* Left Sidebar - Design System Navigation */}
        <SideNav />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
          {/* Header */}
          <ThemeHeader
            title="PRODUCT LIST ASSEMBLY"
            breadcrumb="zap inc. / management / catalog / product-list"
            badge="verified"
            liveIndicator={true}
            showBackground={false}
          />

          {/* Content */}
          <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
            {tableContent}
          </div>
        </div>
        {rightDrawerContent}
      </div>
    );
  }

  // Default mode - Centered sandbox view
  return (
    <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
      {/* Left Sidebar - Design System Navigation */}
      <SideNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        {/* Header */}
        <ThemeHeader
          title="PRODUCT LIST ASSEMBLY"
          breadcrumb="zap inc. / management / catalog / product-list"
          badge="component sandbox"
          liveIndicator={true}
          showBackground={false}
        />

        <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
          {tableContent}
        </div>
      </div>
      {rightDrawerContent}
    </div>
  );
}
