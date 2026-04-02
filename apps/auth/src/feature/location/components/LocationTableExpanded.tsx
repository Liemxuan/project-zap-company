'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from 'zap-design/src/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { QuickActionsDropdown } from 'zap-design/src/genesis/molecules/quick-actions-dropdown';
import { Avatar, AvatarImage, AvatarFallback } from 'zap-design/src/genesis/atoms/interactive/avatar';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'zap-design/src/genesis/atoms/data-display/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from 'zap-design/src/genesis/molecules/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'zap-design/src/genesis/atoms/interactive/select';
import { Location } from '../models/location.model';

export type LocationFilters = {
  status: string[];
};

function LocationRow({
  location,
  expanded,
  onToggle,
  t,
}: {
  location: Location;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
}) {
  return (
    <>
      <TableRow onClick={onToggle} className="cursor-pointer">
        {/* expand icon */}
        <TableCell className="w-10 text-center py-4">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex"
          >
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </motion.div>
        </TableCell>

        {/* id */}
        <TableCell className="w-20 whitespace-nowrap text-left py-4 font-dev text-muted-foreground text-[11px]">
          {location.id}
        </TableCell>

        {/* image */}
        <TableCell className="w-20 py-4 flex justify-center">
          <Avatar size="sm">
            {location.image && <AvatarImage src={location.image} alt={location.name} />}
            <AvatarFallback>{location.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </TableCell>

        {/* name */}
        <TableCell className="min-w-[200px] whitespace-nowrap text-left py-4 font-medium text-[11px]">
          {location.name}
        </TableCell>

        {/* city */}
        <TableCell className="w-32 whitespace-nowrap text-left py-4 font-dev text-muted-foreground text-[11px]">
          {location.city}
        </TableCell>

        {/* phone */}
        <TableCell className="w-32 whitespace-nowrap text-left py-4 font-dev text-muted-foreground text-[11px]">
          {location.phone}
        </TableCell>

        {/* status */}
        <TableCell className="w-28 whitespace-nowrap py-4">
          <Pill variant={location.status === 'active' ? 'success' : location.status === 'inactive' ? 'warning' : 'error'} className="min-w-16 block text-center text-[10px]">
            {location.status}
          </Pill>
        </TableCell>

        {/* actions */}
        <TableCell className="w-16 whitespace-nowrap text-right py-4" onClick={(e) => e.stopPropagation()}>
          <QuickActionsDropdown
            actions={[
              {
                label: t('action_view', 'View'),
                icon: Eye,
                onClick: () => console.log('View', location.id),
              },
              {
                label: t('action_edit', 'Edit'),
                icon: Edit,
                onClick: () => console.log('Edit', location.id),
              },
              {
                label: t('action_delete', 'Delete'),
                icon: Trash2,
                variant: 'destructive',
                onClick: () => console.log('Delete', location.id),
              },
            ]}
          />
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow>
            <TableCell colSpan={8} className="p-0 border-none">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-layer-panel border-t border-border"
              >
                <div className="space-y-4 px-7 py-4 border-b border-border">
                  <div className="grid grid-cols-3 gap-4 font-dev">
                    <div>
                      <p className="mb-1 text-[10px] font-display font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('email', 'Email')}
                      </p>
                      <p className="text-sm text-on-surface">{location.email}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-display font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('address', 'Address')}
                      </p>
                      <p className="text-sm text-on-surface">{location.address}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-display font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('opening_hours', 'Opening Hours')}
                      </p>
                      <p className="text-sm text-on-surface">{location.openingHours}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}

interface LocationTableExpandedProps {
  locations: Location[];
  loading: boolean;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  t: (key: string, fallback?: string) => string;
  lang: string;
  className?: string;
}

export function LocationTableExpanded({
  locations,
  loading,
  totalRecords,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  t,
  className,
}: LocationTableExpandedProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredLocations = useMemo(() => {
    return locations.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      if (currentPage > 3) items.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      if (currentPage < totalPages - 2) items.push('...');
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  return (
    <div className={cn('flex flex-col h-full overflow-hidden', className)}>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-2 px-5 gap-3 border-b border-border bg-layer-panel min-h-[3rem] flex-shrink-0">
        <div className="flex items-center h-8">
          <span className="text-sm font-medium text-muted-foreground/60 transition-opacity whitespace-nowrap">
            {locations.length} {t('locations', 'locations')}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'Quick search...')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="text-sm bg-layer-2/50 border-outline/10 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-layer-cover min-w-0">
        <div className="flex-1 overflow-y-auto">
          <Table>
            <TableHeader className="bg-layer-panel top-0 z-10 sticky border-b border-border shadow-sm h-12">
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableHead className="w-10 text-center bg-layer-panel h-12"></TableHead>
                <TableHead className="w-20 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>id</TableHead>
                <TableHead className="w-20 text-center bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>image</TableHead>
                <TableHead className="text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>name</TableHead>
                <TableHead className="w-32 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>city</TableHead>
                <TableHead className="w-32 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>phone</TableHead>
                <TableHead className="w-28 text-center bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>status</TableHead>
                <TableHead className="w-16 text-right bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-64 text-center py-8">
                    <p className="text-muted-foreground">{t('no_data', 'No locations found')}</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocations.map((location) => (
                  <LocationRow
                    key={location.id}
                    location={location}
                    expanded={expandedRows.has(location.id)}
                    onToggle={() => toggleExpanded(location.id)}
                    t={t}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-border bg-layer-panel px-7 py-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-on-surface/60 font-body">
              <span>{t('show', 'Show')}</span>
              <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(parseInt(v, 10))}>
                <SelectTrigger size="sm" className="w-16 h-8 bg-transparent border-0 hover:bg-layer-canvas ring-0 focus:ring-0 px-2 font-medium text-on-surface">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent className="bg-layer-canvas border-outline">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="10000">all</SelectItem>
                </SelectContent>
              </Select>
              <span>{t('records_per_table', 'records per table')}</span>
            </div>

            <div className="flex items-center">
              <Pagination>
                <PaginationContent className="bg-secondary/10 border border-outline-variant rounded-full px-1.5 h-10 gap-1 shadow-sm">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                      className={cn(
                        'h-8 px-3 rounded-full hover:bg-layer-canvas text-on-surface/80 hover:text-on-surface lowercase font-body transition-colors',
                        currentPage === 1 && 'pointer-events-none opacity-40'
                      )}
                    >
                      {t('previous', 'Previous')}
                    </PaginationPrevious>
                  </PaginationItem>

                  {paginationItems.map((item, idx) =>
                    item === '...' ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis className="h-8 w-8 text-on-surface/40" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={currentPage === item}
                          onClick={() => onPageChange(item as number)}
                          className={cn(
                            'h-8 w-8 rounded-full font-body transition-all',
                            currentPage === item
                              ? 'bg-primary text-on-primary shadow-sm scale-105'
                              : 'text-on-surface/60 hover:bg-layer-canvas hover:text-on-surface'
                          )}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                      className={cn(
                        'h-8 px-3 rounded-full hover:bg-layer-canvas text-on-surface/80 hover:text-on-surface lowercase font-body transition-colors',
                        currentPage === totalPages && 'pointer-events-none opacity-40'
                      )}
                    >
                      {t('next', 'Next')}
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
