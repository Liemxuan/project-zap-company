'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, MenuFilter, MenuResponse } from '../models/menu.model';

// Mock data generator for preview
const MOCK_MENUS: Menu[] = Array.from({ length: 25 }, (_, i) => ({
  id: `menu-${i + 1}`,
  name: `Thực đơn ${i + 1}`,
  locations: ['Chi nhánh Quận 1', 'Chi nhánh Quận 3'],
  channels: ['Grab', 'ShopeeFood', 'Dine-in'],
  total_item: Math.floor(Math.random() * 50) + 10,
  is_active: i % 3 !== 0,
  materialized_path: `/menus/m${i + 1}`,
  updated_at: new Date().toISOString(),
}));

export function useMenus(initialPage = 1, initialPageSize = 10) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filter, setFilter] = useState<MenuFilter>({});

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let filtered = [...MOCK_MENUS];
      if (filter.searchQuery) {
        filtered = filtered.filter(m => 
          m.name.toLowerCase().includes(filter.searchQuery!.toLowerCase())
        );
      }
      if (filter.status) {
        filtered = filtered.filter(m => 
          filter.status === 'active' ? m.is_active : !m.is_active
        );
      }

      const start = (pageIndex - 1) * pageSize;
      const paginated = filtered.slice(start, start + pageSize);

      setMenus(paginated);
      setTotalRecords(filtered.length);
      setTotalPages(Math.ceil(filtered.length / pageSize));
      setLoading(false);
    };

    fetchMenus();
  }, [filter, pageIndex, pageSize]);

  const handleSearch = useCallback((searchQuery: string) => {
    setPageIndex(1);
    setFilter(prev => ({ ...prev, searchQuery }));
  }, []);

  const handleFilterByStatus = useCallback((status: 'active' | 'inactive' | undefined) => {
    setPageIndex(1);
    setFilter(prev => ({ ...prev, status }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPageIndex(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPageIndex(1);
  }, []);

  return {
    menus,
    loading,
    pageIndex,
    totalRecords,
    totalPages,
    pageSize,
    filter,
    handleSearch,
    handleFilterByStatus,
    handlePageChange,
    handlePageSizeChange,
  };
}
