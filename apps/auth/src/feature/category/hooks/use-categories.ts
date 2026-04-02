'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryFilter, CategoryResponse } from '../models/category.model';
import { postCategoryList } from '../services/category.service';

export function useCategories(initialPage = 1, initialPageSize = 10) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filter, setFilter] = useState<CategoryFilter>({});

  // Sync internal page state with initialPage prop when it changes (URL driven)
  useEffect(() => {
    setPageIndex(initialPage);
  }, [initialPage]);

  // Fetch categories when filter or page changes
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postCategoryList(filter, pageIndex, pageSize);
        setCategories(response.items);
        setTotalRecords(response.total_record);
        setTotalPages(response.total_page);
        setPageIndex(response.page_index);
        setPageSize(response.page_size);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        setCategories([]);
        setTotalRecords(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [filter, pageIndex, pageSize]);

  const handleSearch = useCallback((searchQuery: string) => {
    setPageIndex(1);
    setFilter((prev) => ({ ...prev, searchQuery }));
  }, []);

  const handleFilterByStatus = useCallback((status: 'active' | 'inactive' | undefined) => {
    setPageIndex(1);
    setFilter((prev) => ({ ...prev, status }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPageIndex(newPage);
  }, []);

  const handleClearFilters = useCallback(() => {
    setPageIndex(1);
    setFilter({});
  }, []);

  return {
    categories,
    loading,
    error,
    pageIndex,
    totalRecords,
    totalPages,
    pageSize,
    filter,
    handleSearch,
    handleFilterByStatus,
    handlePageChange,
    handleClearFilters,
  };
}
