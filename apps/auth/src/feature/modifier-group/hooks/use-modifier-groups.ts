'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ModifierGroup,
  ModifierGroupFilter,
  ModifierGroupStatus,
} from '../models/modifier-group.model';
import { postModifierGroupList } from '../services/modifier-group.service';

export function useModifierGroups(initialPage = 1, pageSize = 10, initialFilter?: ModifierGroupFilter) {
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<ModifierGroupFilter>(initialFilter || {});

  // Sync internal page state with initialPage prop
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  // Sync internal filter state with initialFilter prop
  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  // Fetch modifier groups when filter or page changes
  useEffect(() => {
    const fetchModifierGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postModifierGroupList(filter, page, pageSize);
        setModifierGroups(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error('[useModifierGroups] Fetch failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch modifier groups');
        setModifierGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModifierGroups();
  }, [filter, page, pageSize]);

  const handleSearch = useCallback((searchQuery: string) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, searchQuery }));
  }, []);

  const handleFilterByStatus = useCallback((status: ModifierGroupStatus[] | undefined) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, status }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleClearFilters = useCallback(() => {
    setPage(1);
    setFilter({});
  }, []);

  return {
    modifierGroups,
    loading,
    error,
    page,
    total,
    totalPages,
    pageSize,
    filter,
    handleSearch,
    handleFilterByStatus,
    handlePageChange,
    handleClearFilters,
  };
}
