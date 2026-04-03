'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Eye, Edit, Trash2, Check, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from 'zap-design/src/lib/utils';

import { QuickActionsDropdown } from 'zap-design/src/genesis/molecules/quick-actions-dropdown';
import { Badge } from 'zap-design/src/genesis/atoms/interactive/badge';
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
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { type Unit, type UnitStatus } from '../models/unit.model';

export type UnitFilters = {
  status: UnitStatus[];
};

function UnitRow({
  unit,
  expanded,
  onToggle,
  t,
  lang,
}: {
  unit: Unit;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
  lang: string;
}) {
  const createdDate = new Date(unit.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <TableRow
        onClick={onToggle}
        className={cn(
          "cursor-pointer group hover:bg-surface-variant/30 focus:bg-surface-variant/50 border-b border-border/40 transition-colors",
          expanded && "bg-surface-variant/20 border-b-0"
        )}
      >
        <TableCell className="px-6 w-12 py-4">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-6 h-6 rounded-full group-hover:bg-surface-variant/50 transition-colors"
          >
            <ChevronDown className="h-4 w-4 text-on-surface/40 group-hover:text-on-surface transition-colors" />
          </motion.div>
        </TableCell>

        <TableCell className="px-4 py-4 w-24">
          <Text size="body-tiny" className="font-dev text-on-surface/50 tabular-nums">
            #{unit.id.slice(-4).toUpperCase()}
          </Text>
        </TableCell>

        <TableCell className="px-4 py-4 min-w-[200px]">
          <div className="flex flex-col">
            <Text size="label-large" className="font-display font-medium text-on-surface">
              {unit.name}
            </Text>
          </div>
        </TableCell>

        <TableCell className="px-4 py-4 w-48 text-center uppercase tracking-wider font-display font-bold text-[13px] text-on-surface">
          {unit.abbreviation}
        </TableCell>

        <TableCell className="px-4 py-4 w-32 text-center">
          <Pill
            variant={unit.status === 'active' ? 'success' : 'neutral'}
            className="min-w-[80px] justify-center inline-flex"
          >
            {t(`status_${unit.status}`, unit.status)}
          </Pill>
        </TableCell>

        <TableCell className="px-6 py-4 w-20 text-center sticky right-0 bg-layer-canvas z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-layer-canvas/95 transition-colors">
          <div className="flex justify-center">
            <QuickActionsDropdown
              actions={[
                {
                  label: t('action_view', 'View'),
                  icon: Eye,
                  onClick: () => console.log('View', unit.id),
                },
                {
                  label: t('action_edit', 'Edit'),
                  icon: Edit,
                  onClick: () => console.log('Edit', unit.id),
                },
                {
                  label: t('action_delete', 'Delete'),
                  icon: Trash2,
                  variant: 'destructive',
                  onClick: () => console.log('Delete', unit.id),
                },
              ]}
            />
          </div>
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent border-0 overflow-hidden">
            <TableCell colSpan={6} className="p-0 border-0 overflow-hidden">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="bg-layer-panel/60 border-b border-border/40"
              >
                <div className="px-24 py-8 flex flex-col gap-8 max-w-5xl">
                  {/* Expanded Content Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="flex flex-col gap-3">
                      <Heading level={6} className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/40 font-display">
                        description // metadata
                      </Heading>
                      <div className="p-5 rounded-xl bg-layer-canvas border border-border/40 min-h-[80px] shadow-sm">
                        <Text size="body-small" className="text-on-surface/80 leading-relaxed font-body italic">
                          {unit.description || t('no_description', 'no description available for this unit...')}
                        </Text>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-1">
                          <Text size="label-small" className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">created at</Text>
                          <Text size="body-small" className="font-mono text-on-surface/70">{createdDate}</Text>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Text size="label-small" className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">last updated</Text>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-success/60 animate-pulse" />
                             <Text size="body-small" className="font-mono text-on-surface/70">
                                {new Date(unit.updatedAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}
                             </Text>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/30">
                        <Button variant="ghost" size="sm" className="text-[11px] font-bold uppercase tracking-widest text-primary gap-2 h-9 px-4 hover:bg-primary/5">
                           audit full history <ChevronDown className="h-3 w-3 -rotate-90" />
                        </Button>
                      </div>
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

interface UnitTableExpandedProps {
  units: Unit[];
  loading: boolean;
  filters: UnitFilters;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onFilterChange: (filters: UnitFilters) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onToggleFilters: () => void;
  isFilterActive: boolean;
  className?: string;
  t: (key: string, fallback?: string) => string;
  lang: string;
}

export function UnitTableExpanded({
  units = [],
  loading,
  filters,
  currentPage,
  pageSize,
  totalRecords,
  totalPages,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  onToggleFilters,
  isFilterActive,
  className,
  t,
  lang,
}: UnitTableExpandedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch =
        unit.name.toLowerCase().includes(lowerQuery) ||
        unit.abbreviation.toLowerCase().includes(lowerQuery) ||
        (unit.description || '').toLowerCase().includes(lowerQuery) ||
        unit.id.toLowerCase().includes(lowerQuery);

      const matchStatus =
        filters.status.length === 0 || filters.status.includes(unit.status);

      return matchSearch && matchStatus;
    });
  }, [units, searchQuery, filters.status]);

  const activeFilterCount = filters.status.length;
  const hasActiveFilter = activeFilterCount > 0 || searchQuery.trim() !== '';

  return (
    <div className={cn("w-full flex-1 flex flex-col bg-layer-canvas rounded-xl border border-border/40 shadow-xl overflow-hidden", className)}>
      {/* ─── Header Toolbar ────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full py-4 px-6 gap-6 border-b border-border/40 bg-layer-panel/60 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center h-10">
          <AnimatePresence mode="wait">
            {hasActiveFilter ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10"
              >
                <div className="flex items-center gap-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                <Text size="label-small" className="font-display font-medium text-primary text-[12px]">
                  {filteredUnits.length} {t('of')} {totalRecords} {t('units_matched', 'units matched')}
                </Text>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Text size="label-small" className="font-display font-bold uppercase tracking-[0.2em] text-on-surface/30">
                   active index // {totalRecords} units
                </Text>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-[380px] group">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'search units...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 bg-layer-cover/60 border-transparent hover:border-border/40 focus:bg-layer-cover transition-all rounded-xl pl-11"
            />
          </div>
          <Button
            variant={isFilterActive ? 'primary' : 'outline'}
            size="sm"
            onClick={onToggleFilters}
            className={cn(
              "relative h-11 px-5 rounded-xl border-border/40 transition-all font-display uppercase tracking-widest text-[11px] font-bold gap-3 shadow-sm",
              isFilterActive ? "bg-primary text-on-primary ring-4 ring-primary/10 shadow-lg" : "bg-layer-panel hover:bg-layer-cover"
            )}
          >
            <Filter size={16} className={cn(isFilterActive ? "text-on-primary" : "text-primary")} />
            <span>{t('filter', 'filter')}</span>
            {activeFilterCount > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-[10px] bg-primary text-on-primary ring-2 ring-layer-canvas">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* ─── Table Content ────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-visible">
        <div className="min-w-full inline-block align-middle">
          <Table className="w-full relative border-separate border-spacing-0 bg-transparent">
            <TableHeader className="bg-layer-panel/80 backdrop-blur-md sticky top-0 z-20 border-b border-border/40">
              <TableRow className="hover:bg-transparent border-0 h-14">
                <TableHead className="w-12 px-6"></TableHead>
                <TableHead className="w-24 px-4 font-display font-bold uppercase tracking-[0.15em] text-[10px] text-on-surface/40">{t('table_id', 'id')}</TableHead>
                <TableHead className="px-4 font-display font-bold uppercase tracking-[0.15em] text-[10px] text-on-surface/40 text-left">{t('table_name', 'unit_name')}</TableHead>
                <TableHead className="w-48 px-4 font-display font-bold uppercase tracking-[0.15em] text-[10px] text-on-surface/40 text-center">{t('table_abbreviation', 'abbreviation')}</TableHead>
                <TableHead className="w-32 px-4 font-display font-bold uppercase tracking-[0.15em] text-[10px] text-on-surface/40 text-center">{t('table_status', 'status')}</TableHead>
                <TableHead className="w-20 px-6 font-display font-bold uppercase tracking-[0.15em] text-[10px] text-on-surface/40 text-center sticky right-0 bg-layer-panel/95 z-25 backdrop-blur-md">{t('table_actions', 'actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-on-surface/30">
                       <div className="w-10 h-10 rounded-full border-2 border-t-primary border-transparent animate-spin" />
                       <Text size="label-large" className="font-display uppercase tracking-widest text-[13px]">loading unit index...</Text>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUnits.length > 0 ? (
                filteredUnits.map((unit) => (
                  <UnitRow
                    key={unit.id}
                    unit={unit}
                    expanded={expandedId === unit.id}
                    onToggle={() => setExpandedId(expandedId === unit.id ? null : unit.id)}
                    t={t}
                    lang={lang}
                  />
                ))
              ) : (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={6} className="h-96 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center gap-4 py-20 px-8">
                       <div className="p-6 rounded-full bg-surface-variant/20 mb-2">
                          <Filter className="w-12 h-12 text-on-surface/10 stroke-[1.5]" />
                       </div>
                       <Heading level={4} className="font-display uppercase tracking-widest text-on-surface/50">{t('no_data', 'zero results matched')}</Heading>
                       <Text size="body-medium" className="text-on-surface/30 text-center leading-relaxed">Adjust your filters or search query to locate specific unit records within the assembly database.</Text>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ─── Pagination Footer ────────────────────────────────────────────── */}
      <div className="w-full h-[72px] bg-layer-panel border-t border-border/40 px-8 flex items-center justify-between sticky bottom-0 z-30">
        <div className="flex items-center gap-3">
          <Text size="label-small" className="font-display font-bold text-on-surface/30 uppercase tracking-[0.1em] text-[10px]">
            {t('show', 'show')}
          </Text>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(val) => onPageSizeChange(parseInt(val, 10))}
          >
            <SelectTrigger className="h-9 w-20 bg-surface-variant/20 border-transparent hover:bg-surface-variant/40 transition-colors px-3 rounded-lg font-mono text-[12px] font-bold text-on-surface">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent className="bg-layer-panel border-border/40">
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()} className="font-mono text-[12px] uppercase tracking-wider">{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Text size="label-small" className="font-display font-bold text-on-surface/30 uppercase tracking-[0.1em] text-[10px]">
            {t('records_per_table', 'entries per view')}
          </Text>
        </div>

        <Pagination className="mx-0 w-auto m-0 flex-1 justify-end">
          <PaginationContent className="bg-surface-variant/20 border border-border/20 rounded-xl px-1.5 h-11 gap-1.5 shadow-inner">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={cn(
                  "h-8 px-4 rounded-lg bg-transparent border-0 hover:bg-layer-canvas/60 text-[11px] font-bold uppercase tracking-widest font-display transition-all",
                  currentPage === 1 && "pointer-events-none opacity-20 filter grayscale"
                )}
              />
            </PaginationItem>
            
            <div className="flex items-center gap-1.5 px-3">
              <Text size="label-small" className="font-mono text-primary font-bold text-[13px]">{currentPage}</Text>
              <Text size="label-small" className="font-mono text-on-surface/30 font-bold text-[13px]">/</Text>
              <Text size="label-small" className="font-mono text-on-surface/50 font-bold text-[13px]">{totalPages}</Text>
            </div>

            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={cn(
                  "h-8 px-4 rounded-lg bg-transparent border-0 hover:bg-layer-canvas/60 text-[11px] font-bold uppercase tracking-widest font-display transition-all",
                  currentPage === totalPages && "pointer-events-none opacity-20 filter grayscale"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
