import { Location, LocationFilter, LocationResponse } from '../feature/location/models/location.model';

// Mock location data
export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'loc-001',
    name: 'Downtown Branch',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA',
    postalCode: '10001',
    phone: '+1-212-555-0100',
    email: 'downtown@zap.com',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60',
    openingHours: '08:00 - 22:00',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    id: 'loc-002',
    name: 'Westside Location',
    address: '456 West Ave',
    city: 'Los Angeles',
    country: 'USA',
    postalCode: '90001',
    phone: '+1-213-555-0200',
    email: 'westside@zap.com',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=60',
    openingHours: '10:00 - 23:00',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-18'),
  },
  {
    id: 'loc-003',
    name: 'Marina Branch',
    address: '789 Waterfront Drive',
    city: 'San Francisco',
    country: 'USA',
    postalCode: '94105',
    phone: '+1-415-555-0300',
    email: 'marina@zap.com',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
    openingHours: '11:00 - 21:00',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-17'),
  },
  {
    id: 'loc-004',
    name: 'Airport Hub',
    address: '1000 Terminal Road',
    city: 'Chicago',
    country: 'USA',
    postalCode: '60666',
    phone: '+1-773-555-0400',
    email: 'airport@zap.com',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=60',
    openingHours: '06:00 - 23:59',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-19'),
  },
  {
    id: 'loc-005',
    name: 'Uptown Cafe',
    address: '321 North Street',
    city: 'Boston',
    country: 'USA',
    postalCode: '02101',
    phone: '+1-617-555-0500',
    email: 'uptown@zap.com',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60',
    openingHours: '09:00 - 18:00',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'loc-006',
    name: 'Harbor View',
    address: '555 Pier Street',
    city: 'Seattle',
    country: 'USA',
    postalCode: '98101',
    phone: '+1-206-555-0600',
    email: 'harbor@zap.com',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1464347601390-25e2842a37f7?w=800&auto=format&fit=crop&q=60',
    openingHours: '07:00 - 22:00',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 'loc-007',
    name: 'Midtown Plaza',
    address: '888 Central Ave',
    city: 'Miami',
    country: 'USA',
    postalCode: '33128',
    phone: '+1-305-555-0700',
    email: 'midtown@zap.com',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60',
    openingHours: '08:00 - 23:00',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-16'),
  },
  {
    id: 'loc-008',
    name: 'Tech Park',
    address: '999 Innovation Drive',
    city: 'Austin',
    country: 'USA',
    postalCode: '78701',
    phone: '+1-512-555-0800',
    email: 'techpark@zap.com',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60',
    openingHours: '08:00 - 20:00',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-14'),
  },
];

export async function getMockLocations(filter?: LocationFilter, page = 1, pageSize = 10): Promise<LocationResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let filtered = [...MOCK_LOCATIONS];

  if (filter) {
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) => l.name.toLowerCase().includes(query) ||
               l.city.toLowerCase().includes(query) ||
               l.address.toLowerCase().includes(query)
      );
    }
    if (filter.city) {
      filtered = filtered.filter((l) => l.city === filter.city);
    }
    if (filter.country) {
      filtered = filtered.filter((l) => l.country === filter.country);
    }
    if (filter.status) {
      filtered = filtered.filter((l) => l.status === filter.status);
    }
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);

  return { data, total, page, pageSize };
}

export async function getMockLocationById(id: string): Promise<Location | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_LOCATIONS.find((l) => l.id === id) || null;
}

export async function getMockLocationCities(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const cities = new Set(MOCK_LOCATIONS.map((l) => l.city));
  return Array.from(cities).sort();
}
