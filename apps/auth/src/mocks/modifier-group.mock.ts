/**
 * Modifier Group Mock Data
 */

import {
  ModifierGroup,
  ModifierGroupFilter,
  ModifierGroupResponse,
} from '../feature/modifier-group/models/modifier-group.model';

const mockModifierGroups: ModifierGroup[] = [
  {
    id: '1',
    name: 'Size',
    description: 'Choose your size',
    status: 'active',
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: 's1', name: 'Small', price: 0, isDefault: true },
      { id: 's2', name: 'Medium', price: 1 },
      { id: 's3', name: 'Large', price: 2 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Toppings',
    description: 'Add extra toppings',
    status: 'active',
    minSelect: 0,
    maxSelect: 5,
    options: [
      { id: 't1', name: 'Cheese', price: 0.5 },
      { id: 't2', name: 'Bacon', price: 1 },
      { id: 't3', name: 'Onions', price: 0.25 },
      { id: 't4', name: 'Pepperoni', price: 1.5 },
    ],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Sauce',
    description: 'Select your sauce',
    status: 'active',
    minSelect: 1,
    maxSelect: 2,
    options: [
      { id: 'sc1', name: 'Tomato', price: 0, isDefault: true },
      { id: 'sc2', name: 'Alfredo', price: 0.5 },
      { id: 'sc3', name: 'BBQ', price: 0.5 },
      { id: 'sc4', name: 'Spicy', price: 0 },
    ],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'Temperature',
    description: 'Choose temperature',
    status: 'active',
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: 'temp1', name: 'Hot', price: 0, isDefault: true },
      { id: 'temp2', name: 'Warm', price: 0 },
      { id: 'temp3', name: 'Cold', price: 0 },
    ],
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'Drink Size',
    description: 'Select drink size',
    status: 'active',
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: 'd1', name: 'Small (250ml)', price: 0 },
      { id: 'd2', name: 'Medium (500ml)', price: 0.5, isDefault: true },
      { id: 'd3', name: 'Large (750ml)', price: 1 },
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    name: 'Extra Ingredients',
    description: 'Add extra ingredients',
    status: 'inactive',
    minSelect: 0,
    maxSelect: 3,
    options: [
      { id: 'e1', name: 'Garlic', price: 0.3 },
      { id: 'e2', name: 'Mushrooms', price: 0.5 },
      { id: 'e3', name: 'Olives', price: 0.4 },
    ],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '7',
    name: 'Dressing',
    description: 'Choose dressing',
    status: 'active',
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: 'dr1', name: 'Ranch', price: 0, isDefault: true },
      { id: 'dr2', name: 'Caesar', price: 0 },
      { id: 'dr3', name: 'Vinaigrette', price: 0 },
    ],
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
  {
    id: '8',
    name: 'Meat Type',
    description: 'Select meat type',
    status: 'active',
    minSelect: 1,
    maxSelect: 2,
    options: [
      { id: 'm1', name: 'Chicken', price: 0, isDefault: true },
      { id: 'm2', name: 'Beef', price: 1.5 },
      { id: 'm3', name: 'Fish', price: 2 },
      { id: 'm4', name: 'Vegetarian', price: 0 },
    ],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
];

export function getMockModifierGroups(
  filter?: ModifierGroupFilter,
  page = 1,
  pageSize = 10
): ModifierGroupResponse {
  let filtered = [...mockModifierGroups];

  // Apply search filter
  if (filter?.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.description?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filter?.status) {
    filtered = filtered.filter((group) => group.status === filter.status);
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

export function getMockModifierGroupById(id: string): ModifierGroup | null {
  return mockModifierGroups.find((group) => group.id === id) || null;
}
