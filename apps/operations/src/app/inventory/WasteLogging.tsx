'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';

interface RawIngredient {
  id: string;
  name: string;
  base_unit_measure: string;
}

interface WasteItem {
  raw_ingredient_id: string;
  quantity: string;
}

export function WasteLogging({ tenantId, locationId }: { tenantId: string, locationId: string }) {
  const [ingredients, setIngredients] = useState<RawIngredient[]>([]);
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([{ raw_ingredient_id: '', quantity: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/inventory/items?tenant_id=${tenantId}`)
      .then(res => res.json())
      .then(data => setIngredients(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [tenantId]);

  const addLine = () => {
    setWasteItems([...wasteItems, { raw_ingredient_id: '', quantity: '' }]);
  };

  const updateLine = (index: number, field: keyof WasteItem, value: string) => {
    const newItems = [...wasteItems];
    newItems[index][field] = value;
    setWasteItems(newItems);
  };

  const removeLine = (index: number) => {
    setWasteItems(wasteItems.filter((_, i) => i !== index));
  };

  const submitWaste = async () => {
    setIsSubmitting(true);
    try {
      const validItems = wasteItems.filter(i => i.raw_ingredient_id && i.quantity);
      if (validItems.length === 0) {
        alert("Please add at least one valid item to waste.");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/inventory/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          location_id: locationId,
          reference_id: `WASTE-${Date.now()}`,
          items: validItems
        })
      });

      if (res.ok) {
        alert("Waste event logged! Master Ledger depreciated.");
        setWasteItems([{ raw_ingredient_id: '', quantity: '' }]); // Reset
      } else {
        alert("Failed to log waste.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting Waste Run");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-red-700 mb-4">Negative Movement: Waste Logging</h3>
      <p className="text-sm text-gray-500 mb-6">Log dropped, spoiled, or expired physical inventory to decrease quantity on hand immediately.</p>
      
      <div className="space-y-4 max-w-2xl">
        {wasteItems.map((item, index) => (
          <div key={index} className="flex gap-4 items-center bg-red-50/50 p-3 rounded-lg border border-red-100">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Ingredient Dropped / Spoiled</label>
              <select 
                className="w-full flex h-10 w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={item.raw_ingredient_id}
                onChange={(e) => updateLine(index, 'raw_ingredient_id', e.target.value)}
              >
                <option value="">-- Select Ingredient --</option>
                {ingredients.map(ing => (
                  <option key={ing.id} value={ing.id}>{ing.name} ({ing.base_unit_measure})</option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Quantity Lost</label>
              <Input 
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={item.quantity}
                onChange={(e) => updateLine(index, 'quantity', e.target.value)}
              />
            </div>
            <div className="pt-5">
              <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeLine(index)}>
                Remove
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-2">
           <Button variant="outline" onClick={addLine}>+ Add Waste Line</Button>
        </div>

        <div className="pt-6 border-t border-gray-200 flex justify-end">
           <Button onClick={submitWaste} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
             {isSubmitting ? 'Logging...' : 'Submit Spoilage'}
           </Button>
        </div>
      </div>
    </div>
  );
}
