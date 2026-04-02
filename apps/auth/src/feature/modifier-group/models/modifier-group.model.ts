/**
 * Modifier Group Model
 * Types and interfaces for Modifier Group feature
 */

export type ModifierGroupStatus = 'active' | 'inactive';

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  description?: string;
  status: ModifierGroupStatus;
  minSelect: number;
  maxSelect: number;
  options: ModifierOption[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ModifierGroupFilter {
  searchQuery?: string;
  status?: ModifierGroupStatus;
}

export interface ModifierGroupResponse {
  data: ModifierGroup[];
  total: number;
  page: number;
  pageSize: number;
}
