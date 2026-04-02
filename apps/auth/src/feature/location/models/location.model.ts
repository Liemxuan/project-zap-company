/**
 * Location Model
 * Types and interfaces for Location feature
 */

export type LocationStatus = 'active' | 'inactive' | 'archived';

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  status: LocationStatus;
  image?: string;
  openingHours: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationFilter {
  searchQuery?: string;
  city?: string;
  country?: string;
  status?: LocationStatus;
}

export interface LocationResponse {
  data: Location[];
  total: number;
  page: number;
  pageSize: number;
}
