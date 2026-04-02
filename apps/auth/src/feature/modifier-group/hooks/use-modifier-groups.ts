'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ModifierGroup,
  ModifierGroupFilter,
  ModifierGroupResponse,
} from '../models/modifier-group.model';
import { postModifierGroupList } from '../services/modifier-group.service';

export function useModifierGroups(initialPage = 1, pageSize = 10) {
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<ModifierGroupFilter>({});

  // Sync internal page state with initialPage prop when it changes (URL driven)
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  // Fetch modifier groups when filter or page changes
  useEffect(() => {
    const fetchModifierGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postModifierGroupList(filter, page, pageSize);
        setModifierGroups(response.data);
        setTotal(response.total);
      } catch (err) {
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

  const handleFilterByStatus = useCallback((status: 'active' | 'inactive' | undefined) => {
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
    pageSize,
    filter,
    handleSearch,
    handleFilterByStatus,
    handlePageChange,
    handleClearFilters,
  };
}
