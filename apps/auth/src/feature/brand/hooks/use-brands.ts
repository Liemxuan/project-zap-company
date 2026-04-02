'use client';

import { useState, useEffect, useCallback } from 'react';
import { Brand, BrandFilter, BrandResponse } from '../models/brand.model';
import { getBrands } from '../services/brand.service';

export function useBrands(initialPage = 1, initialPageSize = 10) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filter, setFilter] = useState<BrandFilter>({});

  // Sync internal page state with initialPage prop when it changes
  useEffect(() => {
    setPageIndex(initialPage);
  }, [initialPage]);

  // Fetch brands when filter or page changes
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getBrands(filter, pageIndex, pageSize);
        setBrands(response.items);
        setTotalRecords(response.total_record);
        setTotalPages(response.total_page);
        setPageIndex(response.page_index);
        setPageSize(response.page_size);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brands');
        setBrands([]);
        setTotalRecords(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [filter, pageIndex, pageSize]);

  const handleSearch = useCallback((searchQuery: string) => {
    setPageIndex(1);
    setFilter((prev) => ({ ...prev, search: searchQuery }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPageIndex(newPage);
  }, []);

  const handleClearFilters = useCallback(() => {
    setPageIndex(1);
    setFilter({});
  }, []);

  return {
    brands,
    loading,
    error,
    pageIndex,
    totalRecords,
    totalPages,
    pageSize,
    filter,
    handleSearch,
    handlePageChange,
    handleClearFilters,
  };
}
