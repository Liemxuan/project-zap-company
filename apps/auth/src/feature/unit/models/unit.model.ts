/**
 * Unit Model
 * Types and interfaces for Unit feature
 */

export type UnitStatus = 'active' | 'inactive';

export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  description?: string;
  status: UnitStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnitFilter {
  searchQuery?: string;
  status?: UnitStatus;
}

export interface UnitResponse {
  data: Unit[];
  total: number;
  page: number;
  pageSize: number;
}
