'use client';

import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AppShell } from 'zap-design/src/zap/layout/AppShell';
import { Inspector } from 'zap-design/src/zap/layout/Inspector';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
import { CanvasDesktop } from 'zap-design/src/components/dev/CanvasDesktop';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from 'zap-design/src/genesis/atoms/data-display/table';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Badge } from 'zap-design/src/genesis/atoms/interactive/badge';
import {
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from 'zap-design/src/genesis/molecules/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'zap-design/src/genesis/atoms/interactive/select';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from 'zap-design/src/genesis/molecules/accordion';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';
import { DataFilter, FilterGroup } from 'zap-design/src/genesis/molecules/data-filter';
import { cn } from 'zap-design/src/lib/utils';

interface ZapListTableProps<T> {
  // --- Data & Loading ---
  data: T[];
  loading: boolean;

  // --- Header Configuration ---
  header: {
    title: string;
    breadcrumb: string;
    badge?: string;
    liveIndicator?: boolean;
  };

  // --- Canvas Configuration ---
  canvas: {
    title: string;
    fullScreenHref?: string;
  };

  // --- Inspector (Filters) Configuration ---
  filters: {
    title: string;
    groups: any[]; // FilterGroup[]
    onToggle: (groupId: string, optionId: string) => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
    activeCount?: number;
  };

  // --- Toolbar Configuration ---
  toolbar: {
    search: {
      placeholder: string;
      value: string;
      onChange: (val: string) => void;
    };
    action: {
      label: string;
      onClick: () => void;
    };
    statsText?: React.ReactNode;
  };

  // --- Table Configuration ---
  table: {
    columns: any[]; // ColumnDef<T>[]
    onRowClick?: (item: T) => void;
  };

  // --- Pagination Configuration ---
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };

  // --- Localization & Display ---
  t: (key: string, fallback?: string) => string;
  isFullscreen?: boolean;
  fullScreenHref?: string;
  onExitFullscreen?: () => void;
}

/**
 * ZapListTable - The All-In-One Administrative Controller Component.
 * Consolidates Header, Filters (Inspector), Toolbar, Table, and Footer.
 */
export function ZapListTable<T>({
  data,
  loading,
  header,
  canvas,
  filters,
  toolbar,
  table: tableConfig,
  pagination,
  t,
  isFullscreen = false,
  fullScreenHref,
  onExitFullscreen
}: ZapListTableProps<T>) {

  // Initialize TanStack Table internally
  const tableInstance = useReactTable({
    data,
    columns: tableConfig.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Reusable Main UI Block (Toolbar + Table + Pagination)
  const mainContent = (
    <main className="w-full bg-layer-canvas border-outline-variant overflow-hidden border-[1px] rounded-xl flex flex-col flex-1 shadow-sm">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel h-[var(--table-toolbar-height,4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* SEARCH */}
          <div className="relative flex-1 md:w-80 h-11">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              variant="filled"
              placeholder={toolbar.search.placeholder}
              value={toolbar.search.value}
              onChange={(e) => toolbar.search.onChange(e.target.value)}
              className="pl-10 h-11 pt-0.5 text-sm font-body"
            />
          </div>

          {/* FILTER BUTTON */}
          <Button
            variant={filters.isExpanded ? "primary" : "outline"}
            size="sm"
            onClick={filters.onToggleExpand}
            className="relative h-11 px-6 shadow-sm border-outline"
          >
            <Filter className={cn("h-4 w-4 mr-2", filters.isExpanded && "text-on-primary")} />
            <span className="font-display font-medium text-xs uppercase tracking-widest">{t('filter', 'Filter')}</span>
            {(filters.activeCount || 0) > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs rounded-full bg-error text-on-error border-none z-20 shadow-md animate-in zoom-in-50 duration-300">
                {filters.activeCount}
              </Badge>
            )}
          </Button>

          {/* ADD BUTTON */}
          <Button
            variant="primary"
            size="sm"
            onClick={toolbar.action.onClick}
            className="h-11 px-6 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="font-display font-medium text-xs uppercase tracking-widest">{toolbar.action.label}</span>
          </Button>
        </div>
      </div>

      {/* TABLE GRID */}
      <div className="flex-1 flex flex-col bg-layer-cover overflow-hidden min-w-0 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-layer-cover/60 z-30 flex items-center justify-center backdrop-blur-[2px] transition-all">
            <div className="h-8 w-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        <div className="absolute inset-0 [&_[data-slot=table-wrapper]]:h-full [&_[data-slot=table-wrapper]]:overflow-auto scrollbar-thin">
          <Table className="relative bg-transparent border-collapse w-full min-w-max">
            <TableHeader className="bg-layer-panel top-0 z-20 sticky border-b border-border shadow-sm h-12 uppercase">
              {tableInstance.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b-0 hover:bg-transparent transition-none">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="h-12 p-0 bg-layer-panel sticky top-0 z-20 text-left text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-border shadow-sm">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={tableConfig.columns.length} className="h-32 text-center text-muted-foreground font-body py-12">
                    {t('no_records', 'Không tìm thấy kết quả nào.')}
                  </TableCell>
                </TableRow>
              ) : (
                tableInstance.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => tableConfig.onRowClick?.(row.original)}
                    className={cn(
                      "group hover:bg-surface-variant/40 transition-colors border-b border-border/50 h-16 min-h-[4rem]",
                      tableConfig.onRowClick && "cursor-pointer"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-0 whitespace-nowrap text-sm text-slate-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* FOOTER (PAGINATION) */}
      <div className="border-t border-border bg-layer-panel px-7 py-4 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground font-body">
          {/* PAGE SIZE SELECTOR */}
          <div className="flex items-center gap-2">
            <span>{t('show', 'Hiển thị')}</span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(val) => pagination.onPageSizeChange(Number(val))}
            >
              <SelectTrigger size="sm" className="h-8 min-w-[70px] font-mono text-[11px] bg-layer-panel border-outline focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>{t('records_per_table', 'bản ghi trên trang')}</span>
          </div>

          {/* PAGE CONTROLS */}
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">
              {t('page', 'Trang')} {pagination.currentPage} {t('of', 'trong')} {pagination.totalPages}
            </span>
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    className={cn(
                      "h-8 px-3 font-mono text-[10px] tracking-widest uppercase cursor-pointer hover:bg-surface-variant border-outline transition-colors",
                      pagination.currentPage === 1 && "pointer-events-none opacity-30"
                    )}
                    onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  >
                    {t('previous', 'Trước')}
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className={cn(
                      "h-8 px-3 font-mono text-[10px] tracking-widest uppercase cursor-pointer hover:bg-surface-variant border-outline transition-colors",
                      pagination.currentPage === pagination.totalPages && "pointer-events-none opacity-30"
                    )}
                    onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  >
                    {t('next', 'Sau')}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );

  // Inspector Content (Accordion + Filters)
  const inspectorContent = (
    <Inspector title={filters.title} width={320}>
      <div className="flex flex-col gap-0 w-full px-4 pt-4">
        <Accordion
          type="single"
          collapsible
          variant="navigation"
          value={filters.isExpanded ? "item-filters" : ""}
          onValueChange={(val: string) => { if (val !== "item-filters") filters.onToggleExpand(); }}
          className="bg-transparent w-full space-y-2"
        >
          <AccordionItem value="item-filters" className="border-none m-0">
            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
              <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70" />
                <span className="truncate">{t('filter', 'FILTERS')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
              <DataFilter
                groups={filters.groups}
                onToggle={filters.onToggle}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Inspector>
  );

  return (
    <AppShell inspector={inspectorContent}>
      <div className="flex flex-col w-full h-full overflow-hidden bg-white">
        {/* HEADER SECTION */}
        <div className="bg-layer-panel flex-shrink-0">
          <ThemeHeader
            title={header.title}
            breadcrumb={header.breadcrumb}
            badge={header.badge || t('badge', 'verified')}
            liveIndicator={header.liveIndicator ?? true}
            showBackground={false}
          />
        </div>

        {/* CANVAS SECTION */}
        <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-16 lg:px-24 pb-24 flex flex-col relative z-0 bg-white min-h-0">
          {!isFullscreen ? (
            <CanvasDesktop
              title={canvas.title}
              fullScreenHref={fullScreenHref}
            >
              <div className="w-full flex-1 flex flex-col rounded-b-xl min-h-[600px] p-6 lg:p-12 pb-24 h-full">
                {mainContent}
              </div>
            </CanvasDesktop>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 w-full">
              {mainContent}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
