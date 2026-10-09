'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DEMO_SHOPS } from '@/data/shops';
import { CATEGORIES } from '@/data/categories';
import { 
  Search, 
  MapPin, 
  Star, 
  ExternalLink, 
  Wand2, 
  Sparkles, 
  Filter, 
  Store 
} from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const cities = ['all', 'Jodhpur', 'Jaipur', 'Udaipur'];

  const filteredShops = DEMO_SHOPS.filter((shop) => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || shop.categorySlug === selectedCategory;
    const matchesCity = selectedCity === 'all' || shop.contact.city.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Explore Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Discover Local Shop Websites
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore working demonstration websites across Rajasthan and India. View live mobile storefronts or clone and customize any design for your business.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-[#121A33] rounded-2xl p-4 sm:p-6 border border-slate-800 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by shop name, products, or keywords..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Categories ({CATEGORIES.length})</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Cities</option>
                  {cities.filter(c => c !== 'all').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Found <strong>{filteredShops.length}</strong> shop storefront{filteredShops.length === 1 ? '' : 's'}</span>
              {(searchQuery || selectedCategory !== 'all' || selectedCity !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedCity('all');
                  }}
                  className="text-blue-400 hover:underline"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Grid */}
          {filteredShops.length === 0 ? (
            <div className="bg-[#121A33] rounded-2xl p-12 text-center border border-slate-800 space-y-3">
              <Store className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="font-bold text-white text-base">No shops matching your search</h3>
              <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className="group bg-[#121A36] rounded-2xl border border-slate-800 hover:border-blue-500/40 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={shop.bannerImage}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121A36] via-[#121A36]/40 to-transparent" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-[11px] font-bold text-blue-400 border border-slate-800">
                        {shop.category}
                      </div>
                      {shop.rating && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{shop.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {shop.name}
                      </h3>
                      <p className="text-xs text-blue-400 font-medium">{shop.tagline}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{shop.description}</p>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{shop.contact.address}, {shop.contact.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center gap-2.5">
                    <Link
                      href={`/shop/${shop.slug}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/builder?shop=${shop.slug}&category=${shop.categorySlug}&template=${shop.templateId}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Customize</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
