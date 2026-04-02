/**
 * Category Service
 * Handles category data fetching and manipulation with real API (100% no mock)
 */

import { Category, CategoryFilter, CategoryResponse } from '../models/category.model';
import { getCategoriesServer } from './category.server';

/**
 * Fetch all categories with optional filtering (calls server action)
 */
export async function getCategories(filter?: CategoryFilter, page = 1, pageSize = 10): Promise<CategoryResponse> {
  return getCategoriesServer(filter, page, pageSize);
}

/**
 * Fetch single category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  // TODO: Implement if API provides this endpoint
  console.warn(`[Category API] getCategoryById not yet implemented for ${id}`);
  return null;
}

/**
 * Fetch category list (alias for getCategories)
 */
export async function postCategoryList(filter?: CategoryFilter, page = 1, pageSize = 10): Promise<CategoryResponse> {
  return getCategories(filter, page, pageSize);
}
