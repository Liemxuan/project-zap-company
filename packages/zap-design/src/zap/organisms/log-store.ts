import { create } from 'zustand';

export type LogLevel = "info" | "warning" | "error";

export interface Log {
  id: string;
  timestamp: string;
  level: LogLevel | string;
  service: string;
  message: string;
  duration: string;
  status: string;
  tags: string[];
}

export type Filters = {
  level: string[];
  service: string[];
  status: string[];
};

interface LogStore {
  logs: Log[];
  filters: Filters;
  searchQuery: string;
  expandedId: string | null;
  isFilterActive: boolean;
  
  // Actions
  setLogs: (logs: Log[]) => void;
  setFilters: (filters: Filters) => void;
  setSearchQuery: (query: string) => void;
  setExpandedId: (id: string | null) => void;
  toggleExpanded: (id: string) => void;
  setIsFilterActive: (isActive: boolean) => void;
  toggleFilter: (category: keyof Filters, value: string) => void;
  clearFilters: () => void;
}

export const useLogStore = create<LogStore>()((set) => ({
  logs: [],
  filters: {
    level: [],
    service: [],
    status: [],
  },
  searchQuery: '',
  expandedId: null,
  isFilterActive: false,

  setLogs: (logs: Log[]) => set({ logs }),
  setFilters: (filters: Filters) => set({ filters }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setExpandedId: (expandedId: string | null) => set({ expandedId }),
  setIsFilterActive: (isFilterActive: boolean) => set({ isFilterActive }),
  
  toggleExpanded: (id: string) => set((state: LogStore) => ({ 
    expandedId: state.expandedId === id ? null : id 
  })),

  toggleFilter: (category: keyof Filters, value: string) => set((state: LogStore) => {
    const current = state.filters[category];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    
    return {
      filters: {
        ...state.filters,
        [category]: updated,
      }
    };
  }),

  clearFilters: () => set({
    filters: {
      level: [],
      service: [],
      status: [],
    }
  }),
}));
