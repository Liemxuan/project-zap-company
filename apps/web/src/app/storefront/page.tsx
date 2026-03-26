"use client";

import React, { useState } from "react";
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';

import { ShoppingCart, Search, Menu, User, ChevronRight, Filter } from "lucide-react";

// Dummy Storefront Data
const MOCK_CATEGORIES = ["All", "Apparel", "Home Goods", "Electronics", "Beauty, Health", "Accessories"];

const MOCK_PRODUCTS = [
  { id: "101", name: "Premium Cotton T-Shirt", price: 29.99, category: "Apparel", image: "👕" },
  { id: "102", name: "Ceramic Coffee Mug", price: 14.99, category: "Home Goods", image: "☕" },
  { id: "103", name: "Wireless Earbuds", price: 159.0, category: "Electronics", image: "🎧" },
  { id: "104", name: "Hydrating Facial Serum", price: 45.0, category: "Beauty, Health", image: "✨" },
  { id: "105", name: "Leather Crossbody Bag", price: 120.0, category: "Accessories", image: "👜" },
  { id: "106", name: "Scented Soy Candle", price: 24.5, category: "Home Goods", image: "🕯️" },
  { id: "107", name: "Slim Fit Jeans", price: 79.99, category: "Apparel", image: "👖" },
  { id: "108", name: "Smart Watch", price: 299.99, category: "Electronics", image: "⌚" },
];

export default function Storefront() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      {/* GLOBAL NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center">
              <button title="Menu" className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-900 md:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center cursor-pointer">
                <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
                  O
                </div>
                <span className="font-bold text-xl tracking-tight hidden sm:block">
                  Olympus Store
                </span>
              </div>
            </div>

            {/* Middle: Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="font-medium text-slate-900 hover:text-blue-600 transition-colors">
                Shop
              </a>
              <a href="#" className="font-medium text-slate-500 hover:text-slate-900 transition-colors">
                New Arrivals
              </a>
              <a href="#" className="font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Best Sellers
              </a>
              <a href="#" className="font-medium text-slate-500 hover:text-slate-900 transition-colors">
                About
              </a>
            </div>

            {/* Right: Search, Account, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:flex items-center relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  className="pl-9 w-64 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full h-9 text-sm"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button title="Search" className="p-2 text-slate-500 hover:text-slate-900 lg:hidden rounded-full hover:bg-slate-50 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button title="User Profile" className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-colors hidden sm:block">
                <User className="h-5 w-5" />
              </button>
              <button title="Cart" className="p-2 text-slate-500 hover:text-slate-900 relative rounded-full hover:bg-slate-50 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR: Filters & Categories (Hidden on mobile by default) */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Filter className="mr-2 h-5 w-5 text-slate-400" /> Filters
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {MOCK_CATEGORIES.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => setActiveCategory(category)}
                        className={`text-sm w-full text-left flex items-center justify-between group py-1 ${
                          activeCategory === category
                            ? "text-blue-600 font-medium"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <span>{category}</span>
                        {activeCategory === category && (
                          <ChevronRight className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Add more filter sections here (Price, Size, Color) later */}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT: Products Grid */}
        <div className="flex-1">
          {/* Breadcrumbs / Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {activeCategory === "All" ? "Shop All Products" : activeCategory}
            </h1>
            <p className="text-slate-500 mt-2">
              Showing {filteredProducts.length} results
            </p>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-900">No products found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 hover:gap-8 transition-all duration-300">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  {/* Image Container */}
                  <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden mb-4 relative z-0">
                    <div className="absolute inset-0 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500 ease-out">
                      {product.image}
                    </div>
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Button 
                        className="w-full bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-black hover:text-white shadow-lg"
                        onClick={() => setCartCount(c => c + 1)}
                      >
                        Quick Add
                      </Button>
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-slate-900 truncate pr-4">
                        <a href="#" className="hover:underline">
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </a>
                      </h3>
                      <p className="font-bold text-slate-900 bg-white relative z-10 pl-2">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 hidden">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="border-t border-slate-200 mt-auto bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>© 2026 Olympus Stores. A Demo by ZAP Engineering.</p>
        </div>
      </footer>
    </div>
  );
}
