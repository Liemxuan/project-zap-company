'use client';

import React, { useState } from 'react';
import { ItemMasterDataGrid } from './ItemMasterDataGrid';


import { ReceiveGoods } from './ReceiveGoods';
import { WasteLogging } from './WasteLogging';

// Simulated Auth
const MOCK_TENANT_ID = 'zap-inc-tenant-1';
const MOCK_LOCATION_ID = 'loc_headquarters_01';

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState<'MASTER' | 'BOM' | 'LEDGER' | 'RECEIVE' | 'WASTE'>('MASTER');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventory Command Center</h1>
        <p className="text-gray-500 mt-2">Manage physical ingredients, build recursive BOMs, and monitor walk-in counts.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-8 pb-4">
        <button 
          onClick={() => setActiveTab('MASTER')}
          className={`px-4 py-2 font-medium rounded-md transition-colors ${activeTab === 'MASTER' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          1. Item Master
        </button>
        <button 
          onClick={() => setActiveTab('BOM')}
          className={`px-4 py-2 font-medium rounded-md transition-colors ${activeTab === 'BOM' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          2. Recipe BOM Builder
        </button>
        <button 
          onClick={() => setActiveTab('LEDGER')}
          className={`px-4 py-2 font-medium rounded-md transition-colors ${activeTab === 'LEDGER' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          3. State Ledger (Counts)
        </button>
        <button 
          onClick={() => setActiveTab('RECEIVE')}
          className={`px-4 py-2 font-medium rounded-md transition-colors ${activeTab === 'RECEIVE' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50'}`}
        >
          4. Receive Goods (PO)
        </button>
        <button 
          onClick={() => setActiveTab('WASTE')}
          className={`px-4 py-2 font-medium rounded-md transition-colors ${activeTab === 'WASTE' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-red-50'}`}
        >
          5. Log Waste
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px]">
        {activeTab === 'MASTER' && (
          <ItemMasterDataGrid tenantId={MOCK_TENANT_ID} />
        )}
        {activeTab === 'BOM' && (
          <div className="p-12 text-center text-gray-500">
            <h3 className="text-xl font-semibold mb-2">Recipe BOM Builder</h3>
            <p>Select a POS Variant or Semi-Product to begin mapping ingredients.</p>
            {/* TODO: Implement BomBuilder */}
          </div>
        )}
        {activeTab === 'LEDGER' && (
          <div className="p-12 text-center text-gray-500">
            <h3 className="text-xl font-semibold mb-2">Physical Location Ledger</h3>
            <p>View quantity on hand across all physical locations.</p>
            {/* TODO: Implement LedgerGrid */}
          </div>
        )}
        {activeTab === 'RECEIVE' && (
          <ReceiveGoods tenantId={MOCK_TENANT_ID} locationId={MOCK_LOCATION_ID} />
        )}
        {activeTab === 'WASTE' && (
          <WasteLogging tenantId={MOCK_TENANT_ID} locationId={MOCK_LOCATION_ID} />
        )}
      </div>

    </div>
  );
}
