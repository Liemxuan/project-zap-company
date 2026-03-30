'use client';

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { getUsersAction } from '@olympus/zap-auth/src/actions';

import { Badge } from '@/genesis/atoms/interactive/badge';
import { Button } from '@/genesis/atoms/interactive/button';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Input } from '@/genesis/atoms/interactive/inputs';
import { Pill } from '@/genesis/atoms/status/pills';
import { Text } from '@/genesis/atoms/typography/text';
import { Heading } from '@/genesis/atoms/typography/headings';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/genesis/molecules/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/genesis/atoms/interactive/select';

type UserWithEmployee = {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  employee: {
    id: string;
    department: string;
    assignedLevel: number;
    pinCode: string | null;
    organization: { id: string; name: string } | null;
    brand: { id: string; name: string } | null;
    location: { id: string; name: string } | null;
  } | null;
};

type Filters = {
  role: string[];
};

export function AuthUserManagementView({
  searchQuery,
  setSearchQuery,
  filters,
  activeFiltersCount,
  onFilterToggle,
  isFilterActive,
  onRolesLoaded,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Filters;
  activeFiltersCount: number;
  onFilterToggle: () => void;
  isFilterActive: boolean;
  onRolesLoaded?: (roles: string[]) => void;
}) {
  const [users, setUsers] = useState<UserWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getUsersAction().then((res: UserWithEmployee[]) => {
      setUsers(res || []);
      if (onRolesLoaded) {
        onRolesLoaded(Array.from(new Set((res || []).map(u => u.role))));
      }
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch users:', err);
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    });
  }, [onRolesLoaded]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch =
        (u.name || "").toLowerCase().includes(lowerQuery) ||
        (u.email || "").toLowerCase().includes(lowerQuery);

      const matchRole =
        filters.role.length === 0 || filters.role.includes(u.role);

      return matchSearch && matchRole;
    });
  }, [filters, searchQuery, users]);

  const hasActiveFilter = activeFiltersCount > 0 || searchQuery.trim() !== "";

  if (loading) {
    return (
      <main className="w-full flex items-center justify-center min-h-[length:var(--table-min-height,25rem)] bg-layer-cover transition-all duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <Text size="dev-wrapper" className="bg-transparent text-muted-foreground uppercase text-transform-tertiary">Fetching Vault Identities...</Text>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full flex items-center justify-center min-h-[length:var(--table-min-height,25rem)] bg-layer-cover transition-all duration-300">
        <div className="flex flex-col items-center space-y-4 px-6 text-center">
          <Icon name="error_outline" size={48} className="text-destructive mb-2" />
          <Heading level={4} className="text-foreground">Failed to Load User Vault</Heading>
          <Text size="dev-note" className="bg-layer-panel text-muted-foreground p-4 break-all max-w-lg">
            {error}
          </Text>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-full flex flex-col bg-layer-cover overflow-hidden transition-all duration-300">
      <div className="flex h-full flex-col">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:var(--table-toolbar-height,4.5rem)]">
          <div className="flex items-center h-8">
            {hasActiveFilter && (
              <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
                {filteredUsers.length} of {users.length} users matched criteria.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Input
                variant="filled"
                leadingIcon="search"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="font-body text-transform-secondary text-sm"
              />
            </div>
            <Button
              variant={isFilterActive ? "primary" : "outline"}
              size="sm"
              onClick={onFilterToggle}
              className="relative h-[var(--input-height,var(--button-height,48px))] px-6"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="font-display font-medium text-xs text-transform-primary">Filter</span>
              {activeFiltersCount > 0 && (
                <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground z-20">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-[length:var(--table-min-height,25rem)]">
          <div className="flex-1 flex flex-col overflow-hidden bg-layer-cover">
            <div
              className="flex items-center gap-4 w-full px-7 h-12 border-b border-outline-variant bg-layer-panel text-muted-foreground text-xs font-bold text-transform-primary tracking-wider text-[length:var(--table-header-font-size,12px)] leading-[var(--table-header-line-height,1.33)] tracking-[var(--table-header-letter-spacing,0.4px)] font-[var(--table-header-font-weight,700)] [text-transform:var(--table-header-text-casing,var(--text-transform-primary,uppercase))]"
            >
              <div className="w-4 flex-shrink-0"></div>
              <div className="w-20 flex-shrink-0 text-left">ROLE</div>
              <div className="w-28 flex-shrink-0 text-left">CREATED</div>
              <div className="w-32 flex-shrink-0 text-left">NAME</div>
              <div className="flex-1 text-left">EMAIL</div>
              <div className="w-28 flex-shrink-0 text-left">ASSIGNMENT</div>
              <div className="w-24 flex-shrink-0 text-right">EMPLOYEE ID</div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => {
                    const expanded = expandedId === user.id;
                    const formattedTime = new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric"
                    });

                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                      >
                        <motion.button
                          onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                          className="w-full px-7 py-4 text-left transition-colors hover:bg-surface-variant/50 focus:bg-surface-variant/70 border-b border-border/50 last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 w-4">
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>

                            <div className="w-20 flex-shrink-0 flex items-center">
                              <Pill variant={user.role === 'ADMIN' ? 'error' : user.role === 'MANAGER' ? 'warning' : 'info'} className="min-w-16 shadow-none">
                                {user.role}
                              </Pill>
                            </div>

                            <time className="w-28 flex-shrink-0 font-dev text-transform-tertiary text-xs text-muted-foreground text-left">
                              {formattedTime}
                            </time>

                            <span className="w-32 flex-shrink-0 truncate text-sm font-body text-transform-secondary font-medium text-foreground text-left">
                              {user.name}
                            </span>

                            <p className="flex-1 truncate text-sm font-body text-transform-secondary text-muted-foreground text-left">
                              {user.email}
                            </p>

                            <span className="w-28 flex-shrink-0 truncate text-sm font-body text-transform-secondary font-medium text-foreground text-left">
                              {user.employee 
                                ? user.employee.assignedLevel === 0 ? "ZAP Core (L0)" 
                                : user.employee.organization?.name 
                                  ? `${user.employee.organization.name} (L1)` 
                                  : user.employee.brand?.name 
                                    ? `${user.employee.brand.name} (L2)` 
                                    : user.employee.location?.name
                                      ? `${user.employee.location.name} (L6)`
                                      : '--'
                                : '--'}
                            </span>

                            <span className="w-24 flex-shrink-0 text-right font-dev text-transform-tertiary text-xs text-muted-foreground">
                              {user.employee ? user.employee.id.substring(0, 8) : '--'}
                            </span>
                          </div>
                        </motion.button>

                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.div
                              key="details"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-border bg-layer-panel"
                            >
                              <div className="space-y-4 px-7 py-4 border-b border-border">
                                <div>
                                  <p className="mb-2 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                                    Identity Context
                                  </p>
                                  <p className="rounded-[length:var(--table-border-radius,var(--radius-card,8px))] bg-layer-cover p-3 font-dev text-transform-tertiary text-sm text-foreground border border-[length:var(--table-border-width,var(--card-border-width,1px))] border-outline-variant/30">
                                    ID: {user.id} <br />
                                    Last Updated: {new Date(user.updatedAt).toLocaleTimeString("en-US")} <br />
                                    {user.employee ? `Employee Context: ${user.employee.id} | Department: ${user.employee.department} | Level: L${user.employee.assignedLevel} | Node: ${
                                      user.employee.assignedLevel === 0 ? "ZAP Core" :
                                      user.employee.organization?.name || 
                                      user.employee.brand?.name || 
                                      user.employee.location?.name || 'N/A'}` : 'No attached employee entity.'}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })
                ) : (
                  <motion.div key="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
                    <p className="font-body text-transform-secondary text-muted-foreground">
                      No users match your filters.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-layer-panel px-7 py-4 min-h-[56px] flex items-center">
          <div className="flex w-full items-center justify-between text-sm text-muted-foreground font-body text-transform-secondary">
            <div className="flex items-center gap-2">
              <span className="text-transform-secondary">Show</span>
              <Select defaultValue="10">
                <SelectTrigger size="sm" className="w-20 font-medium font-body bg-layer-panel text-on-surface hover:bg-layer-dialog">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-transform-secondary">records per table</span>
            </div>
            <Pagination className="mx-0 w-auto m-0">
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}
