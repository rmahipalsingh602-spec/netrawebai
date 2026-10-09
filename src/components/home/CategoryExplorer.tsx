'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { 
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
  ArrowRight,
  Sparkles,
  Layers
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

export default function CategoryExplorer() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gadgets' | 'fashion' | 'food' | 'essentials'>('all');

  const filteredCategories = CATEGORIES.filter((category) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'gadgets') return ['mobile-shops', 'mobile-repair', 'electronics', 'automobile'].includes(category.id);
    if (selectedFilter === 'fashion') return ['clothing', 'jewellery', 'shoe-shops', 'salons'].includes(category.id);
    if (selectedFilter === 'food') return ['cafes', 'restaurants', 'bakeries'].includes(category.id);
    if (selectedFilter === 'essentials') return ['kirana', 'medical-stores', 'hardware', 'stationery', 'furniture', 'gift-shops', 'home-decor', 'sports', 'other'].includes(category.id);
    return true;
  });

  return (
    <section id="categories" className="py-20 lg:py-28 bg-[#091124] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>20+ Tailored Business Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed Specially for Your Business
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A jewellery store needs elegance; a kirana needs daily grocery lists; a mobile shop needs gadget specs. We designed unique website structures for every trade.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'All 20 Categories' },
            { id: 'gadgets', label: 'Gadgets & Tech' },
            { id: 'fashion', label: 'Fashion & Luxury' },
            { id: 'food', label: 'Food, Cafés & Bakeries' },
            { id: 'essentials', label: 'Daily Essentials & Services' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as typeof selectedFilter)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#141E3B] text-slate-400 hover:text-white hover:bg-[#1C284F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const Icon = iconMap[category.iconName] || Store;
            return (
              <div
                key={category.id}
                className="group relative bg-[#131C38] rounded-2xl border border-slate-800/80 hover:border-blue-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/50 flex flex-col justify-between"
              >
                {/* Category Image Header */}
                <div className="relative h-40 overflow-hidden bg-slate-900">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131C38] via-[#131C38]/40 to-transparent" />
                  
                  {/* Category Icon Badge */}
                  <div 
                    className="absolute top-3 left-3 p-2.5 rounded-xl shadow-lg backdrop-blur-md"
                    style={{ backgroundColor: `${category.accentColor}25`, borderColor: `${category.accentColor}50` }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Template Count Pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-slate-700">
                    {category.templateCount} Templates
                  </div>

                  {/* Hindi Category Badge */}
                  <div className="absolute bottom-2 left-4 text-xs font-medium text-blue-400">
                    {category.hindiName}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {category.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Link Buttons */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      href={`/categories/${category.id}`}
                      className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 group-hover:underline"
                    >
                      <span>Explore Designs</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    </Link>

                    <Link
                      href={`/builder?category=${category.id}`}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold border border-blue-500/30 transition-all flex items-center gap-1"
                      title={`Build a ${category.name} Website`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Build</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
