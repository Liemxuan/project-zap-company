"use client";

import React, { useState } from "react";
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Card, CardContent } from 'zap-design/src/genesis/molecules/card';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import {
  CreditCard,
  Search,
  ShoppingCart,
  Phone,
  
  
  X,
  Plus,
  Minus,
} from "lucide-react";

// Dummy Kiosk Products
const MOCK_PRODUCTS = [
  { id: "1", name: "Classic Burger", price: 8.99, category: "Mains", image: "🍔" },
  { id: "2", name: "Cheese Pizza", price: 12.5, category: "Mains", image: "🍕" },
  { id: "3", name: "French Fries", price: 3.99, category: "Sides", image: "🍟" },
  { id: "4", name: "Vanilla Shake", price: 5.0, category: "Drinks", image: "🥤" },
  { id: "5", name: "House Salad", price: 6.99, category: "Sides", image: "🥗" },
  { id: "6", name: "Fried Chicken", price: 10.99, category: "Mains", image: "🍗" },
];

export default function KioskPOS() {
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)))];

  const filteredProducts =
    activeCategory === "All"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

  const getProduct = (id: string) => MOCK_PRODUCTS.find((p) => p.id === id)!;

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + getProduct(item.id).price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.0825; // Dummy 8.25% tax
  const total = subtotal + tax;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* LEFT PANEL: PRODUCT SELECTION */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-200 bg-white shadow-sm z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner">
              Z
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Self-Service Kiosk
              </h1>
              <p className="text-slate-500 text-sm font-medium">Order & Pay Here</p>
            </div>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full h-10"
              placeholder="Search items..."
            />
          </div>
        </div>

        {/* Categories (Horizontal Scroll) */}
        <div className="flex overflow-x-auto p-4 space-x-2 no-scrollbar shrink-0 border-b border-slate-100 bg-slate-50/50">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "primary" : "outline"}
              className={`rounded-full px-6 transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-blue-600 hover:bg-blue-700 shadow-md"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col border-slate-200 bg-white"
                onClick={() => addToCart(product.id)}
              >
                <div className="aspect-square bg-slate-50 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                  {product.image}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                      {product.category}
                    </p>
                  </div>
                  <div className="font-bold text-lg text-blue-600 mt-3">
                    ${product.price.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: TICKET / CART */}
      <div className="w-[400px] xl:w-[480px] bg-slate-50 flex flex-col h-full shrink-0">
        <div className="p-6 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center text-slate-800">
            <ShoppingCart className="mr-3 h-5 w-5 text-blue-600" />
            Current Order
          </h2>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-60">
              <ShoppingCart className="h-16 w-16" />
              <p className="text-lg font-medium">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => {
              const product = getProduct(item.id);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl bg-slate-50 p-2 rounded-xl">
                      {product.image}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{product.name}</p>
                      <p className="text-blue-600 font-bold text-sm">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 bg-slate-50 rounded-full p-1 border border-slate-200">
                    <button
                      title="Decrease quantity"
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }}
                    >
                      {item.quantity === 1 ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                    </button>
                    <span className="w-4 text-center font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      title="Increase quantity"
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item.id);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Checkout Summary Footer */}
        <div className="bg-white border-t border-slate-200 p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] shrink-0 z-20">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Tax (8.25%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-end">
              <span className="text-lg font-bold text-slate-800">Total</span>
              <span className="text-4xl font-black text-slate-900 tracking-tight">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full py-7 text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
              disabled={cart.length === 0}
            >
              <CreditCard className="mr-2 h-6 w-6" /> Pay with Card
            </Button>
            <Button
              variant="outline"
              className="w-full py-6 text-lg font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
              disabled={cart.length === 0}
            >
              <Phone className="mr-2 h-5 w-5" /> Apple Pay / Contactless
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
