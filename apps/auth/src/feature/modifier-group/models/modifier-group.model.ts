/**
 * Modifier Group Model
 * Types and interfaces for Modifier Group feature
 * Aligned with real API: /modifiergroups/list
 */

export type ModifierGroupStatus = 'active' | 'inactive';

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

/** Raw API item shape (snake_case) */
export interface ModifierGroupApiItem {
  id: string;
  tenant_id: string;
  legacy_id: string;
  name: string;
  min_selection: number;
  max_selection: number;
  is_required: boolean;
  sort_order: number;
}

/** Frontend-friendly shape (camelCase) */
export interface ModifierGroup {
  id: string;
  tenantId: string;
  legacyId: string;
  name: string;
  description?: string;
  status: ModifierGroupStatus;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  sortOrder: number;
  options: ModifierOption[];
  createdAt?: Date;
  updatedAt?: Date;
}

/** Raw API response envelope */
export interface ModifierGroupApiResponse {
  items: ModifierGroupApiItem[];
  total: number;
  total_page: number;
  total_record: number;
  page_index: number;
  page_size: number;
}

export interface ModifierGroupFilter {
  searchQuery?: string;
  status?: ModifierGroupStatus[];
}

/** Mapped response for frontend consumption */
export interface ModifierGroupResponse {
  data: ModifierGroup[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

/** Map a single API item to frontend model */
export function mapApiItemToModifierGroup(item: ModifierGroupApiItem): ModifierGroup {
  return {
    id: item.id,
    tenantId: item.tenant_id,
    legacyId: item.legacy_id,
    name: item.name,
    minSelect: item.min_selection,
    maxSelect: item.max_selection,
    isRequired: item.is_required,
    sortOrder: item.sort_order,
    status: 'active', // API doesn't return status, default to active
    options: [],
  };
}
