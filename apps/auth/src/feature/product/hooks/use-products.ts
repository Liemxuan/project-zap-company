'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/product.service';
import type { Product, ProductFilter } from '../models/product.model';

export function useProducts(initialPage = 1, initialPageSize = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filter] = useState<ProductFilter>({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProducts(filter, initialPage, initialPageSize);
      setProducts(result.items);
      setTotalRecords(result.total_record);
      setTotalPages(result.total_page);
      setPageIndex(result.page_index);
      setPageSize(result.page_size);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filter, initialPage, initialPageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    totalRecords, 
    totalPages, 
    pageIndex, 
    pageSize 
  };
}
