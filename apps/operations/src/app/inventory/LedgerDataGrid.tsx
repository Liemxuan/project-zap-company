'use client';

import React, { useState, useEffect } from 'react';

// Adjusted to match the Prisma return structure
interface CountEntry {
  id: string;
  location_id: string;
  inventory_item_id: string;
  quantity_on_hand: string;
  quantity_warning: string | null;
  locations: { name: string };
  raw_ingredients: { name: string; base_unit_measure: string; item_type: string };
}

export function LedgerDataGrid({ tenantId }: { tenantId: string }) {
  const [counts, setCounts] = useState<CountEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/inventory/ledger?tenant_id=${tenantId}`);
        if (res.ok) {
          const data = await res.json();
          setCounts(data);
        }
      } catch (error) {
        console.error('Failed to fetch ledger counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [tenantId]);

  // Helper to determine row color based on PAR levels
  const getStatusColor = (onHandStr: string, warningStr: string | null) => {
    if (!warningStr) return 'bg-white'; // No PAR level set
    
    const onHand = parseFloat(onHandStr);
    const par = parseFloat(warningStr);
    
    if (onHand <= 0) return 'bg-red-50 border-red-200'; // Critical Out
    if (onHand <= par) return 'bg-yellow-50 border-yellow-200'; // Warning
    return 'bg-green-50 border-green-200'; // Healthy
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Scanning Walk-in Ledgers...</div>;

  // Group by Location for cleaner display
  const groupedCounts = counts.reduce((acc, curr) => {
    const locName = curr.locations.name;
    if (!acc[locName]) acc[locName] = [];
    acc[locName].push(curr);
    return acc;
  }, {} as Record<string, CountEntry[]>);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold">Physical State Ledger</h2>
          <p className="text-sm text-gray-500">Real-time physical counts (QoH) across all locations.</p>
        </div>
      </div>

      {Object.keys(groupedCounts).length === 0 ? (
        <div className="text-center py-10 text-gray-500">No inventory counts recorded yet.</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedCounts).map(([locationName, items]) => (
            <div key={locationName} className="border rounded-xl overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b font-semibold text-gray-700">
                Location: {locationName}
              </div>
              <ul className="divide-y">
                {items.map(entry => (
                  <li key={entry.id} className={`flex items-center justify-between px-6 py-4 transition-colors ${getStatusColor(entry.quantity_on_hand, entry.quantity_warning)}`}>
                    
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{entry.raw_ingredients.name}</span>
                      <span className="text-xs text-gray-500 uppercase tracking-widest">{entry.raw_ingredients.item_type}</span>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* PAR / Warning Level */}
                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-medium">PAR Level</div>
                        <div className="font-mono text-sm text-gray-900">
                          {entry.quantity_warning ? `${Number(entry.quantity_warning).toFixed(2)} ${entry.raw_ingredients.base_unit_measure}` : 'N/A'}
                        </div>
                      </div>
                      
                      {/* Quantity on Hand */}
                      <div className="text-right bg-white px-4 py-2 rounded-lg border shadow-sm">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">QoH</div>
                        <div className="font-mono text-lg font-bold text-black">
                          {Number(entry.quantity_on_hand).toFixed(2)} <span className="text-sm text-gray-500 font-normal">{entry.raw_ingredients.base_unit_measure}</span>
                        </div>
                      </div>
                    </div>

                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
