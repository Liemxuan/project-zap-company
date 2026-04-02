'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProductsServer } from '../services/product.server';
import type { Product, ProductFilter } from '../models/product.model';

export function useProducts(initialPage = 1, initialPageSize = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filter] = useState<ProductFilter>({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProductsServer(filter, initialPage, initialPageSize);
      setProducts(result.items);
      setTotal(result.total_record);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filter, initialPage, initialPageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, total };
}
