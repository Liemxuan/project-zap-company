/**
 * DiningOption Model
 * Types and interfaces for DiningOption feature
 */

export type DiningOptionStatus = 'active' | 'inactive' | 'archived';

export interface DiningOption {
  id: string;
  name: string;
  description: string;
  type: string; // e.g., 'Dine-in', 'Takeout', 'Delivery'
  availableHours: string;
  minOrderValue?: number;
  maxCapacity?: number;
  status: DiningOptionStatus;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiningOptionFilter {
  searchQuery?: string;
  type?: string;
  status?: DiningOptionStatus;
}

export interface DiningOptionResponse {
  data: DiningOption[];
  total: number;
  page: number;
  pageSize: number;
}
