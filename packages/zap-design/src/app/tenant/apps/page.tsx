import React from 'react';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Input } from '../../../genesis/atoms/interactive/inputs';

export default function TenantAppsDirectory() {
  return (
    <div className="flex flex-col min-h-screen bg-[--bg-surface] text-[--text-primary] p-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workspace Applications</h1>
        <p className="text-[--text-secondary]">Select an application module to enter. Role restrictions and passcodes apply.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core HR / Staffing Module */}
        <div className="border border-[--border-color] rounded-lg p-6 flex flex-col items-start bg-[--bg-surface-elevated] shadow-sm hover:border-[--primary-color] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded bg-[--primary-hover] text-[--primary-color] flex items-center justify-center mb-4 font-bold text-xl group-hover:bg-[--primary-color] group-hover:text-white transition-colors">
            HR
          </div>
          <h2 className="text-xl font-bold mb-1">Staffing & Personnel</h2>
          <p className="text-sm text-[--text-secondary] mb-4">Core HR, Timecards, Staffing, and Evaluations.</p>
          <div className="mt-auto pt-4 w-full flex justify-between items-center border-t border-[--border-color]">
             <span className="text-xs font-mono text-transform-tertiary bg-[--bg-component] px-2 py-1 rounded text-[--text-secondary]">STAFF</span>
             <Button variant="primary" size="sm">Launch App</Button>
          </div>
        </div>

        {/* POS / Sales Module */}
        <div className="border border-[--border-color] rounded-lg p-6 flex flex-col items-start bg-[--bg-surface-elevated] shadow-sm hover:border-[--primary-color] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded bg-[--primary-hover] text-[--primary-color] flex items-center justify-center mb-4 font-bold text-xl group-hover:bg-[--primary-color] group-hover:text-white transition-colors">
            POS
          </div>
          <h2 className="text-xl font-bold mb-1">Point of Sale</h2>
          <p className="text-sm text-[--text-secondary] mb-4">Sales, Checkouts, Terminals, and Registers.</p>
          <div className="mt-auto pt-4 w-full flex justify-between items-center border-t border-[--border-color]">
             <span className="text-xs font-mono text-transform-tertiary bg-[--bg-component] px-2 py-1 rounded text-[--text-secondary]">POS</span>
             <Button variant="primary" size="sm">Launch App</Button>
          </div>
        </div>

        {/* Operations / KDS Module */}
        <div className="border border-[--border-color] rounded-lg p-6 flex flex-col items-start bg-[--bg-surface-elevated] shadow-sm hover:border-[--primary-color] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded bg-[--primary-hover] text-[--primary-color] flex items-center justify-center mb-4 font-bold text-xl group-hover:bg-[--primary-color] group-hover:text-white transition-colors">
            OPS
          </div>
          <h2 className="text-xl font-bold mb-1">Inside Operations</h2>
          <p className="text-sm text-[--text-secondary] mb-4">Fulfillment, KDS, Floor Management, Dispatch.</p>
          <div className="mt-auto pt-4 w-full flex justify-between items-center border-t border-[--border-color]">
             <span className="text-xs font-mono text-transform-tertiary bg-[--bg-component] px-2 py-1 rounded text-[--text-secondary]">OPS</span>
             <Button variant="primary" size="sm">Launch App</Button>
          </div>
        </div>

        {/* Inventory / Assets Module */}
        <div className="border border-[--border-color] rounded-lg p-6 flex flex-col items-start bg-[--bg-surface-elevated] shadow-sm hover:border-[--primary-color] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded bg-[--primary-hover] text-[--primary-color] flex items-center justify-center mb-4 font-bold text-xl group-hover:bg-[--primary-color] group-hover:text-white transition-colors">
            INV
          </div>
          <h2 className="text-xl font-bold mb-1">Inventory & Assets</h2>
          <p className="text-sm text-[--text-secondary] mb-4">Stock, Warehouse, Linens, Products.</p>
          <div className="mt-auto pt-4 w-full flex justify-between items-center border-t border-[--border-color]">
             <span className="text-xs font-mono text-transform-tertiary bg-[--bg-component] px-2 py-1 rounded text-[--text-secondary]">STOCK</span>
             <Button variant="primary" size="sm">Launch App</Button>
          </div>
        </div>

        {/* Payroll / Compensation Module */}
        <div className="border border-[--border-color] rounded-lg p-6 flex flex-col items-start bg-[--bg-surface-elevated] shadow-sm hover:border-[--primary-color] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded bg-[--primary-hover] text-[--primary-color] flex items-center justify-center mb-4 font-bold text-xl group-hover:bg-[--primary-color] group-hover:text-white transition-colors">
            PAY
          </div>
          <h2 className="text-xl font-bold mb-1">Payroll & Banking</h2>
          <p className="text-sm text-[--text-secondary] mb-4">Wages, Tips, Billing, and Accounting.</p>
          <div className="mt-auto pt-4 w-full flex justify-between items-center border-t border-[--border-color]">
             <span className="text-xs font-mono text-transform-tertiary bg-[--bg-component] px-2 py-1 rounded text-[--text-secondary]">PAY</span>
             <Button variant="primary" size="sm" disabled>Locked by Role</Button>
          </div>
        </div>

      </div>

      <div className="mt-12 bg-[--bg-surface-elevated] border border-[--border-color] rounded-lg p-8">
        <h3 className="text-lg font-bold mb-4">Passcode Authorization Simulation</h3>
        <p className="text-sm text-[--text-secondary] mb-6">Users operating POS or KDS endpoints must enter their 4-digit PIN to elevate their access token session.</p>
        <div className="flex gap-4 max-w-sm">
           <Input 
             type="password" 
             placeholder="****" 
             maxLength={4} 
             className="text-center text-xl tracking-widest font-mono text-transform-tertiary font-bold" 
           />
           <Button variant="primary">Authenticate</Button>
        </div>
      </div>
    </div>
  );
}
