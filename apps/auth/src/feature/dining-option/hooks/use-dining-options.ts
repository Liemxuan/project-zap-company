'use client';

import { useState, useEffect, useCallback } from 'react';
import { DiningOption, DiningOptionFilter, DiningOptionResponse } from '../models/dining-option.model';
import { getDiningOptionTypes, postDiningOptionList } from '../services/dining-option.service';

export function useDiningOptions(initialPage = 1, pageSize = 10) {
  const [diningOptions, setDiningOptions] = useState<DiningOption[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<DiningOptionFilter>({});

  // Sync internal page state with initialPage prop when it changes (URL driven)
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  // Fetch types on mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const t = await getDiningOptionTypes();
        setTypes(t);
      } catch (err) {
        console.error('Failed to fetch dining option types:', err);
      }
    };
    fetchTypes();
  }, []);

  // Fetch dining options when filter or page changes
  useEffect(() => {
    const fetchDiningOptions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postDiningOptionList(filter, page, pageSize);
        setDiningOptions(response.data);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dining options');
        setDiningOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiningOptions();
  }, [filter, page, pageSize]);

  const handleSearch = useCallback((searchQuery: string) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, searchQuery }));
  }, []);

  const handleFilterByType = useCallback((type: string | undefined) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, type }));
  }, []);

  const handleFilterByStatus = useCallback((status: 'active' | 'inactive' | 'archived' | undefined) => {
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
    diningOptions,
    types,
    loading,
    error,
    page,
    total,
    pageSize,
    filter,
    handleSearch,
    handleFilterByType,
    handleFilterByStatus,
    handlePageChange,
    handleClearFilters,
  };
}
