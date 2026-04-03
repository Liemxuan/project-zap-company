"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../genesis/molecules/table'
import { Button } from '../../genesis/atoms/interactive/button'
import { SearchInput } from '../../genesis/atoms/interactive/SearchInput'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../genesis/molecules/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from '../../genesis/molecules/pagination'

interface DataGridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
}

export function DataGrid<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataGridProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // eslint-disable-next-line
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4">
      {/* TOOLBAR */}
      <div className="flex items-center py-4">
        {searchKey && (
          <SearchInput
            placeholder={`Search ${searchKey}...`}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto font-display text-transform-primary">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
 className=" font-body text-transform-secondary"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* GRID CONTAINER: Enforcing M3 Surface and Elevation */}
      <div className="rounded-[length:var(--data-grid-radius,var(--radius-shape-medium))] border-[length:var(--data-grid-border-width,1px)] border-outline-variant bg-layer-dialog shadow-[var(--md-sys-elevation-level1)] overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center font-body text-transform-secondary text-on-surface-variant">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION: L4 Molecule Enforcement */}
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-on-surface-variant font-body text-transform-secondary">
          {table.getFilteredSelectedRowModel().rows.length} of{""}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (table.getCanPreviousPage()) table.previousPage()
                  }}
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50 font-body text-transform-secondary" : "font-body text-transform-secondary"}
                />
              </PaginationItem>
              
              {(() => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageCount = table.getPageCount();
                if (pageCount === 0) return null;

                const pages: (number | 'ellipsis')[] = [];
                if (pageCount <= 5) {
                  for (let i = 0; i < pageCount; i++) {
                    pages.push(i);
                  }
                } else {
                  if (pageIndex <= 2) {
                    pages.push(0, 1, 2, 'ellipsis', pageCount - 1);
                  } else if (pageIndex >= pageCount - 3) {
                    pages.push(0, 'ellipsis', pageCount - 3, pageCount - 2, pageCount - 1);
                  } else {
                    pages.push(0, 'ellipsis', pageIndex - 1, pageIndex, pageIndex + 1, 'ellipsis', pageCount - 1);
                  }
                }

                return pages.map((page, index) => {
                  if (page === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={pageIndex === page}
                        onClick={(e) => {
                          e.preventDefault()
                          table.setPageIndex(page as number)
                        }}
                      >
                        {(page as number) + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (table.getCanNextPage()) table.nextPage()
                  }}
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50 font-body text-transform-secondary" : "font-body text-transform-secondary"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
