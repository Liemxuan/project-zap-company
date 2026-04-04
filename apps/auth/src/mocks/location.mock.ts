import { Location, LocationFilter, LocationResponse } from '../feature/location/models/location.model';

// Mock location data based on warehouse list response
export const MOCK_LOCATIONS: Location[] = [
    {
        "id": "f47ac10b-fa24-4372-a567-6f5400000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5400000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5400000002",
        "name": "Cà Phê Sữa Đá",
        "warehouse_type": "Ăn Kèm",
        "is_active": true,
        "status_id": 109,
        "address_json": "28510 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5400000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    },
    {
        "id": "f47ac10b-fa24-4372-a567-6f5500000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5500000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5500000002",
        "name": "Phở Bò Kobe",
        "warehouse_type": "Combo",
        "is_active": true,
        "status_id": 104,
        "address_json": "28511 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5500000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    },
    {
        "id": "f47ac10b-fa24-4372-a567-6f5600000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5600000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5600000002",
        "name": "Pizza Hải Sản",
        "warehouse_type": "Món Nước",
        "is_active": true,
        "status_id": 138,
        "address_json": "28512 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5600000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    },
    {
        "id": "f47ac10b-fa24-4372-a567-6f5700000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5700000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5700000002",
        "name": "Gà Rán Phần 4 Người",
        "warehouse_type": "Món Khô",
        "is_active": true,
        "status_id": 125,
        "address_json": "28513 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5700000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    },
    {
        "id": "f47ac10b-fa24-4372-a567-6f5800000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5800000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5800000002",
        "name": "Phở Gà",
        "warehouse_type": "Đồ Uống",
        "is_active": true,
        "status_id": 146,
        "address_json": "28514 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5800000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    },
    {
        "id": "f47ac10b-fa24-4372-a567-6f5900000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5900000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5900000002",
        "name": "Phở Nạm Tiêu Đen",
        "warehouse_type": "Tráng Miệng",
        "is_active": true,
        "status_id": 100,
        "address_json": "28515 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5900000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    },
    {
        "id": "f47ac10b-fa24-4372-a567-6f5a00000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5a00000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5a00000002",
        "name": "Gỏi Cuốn Phở 24",
        "warehouse_type": "Ăn Kèm",
        "is_active": true,
        "status_id": 143,
        "address_json": "28516 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5a00000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    },
    {
        "id": "f47ac10b-fa24-4372-a567-6f5b00000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5b00000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5b00000002",
        "name": "Cơm Chiên Dương Châu",
        "warehouse_type": "Combo",
        "is_active": true,
        "status_id": 75,
        "address_json": "28517 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5b00000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    },
    {
        "id": "f47ac10b-fa24-4372-a567-6f5c00000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5c00000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5c00000002",
        "name": "Phở Trộn Xì Dầu",
        "warehouse_type": "Món Nước",
        "is_active": true,
        "status_id": 131,
        "address_json": "28518 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5c00000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    },
    {
        "id": "f47ac10b-fa24-4372-a567-6f5d00000000",
        "tenant_id": "f47ac10b-fa24-4372-a567-6f5d00000001",
        "legacy_id": "f47ac10b-fa24-4372-a567-6f5d00000002",
        "name": "Trà Sữa Trân Châu",
        "warehouse_type": "Món Khô",
        "is_active": true,
        "status_id": 64,
        "address_json": "28519 Lê Lợi, P.Bến Nghé, Quận 1",
        "manager_id": "f47ac10b-fa24-4372-a567-6f5d00000007",
        "created_at": "2026-03-28T14:45:14.059Z",
        "updated_at": "2026-03-28T14:45:14.059Z"
    }
];

export async function getMockLocations(filter?: LocationFilter, page = 1, pageSize = 10): Promise<LocationResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let filtered = [...MOCK_LOCATIONS];

  if (filter) {
    if (filter.search) {
      const query = filter.search.toLowerCase();
      filtered = filtered.filter(
        (l) => l.name.toLowerCase().includes(query) ||
               l.warehouse_type.toLowerCase().includes(query) ||
               l.address_json.toLowerCase().includes(query)
      );
    }
    if (filter.filters?.is_active && filter.filters.is_active.length > 0) {
      filtered = filtered.filter((l) => filter.filters?.is_active?.includes(l.is_active));
    }
    if (filter.filters?.warehouse_type && filter.filters.warehouse_type.length > 0) {
      filtered = filtered.filter((l) => filter.filters?.warehouse_type?.includes(l.warehouse_type));
    }
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);

  return { 
    success: true,
    code: 200,
    message: "OK",
    data: {
        total_page: Math.ceil(total / pageSize),
        total_record: total,
        page_index: page,
        page_size: pageSize,
        items: data
    }
  };
}

export async function getMockLocationById(id: string): Promise<Location | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_LOCATIONS.find((l) => l.id === id) || null;
}

export async function getMockLocationCities(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const cities = new Set(MOCK_LOCATIONS.map((l) => l.address_json.split(',').pop()?.trim() || ''));
  return Array.from(cities).filter(Boolean).sort();
}

