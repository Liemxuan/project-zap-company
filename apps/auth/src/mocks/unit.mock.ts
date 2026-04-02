/**
 * Unit Mock Data
 */

import { Unit, UnitFilter, UnitResponse } from '../feature/unit/models/unit.model';

const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Piece',
    abbreviation: 'pcs',
    description: 'Individual item',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Kilogram',
    abbreviation: 'kg',
    description: 'Weight unit',
    status: 'active',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Gram',
    abbreviation: 'g',
    description: 'Small weight unit',
    status: 'active',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'Liter',
    abbreviation: 'L',
    description: 'Volume unit',
    status: 'active',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'Milliliter',
    abbreviation: 'mL',
    description: 'Small volume unit',
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    name: 'Box',
    abbreviation: 'box',
    description: 'Container unit',
    status: 'active',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '7',
    name: 'Pack',
    abbreviation: 'pack',
    description: 'Package unit',
    status: 'active',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
  {
    id: '8',
    name: 'Dozen',
    abbreviation: 'dz',
    description: 'Twelve items',
    status: 'inactive',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '9',
    name: 'Set',
    abbreviation: 'set',
    description: 'Collection unit',
    status: 'active',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: '10',
    name: 'Pair',
    abbreviation: 'pr',
    description: 'Two items',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

export function getMockUnits(filter?: UnitFilter, page = 1, pageSize = 10): UnitResponse {
  let filtered = [...mockUnits];

  // Apply search filter
  if (filter?.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) ||
        unit.abbreviation.toLowerCase().includes(query) ||
        unit.description?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filter?.status) {
    filtered = filtered.filter((unit) => unit.status === filter.status);
  }

  // Paginate
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);

  return {
    data,
    total,
    page,
    pageSize,
  };
}

export function getMockUnitById(id: string): Unit | null {
  return mockUnits.find((unit) => unit.id === id) || null;
}
