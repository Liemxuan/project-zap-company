import { Category, CategoryFilter, CategoryResponse } from '../feature/category/models/category.model';

// Mock category data
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-001',
    name: 'Electronics',
    description: 'Computers, gadgets, and electronic devices',
    slug: 'electronics',
    status: 'active',
    productCount: 125,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-15'),
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60',
    channels: ['Web', 'App', 'POS'],
  },
  {
    id: 'cat-002',
    name: 'Accessories',
    description: 'Peripheral devices and computer accessories',
    slug: 'accessories',
    status: 'active',
    productCount: 84,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-03-10'),
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=60',
    channels: ['Web', 'App'],
  },
  {
    id: 'cat-003',
    name: 'Audio',
    description: 'Headphones, speakers, and sound equipment',
    slug: 'audio',
    status: 'active',
    productCount: 42,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-20'),
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    channels: ['Web', 'POS'],
  },
  {
    id: 'cat-004',
    name: 'Storage',
    description: 'Hard drives, SSDs, and external storage',
    slug: 'storage',
    status: 'active',
    productCount: 37,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-18'),
    image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=800&auto=format&fit=crop&q=60',
    channels: ['Web'],
  },
  {
    id: 'cat-005',
    name: 'Cables & Adapters',
    description: 'Connection cables and power adapters',
    slug: 'cables-adapters',
    status: 'active',
    productCount: 156,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-12'),
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
    channels: ['Web', 'App', 'POS'],
  },
  {
    id: 'cat-006',
    name: 'Peripherals',
    description: 'Keyboards, mice, and other input devices',
    slug: 'peripherals',
    status: 'active',
    productCount: 63,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-03-19'),
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60',
    channels: ['Web', 'App'],
  },
  {
    id: 'cat-007',
    name: 'Networking',
    description: 'Routers, switches, and network equipment',
    slug: 'networking',
    status: 'inactive',
    productCount: 12,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-05'),
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
    channels: ['POS'],
  },
  {
    id: 'cat-008',
    name: 'Components',
    description: 'Internal computer parts and CPU/RAM',
    slug: 'components',
    status: 'active',
    productCount: 94,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-21'),
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=60',
    channels: ['Web', 'App'],
  },
];

export async function getMockCategories(filter?: CategoryFilter, page = 1, pageSize = 10): Promise<CategoryResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let filtered = [...MOCK_CATEGORIES];

  if (filter) {
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
      );
    }
    if (filter.status) {
      filtered = filtered.filter((c) => c.status === filter.status);
    }
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);

  return { data, total, page, pageSize };
}

export async function getMockCategoryById(id: string): Promise<Category | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_CATEGORIES.find((c) => c.id === id) || null;
}
