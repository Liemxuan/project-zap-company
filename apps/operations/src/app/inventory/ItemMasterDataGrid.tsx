'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';

interface InventoryItem {
  id: string;
  name: string;
  item_type: string;
  base_unit_measure: string;
  current_cost: string;
  yield_percentage: string;
}

export function ItemMasterDataGrid({ tenantId }: { tenantId: string }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Item Form State
  const [newItemParams, setNewItemParams] = useState({
    name: '',
    base_unit_measure: 'oz',
    current_cost: '0.00',
    yield_percentage: '100.00'
  });

  useEffect(() => {
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/inventory/items?tenant_id=${tenantId}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/inventory/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          ...newItemParams,
          current_cost: parseFloat(newItemParams.current_cost),
          yield_percentage: parseFloat(newItemParams.yield_percentage)
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchItems(); // Refresh the grid
      }
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Physical Items Master List</h2>
        <Button onClick={() => setShowModal(true)}>Add New Physical Item</Button>
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading items...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-3">Item Name</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Base Unit</th>
                <th scope="col" className="px-6 py-3">Current Cost</th>
                <th scope="col" className="px-6 py-3">Yield %</th>
                <th scope="col" className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      {item.item_type || 'RAW_MATERIAL'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.base_unit_measure}</td>
                  <td className="px-6 py-4">${Number(item.current_cost).toFixed(2)}</td>
                  <td className="px-6 py-4">{Number(item.yield_percentage).toFixed(2)}%</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No physical items found in the master list.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Simple Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create New Physical Item</h3>
            <div className="space-y-4">
              <div>
                 <label className="text-sm font-medium">Item Name</label>
                 <Input 
                   value={newItemParams.name} 
                   onChange={(e) => setNewItemParams({...newItemParams, name: e.target.value})} 
                   placeholder="e.g. Tomato Paste" 
                 />
              </div>
              <div>
                 <label className="text-sm font-medium">Base Unit of Measure</label>
                 <Input 
                   value={newItemParams.base_unit_measure} 
                   onChange={(e) => setNewItemParams({...newItemParams, base_unit_measure: e.target.value})} 
                   placeholder="e.g. oz, lb, can" 
                 />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">Current Cost ($)</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={newItemParams.current_cost} 
                    onChange={(e) => setNewItemParams({...newItemParams, current_cost: e.target.value})} 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Yield Percentage</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={newItemParams.yield_percentage} 
                    onChange={(e) => setNewItemParams({...newItemParams, yield_percentage: e.target.value})} 
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Save Item</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
