/**
 * Brand Mock Data
 */

import { Brand, BrandFilter, BrandResponse } from '../feature/brand/models/brand.model';

const mockBrands: Brand[] = [
  {
    id: '1',
    tenant_id: 'tenant-1',
    name: 'Sony',
    slug: 'sony',
    logo_url: 'https://images.unsplash.com/photo-1590650516494-23cc04fc4159?w=300&h=300&fit=crop',
    status_id: 1,
    is_premium: true,
  },
  {
    id: '2',
    tenant_id: 'tenant-1',
    name: 'Nike',
    slug: 'nike',
    logo_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    status_id: 1,
    is_premium: true,
  },
  {
    id: '3',
    tenant_id: 'tenant-1',
    name: 'Apple',
    slug: 'apple',
    logo_url: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300&h=300&fit=crop',
    status_id: 1,
    is_premium: true,
  },
  {
    id: '4',
    tenant_id: 'tenant-1',
    name: 'Samsung',
    slug: 'samsung',
    logo_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop',
    status_id: 1,
    is_premium: false,
  },
  {
    id: '5',
    tenant_id: 'tenant-1',
    name: 'LG',
    slug: 'lg',
    logo_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&h=300&fit=crop',
    status_id: 2,
    is_premium: false,
  },
  {
    id: '6',
    tenant_id: 'tenant-1',
    name: 'Adidas',
    slug: 'adidas',
    logo_url: 'https://images.unsplash.com/photo-1518002171953-a080ee81be4e?w=300&h=300&fit=crop',
    status_id: 1,
    is_premium: true,
  },
  {
    id: '7',
    tenant_id: 'tenant-1',
    name: 'Puma',
    slug: 'puma',
    logo_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop',
    status_id: 1,
    is_premium: false,
  },
  {
    id: '8',
    tenant_id: 'tenant-1',
    name: 'Coca-Cola',
    slug: 'coca-cola',
    logo_url: 'https://images.unsplash.com/photo-1533261640-c3d3e239f606?w=300&h=300&fit=crop',
    status_id: 1,
    is_premium: false,
  },
  {
    id: '9',
    tenant_id: 'tenant-1',
    name: 'Pepsi',
    slug: 'pepsi',
    logo_url: 'https://images.unsplash.com/photo-1629203851022-3cd262ea1de4?w=300&h=300&fit=crop',
    status_id: 2,
    is_premium: false,
  },
  {
    id: '10',
    tenant_id: 'tenant-1',
    name: 'Mercedes-Benz',
    slug: 'mercedes-benz',
    logo_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=300&fit=crop',
    status_id: 1,
    is_premium: true,
  },
];

export function getMockBrands(filter?: BrandFilter, page = 1, pageSize = 10): BrandResponse {
  let filtered = [...mockBrands];

  // Apply search filter
  if (filter?.search) {
    const query = filter.search.toLowerCase();
    filtered = filtered.filter(
      (brand) =>
        brand.name.toLowerCase().includes(query) ||
        brand.slug.toLowerCase().includes(query)
    );
  }

  // Paginate
  const total_record = filtered.length;
  const total_page = Math.ceil(total_record / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);

  return {
    items,
    total_record,
    total_page,
    page_index: page,
    page_size: pageSize,
  };
}

export function getMockBrandById(id: string): Brand | null {
  return mockBrands.find((brand) => brand.id === id) || null;
}
