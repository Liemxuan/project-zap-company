'use client';

import { useState, useEffect, useCallback } from 'react';
import { Brand, BrandFilter, BrandResponse } from '../models/brand.model';
import { getBrands } from '../services/brand.service';

export function useBrands(initialPage = 1, pageSize = 10) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<BrandFilter>({});

  // Sync internal page state with initialPage prop when it changes
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  // Fetch brands when filter or page changes
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getBrands(filter, page, pageSize);
        setBrands(response.items);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brands');
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [filter, page, pageSize]);

  const handleSearch = useCallback((searchQuery: string) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, search: searchQuery }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleClearFilters = useCallback(() => {
    setPage(1);
    setFilter({});
  }, []);

  return {
    brands,
    loading,
    error,
    page,
    total,
    pageSize,
    filter,
    handleSearch,
    handlePageChange,
    handleClearFilters,
  };
}
