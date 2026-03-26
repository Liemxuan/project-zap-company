'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';

interface BomItem {
  id: string;
  name: string;
}

interface BomLine {
  id: string;
  component: BomItem;
  quantity_needed: string;
  unit_of_measure: string;
}

interface TargetEntity {
  id: string;
  name: string;
  type: 'VARIANT' | 'SEMI_PRODUCT';
  boms: BomLine[];
}

export function BomBuilderModal({ tenantId }: { tenantId: string }) {
  const [targets, setTargets] = useState<TargetEntity[]>([]);
  const [ingredients, setIngredients] = useState<BomItem[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<TargetEntity | null>(null);
  const [loading, setLoading] = useState(true);

  // New BOM Entry State
  const [newLine, setNewLine] = useState({
    component_item_id: '',
    quantity_needed: '1',
    unit_of_measure: 'oz'
  });

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch targets (Variants + Semis)
      const resBom = await fetch(`/api/inventory/bom?tenant_id=${tenantId}`);
      // Fetch potential ingredients
      const resItems = await fetch(`/api/inventory/items?tenant_id=${tenantId}`);
      
      if (resBom.ok && resItems.ok) {
        const { variants, semiProducts } = await resBom.json();
        const items = await resItems.json();
        
        // Normalize targets for the UI dropdown
        const normalizedTargets = [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...variants.map((v: any) => ({
            id: v.id,
            name: `${v.product.name} - ${v.name || 'Default'}`,
            type: 'VARIANT',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            boms: v.bom_recipes_bom_recipes_product_variant_idToproduct_variants.map((b: any) => ({
              id: b.id,
              component: b.raw_ingredients_bom_recipes_component_item_idToraw_ingredients,
              quantity_needed: String(b.quantity_needed),
              unit_of_measure: b.unit_of_measure
            }))
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...semiProducts.map((sp: any) => ({
            id: sp.id,
            name: `(WIP) ${sp.name}`,
            type: 'SEMI_PRODUCT',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            boms: sp.bom_recipes_bom_recipes_output_item_idToraw_ingredients.map((b: any) => ({
              id: b.id,
              component: b.raw_ingredients_bom_recipes_component_item_idToraw_ingredients,
              quantity_needed: String(b.quantity_needed),
              unit_of_measure: b.unit_of_measure
            }))
          }))
        ];

        setTargets(normalizedTargets);
        setIngredients(items);
        
        // Maintain selection if it exists
        if (selectedTarget) {
            const updated = normalizedTargets.find(t => t.id === selectedTarget.id);
            if (updated) setSelectedTarget(updated);
        }
      }
    } catch (error) {
      console.error('Failed to fetch BOM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLine = async () => {
    if (!selectedTarget || !newLine.component_item_id) return;

    try {
      const payload = {
        tenant_id: tenantId,
        product_variant_id: selectedTarget.type === 'VARIANT' ? selectedTarget.id : null,
        output_item_id: selectedTarget.type === 'SEMI_PRODUCT' ? selectedTarget.id : null,
        component_item_id: newLine.component_item_id,
        quantity_needed: newLine.quantity_needed,
        unit_of_measure: newLine.unit_of_measure
      };

      const res = await fetch('/api/inventory/bom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Reset form and refresh
        setNewLine({ component_item_id: '', quantity_needed: '1', unit_of_measure: 'oz' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add BOM line:', error);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Configuration...</div>;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      
      <div className="flex gap-8">
        {/* Left Column: Target Selector */}
        <div className="w-1/3 border-r pr-6">
          <h3 className="text-lg font-bold mb-4">Select Output Entity</h3>
          <p className="text-sm text-gray-500 mb-4">Choose a POS Variant or a Semi-Product to define its required ingredients.</p>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {targets.map(target => (
              <button
                key={target.id}
                onClick={() => setSelectedTarget(target)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${selectedTarget?.id === target.id ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
              >
                <div className="font-medium text-sm">{target.name}</div>
                <div className={`text-xs mt-1 ${selectedTarget?.id === target.id ? 'text-gray-300' : 'text-gray-500'}`}>
                  Type: {target.type} | {target.boms.length} entries
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: BOM Configurator */}
        <div className="w-2/3 pl-2">
          {!selectedTarget ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <p>Select an output entity on the left to view and edit its Recipe (BOM).</p>
             </div>
          ) : (
            <div>
               <div className="mb-6 pb-4 border-b">
                 <h3 className="text-xl font-bold">{selectedTarget.name}</h3>
                 <span className="text-sm text-gray-500">Routing Type: {selectedTarget.type}</span>
               </div>

               {/* Existing BOM Lines */}
               <div className="mb-8">
                 <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Current Recipe Lines</h4>
                 {selectedTarget.boms.length === 0 ? (
                   <div className="bg-gray-50 p-4 rounded-lg text-sm text-center text-gray-500">No ingredients mapped yet.</div>
                 ) : (
                   <ul className="space-y-2">
                     {selectedTarget.boms.map(bom => (
                       <li key={bom.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                         <span className="font-medium">{bom.component.name}</span>
                         <span className="text-sm bg-white px-3 py-1 rounded border">
                           {Number(bom.quantity_needed).toFixed(2)} {bom.unit_of_measure}
                         </span>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>

               {/* Add New Line Form */}
               <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                 <h4 className="text-sm font-bold mb-4">Add Ingredient Route</h4>
                 <div className="flex gap-4 items-end">
                   <div className="flex-2 w-1/2">
                     <label className="text-xs font-semibold uppercase text-gray-600 mb-1 block">Component / Raw Material</label>
                     <select 
                       className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                       value={newLine.component_item_id}
                       onChange={(e) => setNewLine({...newLine, component_item_id: e.target.value})}
                     >
                       <option value="" disabled>Select an ingredient...</option>
                       {ingredients.map(ing => (
                         <option key={ing.id} value={ing.id}>{ing.name}</option>
                       ))}
                     </select>
                   </div>
                   <div className="flex-1">
                     <label className="text-xs font-semibold uppercase text-gray-600 mb-1 block">Qty Needed</label>
                     <Input 
                       type="number" 
                       step="0.01" 
                       value={newLine.quantity_needed}
                       onChange={(e) => setNewLine({...newLine, quantity_needed: e.target.value})} 
                     />
                   </div>
                   <div className="flex-1">
                     <label className="text-xs font-semibold uppercase text-gray-600 mb-1 block">UoM</label>
                     <Input 
                       value={newLine.unit_of_measure}
                       onChange={(e) => setNewLine({...newLine, unit_of_measure: e.target.value})} 
                     />
                   </div>
                   <Button onClick={handleAddLine} disabled={!newLine.component_item_id} variant="secondary">Add</Button>
                 </div>
               </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
