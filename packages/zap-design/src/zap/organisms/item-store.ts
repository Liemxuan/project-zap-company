import { create } from 'zustand';

export interface Item {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'pending';
    price: string;
}

interface ItemStore {
    items: Item[];
    searchQuery: string;
    
    // Actions
    setSearchQuery: (query: string) => void;
    addItem: (item: Item) => void;
    updateItem: (id: string, updates: Partial<Item>) => void;
    deleteItem: (id: string) => void;
    duplicateItem: (id: string) => void;
}

const MOCK_ITEMS: Item[] = [
    { id: 'ITM-001', name: 'Alpha Scanner', description: 'Handheld biometric scanner for secure entry.', status: 'active', price: '$299.00' },
    { id: 'ITM-002', name: 'Beta Console', description: 'Unified management module for L2 infrastructure.', status: 'pending', price: '$1,250.00' },
    { id: 'ITM-003', name: 'Gamma Relay', description: 'Sub-surface signal amplifier for deep vault nodes.', status: 'active', price: '$450.00' },
    { id: 'ITM-004', name: 'Delta Shield', description: 'Electromagnetic interference dampener for high-load racks.', status: 'inactive', price: '$890.00' },
    { id: 'ITM-005', name: 'Epsilon Node', description: 'Autonomous edge-computing unit with L1 redundancy.', status: 'active', price: '$2,100.00' },
];

export const useItemStore = create<ItemStore>((set) => ({
    items: MOCK_ITEMS,
    searchQuery: '',

    setSearchQuery: (searchQuery) => set({ searchQuery }),

    addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
    })),

    updateItem: (id, updates) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, ...updates } : item)
    })),

    deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
    })),

    duplicateItem: (id) => set((state) => {
        const original = state.items.find(item => item.id === id);
        if (!original) return state;
        
        const newItem = { 
            ...original, 
            id: `${original.id}-COPY-${Math.floor(Math.random() * 1000)}`, 
            name: `${original.name} (Copy)` 
        };
        
        return { items: [...state.items, newItem] };
    }),
}));
