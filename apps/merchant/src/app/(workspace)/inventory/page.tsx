"use client";

import React, { useState, useMemo } from 'react';
import { MerchantCanvas } from 'zap-design/src/genesis/organisms/merchant-workspace-layout';
import { MetroHeader } from 'zap-design/src/genesis/molecules/layout/MetroHeader';
import { Card } from 'zap-design/src/genesis/atoms/surfaces/card';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from 'zap-design/src/lib/animations';
import {
  Package,
  Search,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Filter,
  Download,
} from 'lucide-react';

// ── Mock Product Data ──────────────────────────────────────
type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

const PRODUCTS: Product[] = [
  { id: '1', name: 'Metro Dark Roast Coffee', sku: 'ZAP-COF-001', category: 'Beverages', price: 14.99, stock: 342, status: 'In Stock' },
  { id: '2', name: 'Olympus Energy Bar', sku: 'ZAP-BAR-012', category: 'Snacks', price: 3.49, stock: 18, status: 'Low Stock' },
  { id: '3', name: 'Zeus Lightning Cable', sku: 'ZAP-CBL-003', category: 'Electronics', price: 24.99, stock: 0, status: 'Out of Stock' },
  { id: '4', name: 'Athena Smart Notebook', sku: 'ZAP-NTB-007', category: 'Office', price: 19.99, stock: 156, status: 'In Stock' },
  { id: '5', name: 'Spike Protein Shake', sku: 'ZAP-SHK-009', category: 'Beverages', price: 6.99, stock: 8, status: 'Low Stock' },
  { id: '6', name: 'Ralph Security Camera', sku: 'ZAP-CAM-015', category: 'Electronics', price: 89.99, stock: 64, status: 'In Stock' },
  { id: '7', name: 'Hermes Delivery Bag', sku: 'ZAP-BAG-021', category: 'Accessories', price: 34.99, stock: 0, status: 'Out of Stock' },
  { id: '8', name: 'Apollo LED Desk Lamp', sku: 'ZAP-LMP-004', category: 'Office', price: 49.99, stock: 92, status: 'In Stock' },
];

// ── Status Badge ───────────────────────────────────────────
const StatusBadge = ({ status }: { status: Product['status'] }) => {
  const map = {
    'In Stock': 'bg-feedback-success/15 text-feedback-success border-feedback-success/30',
    'Low Stock': 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
    'Out of Stock': 'bg-feedback-error/15 text-feedback-error border-feedback-error/30',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${map[status]}`}>
      {status}
    </span>
  );
};

// ── Column Defs ────────────────────────────────────────────
type SortKey = 'name' | 'price' | 'stock';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let items = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );
    items.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return items;
  }, [search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((p) => p.id)));
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 group text-left">
      <span>{label}</span>
      <ArrowUpDown size={12} className={`transition-colors ${sortKey === field ? 'text-primary' : 'text-on-surface-variant/30 group-hover:text-on-surface-variant'}`} />
    </button>
  );

  return (
    <MerchantCanvas>
      <div className="w-full max-w-7xl mx-auto mb-6">
        <MetroHeader
          breadcrumb="Merchant Workspace / Inventory"
          title="Inventory Matrix"
          badge={null}
          rightSlot={
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 bg-layer-base/50 backdrop-blur-md">
                <Download size={16} />
                Export
              </Button>
              <Button variant="primary" className="gap-2 shadow-[0_0_20px_rgba(var(--sys-color-primary-rgb),0.3)]">
                <Plus size={16} />
                Add Product
              </Button>
            </div>
          }
        />
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto pb-20 space-y-4">
        {/* Toolbar */}
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-layer-panel border border-border/50 text-on-surface text-sm font-body placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={14} />
            Filters
          </Button>
          {selectedIds.size > 0 && (
            <Text className="text-xs text-primary font-bold ml-2">
              {selectedIds.size} selected
            </Text>
          )}
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeUp}>
          <Card className="overflow-hidden bg-layer-panel/60 backdrop-blur-xl border border-white/5 dark:border-white/10 [border-radius:var(--layer-2-border-radius)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filtered.length && filtered.length > 0}
                        onChange={toggleAll}
                        className="rounded accent-primary"
                      />
                    </th>
                    <th className="p-4 text-left"><SortHeader label="Product" field="name" /></th>
                    <th className="p-4 text-left">SKU</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-right"><SortHeader label="Price" field="price" /></th>
                    <th className="p-4 text-right"><SortHeader label="Stock" field="stock" /></th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className={`border-b border-border/20 transition-colors hover:bg-layer-base/50 ${selectedIds.has(product.id) ? 'bg-primary/5' : ''}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="rounded accent-primary"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-layer-base flex items-center justify-center text-on-surface-variant shrink-0">
                            <Package size={16} />
                          </div>
                          <Text className="font-bold text-on-surface">{product.name}</Text>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-on-surface-variant">{product.sku}</td>
                      <td className="p-4 text-on-surface-variant">{product.category}</td>
                      <td className="p-4 text-right font-bold text-on-surface">${product.price.toFixed(2)}</td>
                      <td className="p-4 text-right font-bold text-on-surface">{product.stock}</td>
                      <td className="p-4 text-center"><StatusBadge status={product.status} /></td>
                      <td className="p-4 text-center">
                        <button className="text-on-surface-variant/50 hover:text-on-surface transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-12 text-center">
                        <Text className="text-on-surface-variant/50 font-medium">No products match your search.</Text>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
              <Text className="text-xs text-on-surface-variant font-medium">
                Showing {filtered.length} of {PRODUCTS.length} products
              </Text>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" disabled className="text-xs">Previous</Button>
                <Button variant="ghost" size="sm" className="text-xs bg-primary/10 text-primary">1</Button>
                <Button variant="ghost" size="sm" disabled className="text-xs">Next</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-layer-panel/60 backdrop-blur-xl border border-white/5 dark:border-white/10 [border-radius:var(--layer-2-border-radius)]">
            <Text className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Total Products</Text>
            <Heading level={3} className="text-2xl font-display font-bold mt-1">{PRODUCTS.length}</Heading>
          </Card>
          <Card className="p-4 bg-layer-panel/60 backdrop-blur-xl border border-white/5 dark:border-white/10 [border-radius:var(--layer-2-border-radius)]">
            <Text className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Low Stock Alerts</Text>
            <Heading level={3} className="text-2xl font-display font-bold mt-1 text-yellow-500">
              {PRODUCTS.filter(p => p.status === 'Low Stock').length}
            </Heading>
          </Card>
          <Card className="p-4 bg-layer-panel/60 backdrop-blur-xl border border-white/5 dark:border-white/10 [border-radius:var(--layer-2-border-radius)]">
            <Text className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Catalog Value</Text>
            <Heading level={3} className="text-2xl font-display font-bold mt-1">
              ${PRODUCTS.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Heading>
          </Card>
        </motion.div>
      </motion.div>
    </MerchantCanvas>
  );
}
