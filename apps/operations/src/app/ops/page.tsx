"use client";

import React, { useState } from "react";
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Card, CardContent, CardHeader, CardTitle } from 'zap-design/src/genesis/molecules/card';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChefHat, 
  
  TrendingUp,
  Settings,
  MoreVertical
} from "lucide-react";

// Dummy Order Tickets
type TicketStatus = "new" | "processing" | "ready";

interface Ticket {
  id: string;
  orderNumber: string;
  type: "Dine-In" | "Takeaway" | "Delivery";
  status: TicketStatus;
  timeElapsed: string; // e.g. "5m"
  items: { name: string; qty: number; notes?: string }[];
  isRush?: boolean;
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "t1",
    orderNumber: "#1042",
    type: "Dine-In",
    status: "new",
    timeElapsed: "2m",
    isRush: true,
    items: [
      { name: "Classic Burger", qty: 2, notes: "No onions, extra pickles" },
      { name: "French Fries", qty: 1 },
      { name: "Vanilla Shake", qty: 2 },
    ]
  },
  {
    id: "t2",
    orderNumber: "#1043",
    type: "Takeaway",
    status: "processing",
    timeElapsed: "8m",
    items: [
      { name: "Cheese Pizza", qty: 1 },
      { name: "House Salad", qty: 1, notes: "Dressing on side" },
    ]
  },
  {
    id: "t3",
    orderNumber: "#1044",
    type: "Delivery",
    status: "new",
    timeElapsed: "1m",
    items: [
      { name: "Fried Chicken", qty: 1, notes: "Spicy" },
      { name: "French Fries", qty: 2 },
    ]
  },
  {
    id: "t4",
    orderNumber: "#1039",
    type: "Dine-In",
    status: "ready",
    timeElapsed: "15m",
    items: [
      { name: "Classic Burger", qty: 1 },
      { name: "Vanilla Shake", qty: 1 },
    ]
  }
];

export default function OpsFulfillment() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  const newTickets = tickets.filter(t => t.status === "new");
  const processingTickets = tickets.filter(t => t.status === "processing");
  const readyTickets = tickets.filter(t => t.status === "ready");

  const moveTicket = (id: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const completeTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "processing": return "bg-amber-500";
      case "ready": return "bg-emerald-500";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col">
      {/* HEADER: KDS Style */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                OPS Fulfillment
              </h1>
              <p className="text-sm text-slate-400">Kitchen Display & Prep</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-800 hidden md:block"></div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-slate-300">New ({newTickets.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium text-slate-300">Prep ({processingTickets.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-slate-300">Ready ({readyTickets.length})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block mr-4 text-slate-400">
            <p className="text-sm font-mono">{new Date().toLocaleTimeString()}</p>
          </div>
          <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
            <TrendingUp className="h-4 w-4 mr-2" /> Stats
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* MAIN KDS BOARD */}
      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex flex-nowrap gap-6 h-full min-w-max">
          
          {/* COLUMN: NEW ORDERS */}
          <div className="flex flex-col w-[360px] shrink-0">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-white flex items-center">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                Incoming
              </h2>
              <span className="bg-slate-800 text-blue-400 text-xs font-bold px-2 py-1 rounded-full">
                {newTickets.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 pb-4 h-full no-scrollbar">
              {newTickets.map(ticket => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onAction={() => moveTicket(ticket.id, "processing")}
                  actionLabel="Start Prep"
                />
              ))}
              {newTickets.length === 0 && (
                <div className="border-2 border-dashed border-slate-800 rounded-xl h-32 flex items-center justify-center text-slate-500">
                  No incoming orders
                </div>
              )}
            </div>
          </div>

          {/* COLUMN: IN PROGRESS */}
          <div className="flex flex-col w-[360px] shrink-0">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Clock className="h-5 w-5 text-amber-500 mr-2" />
                In Progress
              </h2>
              <span className="bg-slate-800 text-amber-400 text-xs font-bold px-2 py-1 rounded-full">
                {processingTickets.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 pb-4 h-full no-scrollbar">
              {processingTickets.map(ticket => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onAction={() => moveTicket(ticket.id, "ready")}
                  actionLabel="Mark Ready"
                />
              ))}
              {processingTickets.length === 0 && (
                <div className="border-2 border-dashed border-slate-800 rounded-xl h-32 flex items-center justify-center text-slate-500">
                  No orders in prep
                </div>
              )}
            </div>
          </div>

          {/* COLUMN: READY */}
          <div className="flex flex-col w-[360px] shrink-0">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-white flex items-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                Ready for Pickup
              </h2>
              <span className="bg-slate-800 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full">
                {readyTickets.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 pb-4 h-full no-scrollbar">
              {readyTickets.map(ticket => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onAction={() => completeTicket(ticket.id)}
                  actionLabel="Complete Delivery"
                  isReady
                />
              ))}
              {readyTickets.length === 0 && (
                <div className="border-2 border-dashed border-slate-800 rounded-xl h-32 flex items-center justify-center text-slate-500">
                  No orders waiting
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Sub-Component: Order Ticket Card
function TicketCard({ 
  ticket, 
  onAction, 
  actionLabel, 
  isReady = false 
}: { 
  ticket: Ticket; 
  onAction: () => void; 
  actionLabel: string;
  isReady?: boolean;
}) {
  const isLate = parseInt(ticket.timeElapsed) > 10;
  
  return (
    <Card className={`border-0 shadow-lg ${isReady ? 'bg-slate-800/80' : 'bg-slate-800'} overflow-hidden relative group`}>
      {/* Top Status Bar */}
      <div className={`h-1.5 w-full ${ticket.status === 'new' ? 'bg-blue-500' : ticket.status === 'processing' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
      
      {ticket.isRush && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
          RUSH
        </div>
      )}

      <CardHeader className="pb-3 border-b border-slate-700/50 p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-black tracking-tight text-white mb-1">
              {ticket.orderNumber}
            </CardTitle>
            <div className="flex items-center space-x-2 text-xs font-medium">
              <span className={`px-2 py-1 rounded bg-slate-900 ${
                ticket.type === 'Dine-In' ? 'text-blue-400' : 
                ticket.type === 'Takeaway' ? 'text-purple-400' : 'text-amber-400'
              }`}>
                {ticket.type}
              </span>
              <span className={`flex items-center ${isLate && !isReady ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                <Clock className="h-3 w-3 mr-1" /> {ticket.timeElapsed}
              </span>
            </div>
          </div>
          <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ul className="divide-y divide-slate-700/50">
          {ticket.items.map((item, idx) => (
            <li key={idx} className="p-4 hover:bg-slate-700/20 transition-colors">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded bg-slate-900 text-slate-300 font-bold flex items-center justify-center text-xs shrink-0 mr-3 border border-slate-700">
                  {item.qty}
                </div>
                <div>
                  <p className={`font-semibold text-lg leading-tight ${isReady ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                    {item.name}
                  </p>
                  {item.notes && (
                    <p className={`text-sm mt-1 font-medium ${isReady ? 'text-slate-500 line-through' : 'text-amber-400'}`}>
                      ** {item.notes} **
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="p-4 bg-slate-900/50 border-t border-slate-700/50 mt-2">
          <Button 
            className={`w-full font-bold shadow-lg transition-all ${
              ticket.status === 'new' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 
              ticket.status === 'processing' ? 'bg-amber-500 hover:bg-amber-400 text-amber-950' : 
              'bg-emerald-500 hover:bg-emerald-400 text-emerald-950'
            }`}
            onClick={onAction}
            size="lg"
          >
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
