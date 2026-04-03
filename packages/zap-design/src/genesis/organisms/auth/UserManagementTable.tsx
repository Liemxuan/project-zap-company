'use client';

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Filter } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

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

export function UserManagementTable() {
  const [users, setUsers] = useState<UserWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  console.log("== UserManagementTable Render ==", { loading, error, usersLength: users?.length });

  useEffect(() => {
    const mockUsers: UserWithEmployee[] = [
      {
        id: "usr_core_001",
        email: "admin@zap.inc",
        name: "Zeus Tom",
        role: "SUPERADMIN",
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-03-25T10:00:00Z"),
        employee: {
          id: "emp_core_01",
          department: "Security",
          assignedLevel: 0,
          pinCode: null,
          organization: null,
          brand: null,
          location: null,
        }
      },
      {
        id: "usr_brand_002",
        email: "manager@example.com",
        name: "Jane Doe",
        role: "MANAGER",
        createdAt: new Date("2026-02-15T14:30:00Z"),
        updatedAt: new Date("2026-03-20T09:15:00Z"),
        employee: {
          id: "emp_brand_102",
          department: "Operations",
          assignedLevel: 2,
          pinCode: "1234",
          organization: { id: "org_1", name: "Global Retail" },
          brand: { id: "brd_1", name: "Acme Corp" },
          location: null,
        }
      },
      {
        id: "usr_loc_003",
        email: "staff@example.com",
        name: "John Smith",
        role: "USER",
        createdAt: new Date("2026-03-01T08:45:00Z"),
        updatedAt: new Date("2026-03-24T16:20:00Z"),
        employee: {
          id: "emp_loc_554",
          department: "Sales",
          assignedLevel: 6,
          pinCode: "5678",
          organization: { id: "org_1", name: "Global Retail" },
          brand: { id: "brd_1", name: "Acme Corp" },
          location: { id: "loc_1", name: "Downtown Store" },
        }
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 400);
  }, []);
  const [showFilters, setShowFilters] = useState(false);
  type Filters = {
    role: string[];
  };
  const [filters, setFilters] = useState<Filters>({
    role: [],
  });

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

  const activeFilters = filters.role.length;
  const hasActiveFilter = activeFilters > 0 || searchQuery.trim() !== "";

  const roles = Array.from(new Set(users.map((u) => u.role)));

  const toggleFilter = (category: keyof Filters, value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...current, value];

    setFilters({
      ...filters,
      [category]: updated,
    });
  };

  const clearAll = () => setFilters({ role: [] });

  if (loading) {
    return (
      <main className="w-full flex items-center justify-center min-h-[length:var(--table-min-height,25rem)] bg-layer-canvas border-outline-variant rounded-[length:var(--radius-card,8px)] border">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
 <Text size="dev-wrapper" className="bg-transparent text-muted-foreground text-transform-tertiary">Fetching Vault Identities...</Text>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full flex items-center justify-center min-h-[length:var(--table-min-height,25rem)] bg-layer-canvas border-outline-variant rounded-[length:var(--radius-card,8px)] border">
        <div className="flex flex-col items-center space-y-4 px-6 text-center">
          <Icon name="error_outline" size={48} className="text-destructive mb-2" />
          <Heading level={4} className="text-foreground">Failed to Load User Vault !</Heading>
          <Text size="dev-note" className="bg-layer-panel text-muted-foreground p-4 break-all max-w-lg">
            {error}
          </Text>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))]">
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
              variant={showFilters ? "primary" : "outline"}
              size="sm"
              onClick={() => setShowFilters((current) => !current)}
              className="relative h-[var(--input-height,var(--button-height,48px))] px-6"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="font-display font-medium text-xs text-transform-primary">Filter</span>
              {activeFilters > 0 && (
                <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs rounded-full bg-error text-on-error border-none z-20">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-[length:var(--table-min-height,25rem)]">
          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                key="filters"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-r border-border bg-layer-panel"
              >
                <div className="flex h-full flex-col space-y-6 overflow-y-auto bg-layer-panel p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-display text-transform-primary font-semibold text-foreground">Filters</h3>
                    {activeFilters > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 text-xs text-primary">
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                      Role
                    </p>
                    <div className="space-y-2">
                      {roles.map((role) => {
                        const selected = filters.role.includes(role);
                        return (
                          <motion.button
                            key={role}
                            type="button"
                            whileHover={{ x: 2 }}
                            onClick={() => toggleFilter("role", role)}
                            aria-pressed={selected}
                            className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-body text-transform-secondary ${selected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40"
                              }`}
                          >
                            <span>{role}</span>
                            {selected && <Check className="h-3.5 w-3.5" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                                    {user.employee ? `Employee Context: ${user.employee.id} | Department: ${user.employee.department} | Level: L${user.employee.assignedLevel} | Node: ${user.employee.assignedLevel === 0 ? "ZAP Core" :
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
                <SelectTrigger size="sm" className="w-20 font-medium font-body text-transform-secondary bg-layer-panel text-on-surface hover:bg-layer-dialog">
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
