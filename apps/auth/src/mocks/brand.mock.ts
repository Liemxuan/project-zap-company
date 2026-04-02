/**
 * Brand Mock Data
 */

import { Brand, BrandFilter, BrandResponse } from '../feature/brand/models/brand.model';

const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Sony',
    description: 'Electronics and entertainment products',
    logo: 'https://via.placeholder.com/100?text=Sony',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Nike',
    description: 'Sports and athletic apparel',
    logo: 'https://via.placeholder.com/100?text=Nike',
    status: 'active',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Apple',
    description: 'Technology and innovation',
    logo: 'https://via.placeholder.com/100?text=Apple',
    status: 'active',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'Samsung',
    description: 'Electronics manufacturer',
    logo: 'https://via.placeholder.com/100?text=Samsung',
    status: 'active',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'LG',
    description: 'Electronics and home appliances',
    logo: 'https://via.placeholder.com/100?text=LG',
    status: 'inactive',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    name: 'Adidas',
    description: 'Sports brand',
    logo: 'https://via.placeholder.com/100?text=Adidas',
    status: 'active',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '7',
    name: 'Puma',
    description: 'Athletic footwear and apparel',
    logo: 'https://via.placeholder.com/100?text=Puma',
    status: 'active',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
  {
    id: '8',
    name: 'Coca-Cola',
    description: 'Beverage brand',
    logo: 'https://via.placeholder.com/100?text=CocaCola',
    status: 'active',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '9',
    name: 'Pepsi',
    description: 'Beverage company',
    logo: 'https://via.placeholder.com/100?text=Pepsi',
    status: 'inactive',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: '10',
    name: 'Mercedes-Benz',
    description: 'Luxury automotive brand',
    logo: 'https://via.placeholder.com/100?text=MercedesBenz',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

export function getMockBrands(filter?: BrandFilter, page = 1, pageSize = 10): BrandResponse {
  let filtered = [...mockBrands];

  // Apply search filter
  if (filter?.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (brand) =>
        brand.name.toLowerCase().includes(query) ||
        brand.description?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filter?.status) {
    filtered = filtered.filter((brand) => brand.status === filter.status);
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

export function getMockBrandById(id: string): Brand | null {
  return mockBrands.find((brand) => brand.id === id) || null;
}
