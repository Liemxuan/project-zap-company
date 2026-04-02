/**
 * Brand Service
 * Handles brand data fetching and manipulation with real API (100% no mock)
 */

import { Brand, BrandFilter, BrandResponse } from '../models/brand.model';
import { getBrandsServer } from './brand.server';

/**
 * Fetch all brands with optional filtering (calls server action)
 */
export async function getBrands(filter?: BrandFilter, page = 1, pageSize = 10): Promise<BrandResponse> {
  return getBrandsServer(filter, page, pageSize);
}

/**
 * Fetch single brand by ID
 */
export async function getBrandById(id: string): Promise<Brand | null> {
  // TODO: Implement if API provides this endpoint
  console.warn(`[Brand API] getBrandById not yet implemented for ${id}`);
  return null;
}
