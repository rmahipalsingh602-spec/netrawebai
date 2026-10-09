'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CATEGORIES } from '@/data/categories';
import { 
  Search, 
  Layers, 
  ArrowRight, 
  Sparkles,
  Smartphone, 
  Wrench, 
  Shirt, 
  Coffee, 
  UtensilsCrossed, 
  Gem, 
  ShoppingBasket, 
  Tv, 
  Scissors, 
  Footprints, 
  Armchair, 
  Gift, 
  Cake, 
  Cross, 
  Hammer, 
  Car, 
  BookOpen, 
  Lamp, 
  Trophy, 
  Store 
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Wrench,
  Shirt,
  Coffee,
  UtensilsCrossed,
  Gem,
  ShoppingBasket,
  Tv,
  Scissors,
  Footprints,
  Armchair,
  Gift,
  Cake,
  Cross,
  Hammer,
  Car,
  BookOpen,
  Lamp,
  Trophy,
  Store,
};

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = CATEGORIES.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.hindiName.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term) ||
      c.tags.some((t) => t.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Category Directory</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              All 20 Shop Categories
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Find your exact trade. Each category includes pre-designed layouts, realistic product catalogs, WhatsApp inquiry flows, and customer journey blueprints.
            </p>

            {/* Category Search Input */}
            <div className="relative max-w-lg mx-auto pt-4">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-7 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories (e.g. mobile, saree, café, grocery)..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#15203F] border border-slate-700 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-7 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-6 pb-2 border-b border-slate-800">
            <span>Showing {filtered.length} categories</span>
            <span>Click any category to inspect demo designs and storefronts</span>
          </div>

          {/* Category Cards Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#121A36] rounded-2xl border border-slate-800 p-8">
              <p className="text-slate-300 font-semibold">No categories found matching &quot;{searchTerm}&quot;</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((cat) => {
                const Icon = iconMap[cat.iconName] || Store;
                return (
                  <div
                    key={cat.id}
                    className="group bg-[#131C38] rounded-2xl border border-slate-800 hover:border-blue-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/40 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-40 overflow-hidden bg-slate-900">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131C38] via-[#131C38]/40 to-transparent" />
                        
                        <div 
                          className="absolute top-3 left-3 p-2.5 rounded-xl shadow-lg backdrop-blur-md"
                          style={{ backgroundColor: `${cat.accentColor}25`, borderColor: `${cat.accentColor}50` }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>

                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-slate-700">
                          {cat.templateCount} Templates
                        </div>

                        <div className="absolute bottom-2 left-4 text-xs font-semibold text-blue-400">
                          {cat.hindiName}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          {cat.name}
                        </h2>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cat.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="p-5 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-2">
                      <Link
                        href={`/categories/${cat.id}`}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <span>Explore Designs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/builder?category=${cat.id}`}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold border border-blue-500/30 transition-all flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Build</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
