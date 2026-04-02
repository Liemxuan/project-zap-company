import { DiningOption, DiningOptionFilter, DiningOptionResponse } from '../feature/dining-option/models/dining-option.model';

// Mock dining option data
export const MOCK_DINING_OPTIONS: DiningOption[] = [
  {
    id: 'dining-001',
    name: 'Dine-In',
    description: 'Traditional restaurant seating experience',
    type: 'dine-in',
    availableHours: '11:00 - 23:00',
    minOrderValue: 0,
    maxCapacity: 200,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-20'),
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'dining-002',
    name: 'Take away',
    description: 'Quick pickup service for prepared meals',
    type: 'take-away',
    availableHours: '10:00 - 22:00',
    minOrderValue: 5,
    maxCapacity: undefined,
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-18'),
    image: 'https://images.unsplash.com/photo-1526367790999-015078648402?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'dining-003',
    name: 'Delivery',
    description: 'Door-to-door food delivery',
    type: 'delivery',
    availableHours: '11:00 - 22:00',
    minOrderValue: 10,
    maxCapacity: undefined,
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-17'),
    image: 'https://images.unsplash.com/photo-1526367790999-015078648402?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'dining-004',
    name: 'Pick-up',
    description: 'Fast service counter for quick meals',
    type: 'pickup',
    availableHours: '08:00 - 20:00',
    minOrderValue: 2,
    maxCapacity: undefined,
    status: 'active',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-19'),
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=60',
  }
];

export async function getMockDiningOptions(filter?: DiningOptionFilter, page = 1, pageSize = 10): Promise<DiningOptionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let filtered = [...MOCK_DINING_OPTIONS];

  if (filter) {
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) => d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.type.toLowerCase().includes(query)
      );
    }
    if (filter.type) {
      filtered = filtered.filter((d) => d.type === filter.type);
    }
    if (filter.status) {
      filtered = filtered.filter((d) => d.status === filter.status);
    }
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);

  return { data, total, page, pageSize };
}

export async function getMockDiningOptionById(id: string): Promise<DiningOption | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_DINING_OPTIONS.find((d) => d.id === id) || null;
}

export async function getMockDiningOptionTypes(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const types = new Set(MOCK_DINING_OPTIONS.map((d) => d.type));
  return Array.from(types).sort();
}
