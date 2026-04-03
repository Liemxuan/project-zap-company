'use client';

import * as React from 'react';
import {
  ColumnDef,
  CellContext,
  HeaderContext,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Re-export table types so consumers don't need a direct @tanstack/react-table dep
export type { ColumnDef, CellContext, HeaderContext, Row };
import { ChevronUp, ChevronDown, SlidersHorizontal, Filter } from 'lucide-react';

// L1 — Atoms
import { Button } from '../atoms/interactive/button';
import { Input } from '../atoms/interactive/inputs';
import { Text } from '../atoms/typography/text';
import { Badge } from '../atoms/interactive/badge';

// L2 — Molecules
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../molecules/table';
import { DataFilter, FilterGroup } from '../molecules/data-filter';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../molecules/pagination';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../molecules/dropdown-menu';

// L4 — Layout
import { Inspector } from '../layout/Inspector';

export interface TableListFilterGroup {
  id: string;
  title: string;
  options: { id: string; label: string }[];
}

export interface TableListProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterGroups?: TableListFilterGroup[];
  /** Map of groupId -> selected optionIds */
  activeFilters?: Record<string, string[]>;
  onFilterChange?: (groupId: string, optionId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function TableList<TData, TValue>({
  columns,
  data,
  filterGroups = [],
  activeFilters = {},
  onFilterChange,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
}: TableListProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showInspector, setShowInspector] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnVisibility, rowSelection },
  });

  // Inject selected state into filter groups from activeFilters
  const enrichedGroups: FilterGroup[] = filterGroups.map((group) => ({
    ...group,
    options: group.options.map((opt) => ({
      ...opt,
      selected: (activeFilters[group.id] ?? []).includes(opt.id),
    })),
  }));

  const activeCount = Object.values(activeFilters).flat().length;

  const handleClearAll = () => {
    Object.entries(activeFilters).forEach(([gId, opts]) =>
      opts.forEach((oId) => onFilterChange?.(gId, oId))
    );
  };

  return (
    <div className="w-full flex flex-col h-full">

      {/* ── TOOLBAR ── L1 atoms + L2 DropdownMenu molecule ─────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant bg-layer-panel h-[56px] shrink-0">
        <div className="flex-1 max-w-sm">
          <Input
            variant="filled"
            leadingIcon="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="font-body text-sm"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Text size="xs" className="text-on-surface-variant font-dev text-transform-tertiary whitespace-nowrap">
            {data.length} records
          </Text>

          {/* L2 molecule: column visibility dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-display text-transform-primary h-8 px-3">
                <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-layer-dialog">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize font-body text-transform-secondary"
                    checked={col.getIsVisible()}
                    onCheckedChange={(val) => col.toggleVisibility(!!val)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Inspector toggle — L1 Button atom + Badge atom */}
          {filterGroups.length > 0 && (
            <div className="relative">
              <Button
                variant={showInspector ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowInspector((v) => !v)}
                className="h-8 px-3 font-display text-transform-primary"
              >
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                Filter
              </Button>
              {activeCount > 0 && (
                <Badge className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground pointer-events-none">
                  {activeCount}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── TABLE ── L2 Table molecule ─────────────────────────────────────── */}
        <div className="bg-layer-dialog overflow-auto flex-1">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && (
                          <ChevronUp className="h-3 w-3 text-primary" />
                        )}
                        {header.column.getIsSorted() === 'desc' && (
                          <ChevronDown className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center font-body text-transform-secondary text-on-surface-variant"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      </div>

      {/* L4 Layout — Filter Inspector panel (fixed right edge of screen) */}
      {filterGroups.length > 0 && (
        <Inspector title="Filters" isOpen={showInspector} onClose={() => setShowInspector(false)} variant="fixed" width={280}>
          <div className="flex flex-col gap-4">
            <DataFilter
              groups={enrichedGroups}
              onToggle={(groupId, optionId) => onFilterChange?.(groupId, optionId)}
            />
            {activeCount > 0 && (
              <button
                onClick={handleClearAll}
                className="text-left text-[10px] font-display tracking-widest uppercase text-primary/60 hover:text-primary underline underline-offset-2 transition-colors"
              >
                clear all ({activeCount})
              </button>
            )}
          </div>
        </Inspector>
      )}

      {/* ── PAGINATION ── L2 Pagination molecule ────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-outline-variant bg-layer-panel h-[48px] shrink-0">
        <Text size="xs" className="text-on-surface-variant font-dev text-transform-tertiary">
          {table.getFilteredSelectedRowModel().rows.length} of {data.length} selected
        </Text>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); if (table.getCanPreviousPage()) table.previousPage(); }}
                className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50 font-body text-transform-secondary' : 'font-body text-transform-secondary'}
              />
            </PaginationItem>

            {(() => {
              const pageIndex = table.getState().pagination.pageIndex;
              const pageCount = table.getPageCount();
              if (pageCount === 0) return null;

              const pages: (number | 'ellipsis')[] = [];
              if (pageCount <= 5) {
                for (let i = 0; i < pageCount; i++) pages.push(i);
              } else if (pageIndex <= 2) {
                pages.push(0, 1, 2, 'ellipsis', pageCount - 1);
              } else if (pageIndex >= pageCount - 3) {
                pages.push(0, 'ellipsis', pageCount - 3, pageCount - 2, pageCount - 1);
              } else {
                pages.push(0, 'ellipsis', pageIndex - 1, pageIndex, pageIndex + 1, 'ellipsis', pageCount - 1);
              }

              return pages.map((page, i) =>
                page === 'ellipsis' ? (
                  <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={pageIndex === page}
                      onClick={(e) => { e.preventDefault(); table.setPageIndex(page as number); }}
                    >
                      {(page as number) + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              );
            })()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); if (table.getCanNextPage()) table.nextPage(); }}
                className={!table.getCanNextPage() ? 'pointer-events-none opacity-50 font-body text-transform-secondary' : 'font-body text-transform-secondary'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
