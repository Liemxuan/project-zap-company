'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';

interface RawIngredient {
  id: string;
  name: string;
  base_unit_measure: string;
}

interface Vendor {
  id: string;
  name: string;
}

interface PurchaseOrderItem {
  id: string;
  raw_ingredient_id: string;
  quantity_ordered: number | string;
  quantity_received: number | string;
  raw_ingredient?: RawIngredient;
}

interface PurchaseOrder {
  id: string;
  vendor_id: string;
  status: string;
  created_at: string;
  vendor?: Vendor;
  items?: PurchaseOrderItem[];
}

interface IntakeItem {
  raw_ingredient_id: string;
  quantity: string;
}

interface ReceiveItem {
  raw_ingredient_id: string;
  name: string;
  unit: string;
  quantity_ordered: number;
  quantity_received_so_far: number;
  quantity_to_receive_now: number;
}

export function ReceiveGoods({ tenantId, locationId }: { tenantId: string, locationId: string }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [ingredients, setIngredients] = useState<RawIngredient[]>([]);

  // Mode Selection
  const [activeTab, setActiveTab] = useState<'create_po' | 'receive_po'>('create_po');

  // Create Mode State
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [intakeItems, setIntakeItems] = useState<IntakeItem[]>([{ raw_ingredient_id: '', quantity: '' }]);

  // Receive Mode State
  const [selectedPoId, setSelectedPoId] = useState('');
  const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>([]);
  const [receiveNotes, setReceiveNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load ingredients
    fetch(`/api/inventory/items?tenant_id=${tenantId}`)
      .then(res => res.json())
      .then(data => setIngredients(Array.isArray(data) ? data : []))
      .catch(console.error);

    // Load vendors
    fetch(`/api/inventory/vendors?tenant_id=${tenantId}`)
      .then(res => res.json())
      .then(data => setVendors(Array.isArray(data) ? data : []))
      .catch(console.error);
      
    // Load active POs specifically for receiving
    const fetchPurchaseOrders = () => {
      fetch(`/api/inventory/purchase-orders?tenant_id=${tenantId}`)
        .then(res => res.json())
        .then(data => {
           const activePos = Array.isArray(data) ? data.filter((po: PurchaseOrder) => po.status === 'submitted' || po.status === 'partial') : [];
           setPurchaseOrders(activePos);
        })
        .catch(console.error);
    };

    fetchPurchaseOrders();
  }, [tenantId]);

  const loadPurchaseOrders = () => {
    fetch(`/api/inventory/purchase-orders?tenant_id=${tenantId}`)
      .then(res => res.json())
      .then(data => {
         const activePos = Array.isArray(data) ? data.filter((po: PurchaseOrder) => po.status === 'submitted' || po.status === 'partial') : [];
         setPurchaseOrders(activePos);
      })
      .catch(console.error);
  };

  const handlePoSelection = (poId: string) => {
    setSelectedPoId(poId);
    const po = purchaseOrders.find(p => p.id === poId);
    if (po && po.items) {
      // Map the expected items so the user can just type in what actually arrived
      const mappable: ReceiveItem[] = po.items.map((item: PurchaseOrderItem) => ({
         raw_ingredient_id: item.raw_ingredient_id,
         name: item.raw_ingredient?.name || 'Unknown',
         unit: item.raw_ingredient?.base_unit_measure || '',
         quantity_ordered: Number(item.quantity_ordered),
         quantity_received_so_far: Number(item.quantity_received),
         // Default the input to whatever is remaining
         quantity_to_receive_now: Math.max(0, Number(item.quantity_ordered) - Number(item.quantity_received))
      }));
      setReceiveItems(mappable);
    } else {
      setReceiveItems([]);
    }
  };

  const addLine = () => {
    setIntakeItems([...intakeItems, { raw_ingredient_id: '', quantity: '' }]);
  };

  const updateLine = (index: number, field: keyof IntakeItem, value: string) => {
    const newItems = [...intakeItems];
    newItems[index][field] = value;
    setIntakeItems(newItems);
  };

  const removeLine = (index: number) => {
    setIntakeItems(intakeItems.filter((_, i) => i !== index));
  };

  const updateReceiveLine = (index: number, value: string) => {
    const newItems = [...receiveItems];
    newItems[index].quantity_to_receive_now = Number(value);
    setReceiveItems(newItems);
  };

  const submitCreatePO = async () => {
    if (!selectedVendorId) {
       alert("Please select a vendor."); return;
    }
    
    setIsSubmitting(true);
    try {
      const validItems = intakeItems.filter(i => i.raw_ingredient_id && i.quantity);
      if (validItems.length === 0) {
        alert("Please add at least one valid item to order.");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/inventory/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          vendor_id: selectedVendorId,
          location_id: locationId,
          items: validItems.map(i => ({
             raw_ingredient_id: i.raw_ingredient_id,
             quantity_ordered: Number(i.quantity)
          }))
        })
      });

      if (res.ok) {
        alert("Purchase Order Created! Check the Receive Tab to fulfill it.");
        setIntakeItems([{ raw_ingredient_id: '', quantity: '' }]); 
        setSelectedVendorId('');
        loadPurchaseOrders();
      } else {
        alert("Failed to create PO.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting PO");
    } finally {
      setIsSubmitting(false);
    }
  };


  const submitReceivePO = async () => {
    if (!selectedPoId) {
        alert("Please select a Purchase Order to receive against."); return;
    }

    setIsSubmitting(true);
    try {
      // Filter out lines where they didn't receive anything this time around
      const validItems = receiveItems
         .filter(i => i.quantity_to_receive_now > 0)
         .map(i => ({
             raw_ingredient_id: i.raw_ingredient_id,
             quantity: i.quantity_to_receive_now
         }));

      if (validItems.length === 0) {
        alert("No quantities to receive.");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/inventory/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          location_id: locationId,
          purchase_order_id: selectedPoId,
          notes: receiveNotes,
          items: validItems
        })
      });

      if (res.ok) {
        alert("Goods Received! Inventory Quantities have been updated.");
        setSelectedPoId('');
        setReceiveItems([]);
        setReceiveNotes('');
        loadPurchaseOrders();
      } else {
        alert("Failed to receive goods.");
      }
    } catch (e) {
      console.error(e);
      alert("Error receiving PO");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold">Purchase Orders & Receiving</h3>
            <p className="text-sm text-gray-500">Create new orders for vendors or receive pending shipments.</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
             <button 
                onClick={() => setActiveTab('create_po')}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === 'create_po' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                Create PO
             </button>
             <button 
                onClick={() => setActiveTab('receive_po')}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === 'receive_po' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                Receive Goods
             </button>
          </div>
      </div>
      
      {activeTab === 'create_po' && (
        <div className="space-y-4 max-w-2xl bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Vendor</label>
                <select 
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    title="Select Vendor"
                >
                    <option value="">-- Choose Vendor --</option>
                    {vendors.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-700">Order Items</h4>
                {intakeItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Ingredient</label>
                    <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={item.raw_ingredient_id}
                        onChange={(e) => updateLine(index, 'raw_ingredient_id', e.target.value)}
                        title="Select Ingredient"
                    >
                        <option value="">-- Select Raw Ingredient --</option>
                        {ingredients.map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name} ({ing.base_unit_measure})</option>
                        ))}
                    </select>
                    </div>
                    <div className="w-32">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Qty to Order</label>
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
            </div>

            <div className="pt-2">
                <Button variant="outline" onClick={addLine}>+ Add Line Item</Button>
            </div>

            <div className="pt-6 border-t border-gray-200 flex justify-end">
                <Button onClick={submitCreatePO} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
                </Button>
            </div>
        </div>
      )}

      {activeTab === 'receive_po' && (
        <div className="space-y-4 max-w-2xl bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="mb-6 space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pending Purchase Orders</label>
                    <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedPoId}
                        onChange={(e) => handlePoSelection(e.target.value)}
                        title="Select Purchase Order"
                    >
                        <option value="">-- Select a PO to Receive Against --</option>
                        {purchaseOrders.map(po => (
                            <option key={po.id} value={po.id}>
                                {po.vendor?.name} — {new Date(po.created_at).toLocaleDateString()} ({po.status.toUpperCase()})
                            </option>
                        ))}
                    </select>
                </div>
                {selectedPoId && (
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Receipt Notes (Optional)</label>
                    <Input 
                        type="text"
                        placeholder="e.g. Delivered by FedEx, 2 boxes damaged"
                        value={receiveNotes}
                        onChange={(e) => setReceiveNotes(e.target.value)}
                    />
                </div>
                )}
            </div>

            {selectedPoId && receiveItems.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-700">Receive Line Items</h4>
                    <p className="text-xs text-gray-500 mb-4">Adjust the actual received quantity below. Partial receipts will keep the PO open.</p>
                    
                    {receiveItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex-1">
                           <p className="font-semibold text-sm">{item.name}</p>
                           <p className="text-xs text-gray-500">Ordered: <span className="font-medium text-gray-900">{item.quantity_ordered} {item.unit}</span></p>
                           <p className="text-xs text-gray-500">Received So Far: <span className="font-medium text-gray-900">{item.quantity_received_so_far} {item.unit}</span></p>
                        </div>
                        <div className="w-40 text-right">
                           <label className="block text-xs font-semibold text-gray-700 mb-1">Receiving Now</label>
                           <Input 
                                type="number"
                                step="0.01"
                                min="0"
                                max={Math.max(0, item.quantity_ordered - item.quantity_received_so_far)}
                                className="text-right"
                                value={item.quantity_to_receive_now}
                                onChange={(e) => updateReceiveLine(index, e.target.value)}
                            />
                        </div>
                    </div>
                    ))}

                    <div className="pt-6 border-t border-gray-200 flex justify-end">
                        <Button onClick={submitReceivePO} disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Confirm Receipt'}
                        </Button>
                    </div>
                </div>
            )}
            
            {selectedPoId && receiveItems.length === 0 && (
                <p className="text-sm text-gray-500 italic py-4">This PO has no valid line items.</p>
            )}
        </div>
      )}
    </div>
  );
}
