import { Category, CategoryFilter, CategoryResponse } from '../feature/category/models/category.model';

// Mock category data matching the canonical Category model
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-001',
    name: 'Electronics',
    is_active: true,
    icon_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60',
    item_count: 125,
    materialized_path: 'root / electronics',
    channels: ['Web', 'App', 'POS'],
  },
  {
    id: 'cat-002',
    name: 'Accessories',
    is_active: true,
    icon_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=60',
    item_count: 84,
    materialized_path: 'root / accessories',
    channels: ['Web', 'App'],
  },
  {
    id: 'cat-003',
    name: 'Audio',
    is_active: true,
    icon_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    item_count: 42,
    materialized_path: 'root / audio',
    channels: ['Web', 'POS'],
  },
  {
    id: 'cat-004',
    name: 'Storage',
    is_active: true,
    icon_url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=800&auto=format&fit=crop&q=60',
    item_count: 37,
    materialized_path: 'root / storage',
    channels: ['Web'],
  },
  {
    id: 'cat-005',
    name: 'Cables & Adapters',
    is_active: true,
    icon_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
    item_count: 156,
    materialized_path: 'root / cables-adapters',
    channels: ['Web', 'App', 'POS'],
  },
  {
    id: 'cat-006',
    name: 'Peripherals',
    is_active: true,
    icon_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60',
    item_count: 63,
    materialized_path: 'root / peripherals',
    channels: ['Web', 'App'],
  },
  {
    id: 'cat-007',
    name: 'Networking',
    is_active: false,
    icon_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
    item_count: 12,
    materialized_path: 'root / networking',
    channels: ['POS'],
  },
  {
    id: 'cat-008',
    name: 'Components',
    is_active: true,
    icon_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=60',
    item_count: 94,
    materialized_path: 'root / components',
    channels: ['Web', 'App'],
  },
];

export async function getMockCategories(filter?: CategoryFilter, page = 1, pageSize = 10): Promise<CategoryResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let filtered = [...MOCK_CATEGORIES];

  if (filter) {
    if (filter.search) {
      const query = filter.search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(query)
      );
    }
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);

  return { 
    items: data, 
    total_record: total, 
    total_page: Math.ceil(total / pageSize), 
    page_index: page, 
    page_size: pageSize 
  };
}

export async function getMockCategoryById(id: string): Promise<Category | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_CATEGORIES.find((c) => c.id === id) || null;
}
