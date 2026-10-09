'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DEMO_SHOPS } from '@/data/shops';
import { 
  Store, 
  MapPin, 
  Star, 
  ExternalLink, 
  Wand2, 
  Phone, 
  MessageCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function FeaturedShops() {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Featured Shops' },
    { id: 'mobile-shops', label: 'Mobile' },
    { id: 'mobile-repair', label: 'Repair' },
    { id: 'clothing', label: 'Boutique' },
    { id: 'cafes', label: 'Café & Food' },
    { id: 'jewellery', label: 'Jewellery' },
    { id: 'kirana', label: 'Kirana' },
  ];

  const displayedShops = activeCategoryFilter === 'all'
    ? DEMO_SHOPS
    : DEMO_SHOPS.filter((s) => s.categorySlug === activeCategoryFilter);

  return (
    <section id="shops" className="py-20 lg:py-28 bg-[#0B132B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive Demo Storefronts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Discover Beautiful Shop Websites
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Click &ldquo;View Website&rdquo; to test real mobile storefronts with WhatsApp inquiry buttons, or &ldquo;Customize This Design&rdquo; to launch the builder with this layout ready to edit.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategoryFilter(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategoryFilter === c.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#15203F] text-slate-400 hover:text-white hover:bg-[#1E2E5B]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 12 Shop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedShops.map((shop) => {
            return (
              <div
                key={shop.id}
                className="group bg-[#121A36] rounded-2xl border border-slate-800/80 hover:border-blue-500/40 overflow-hidden shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-blue-950/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Shop Banner Image Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={shop.bannerImage}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121A36] via-[#121A36]/40 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-blue-400 border border-slate-800">
                      {shop.category}
                    </div>

                    {/* Rating Pill */}
                    {shop.rating && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/30">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{shop.rating}</span>
                        <span className="text-[10px] text-slate-400">({shop.reviewsCount})</span>
                      </div>
                    )}

                    {/* Visual Identity Color Bar */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: shop.theme.accentColor }}
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {shop.name}
                        </h3>
                        <p className="text-xs text-blue-400/90 font-medium mt-0.5">
                          {shop.tagline}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {shop.description}
                    </p>

                    {/* Address & City */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{shop.contact.address}, {shop.contact.city}</span>
                    </div>

                    {/* Sample Product Previews */}
                    <div className="pt-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                        {shop.services && shop.services.length > 0 ? 'Sample Services' : 'Sample Products'}
                      </div>
                      <div className="space-y-1.5">
                        {shop.services && shop.services.length > 0 ? (
                          shop.services.slice(0, 2).map((srv) => (
                            <div key={srv.id} className="flex items-center justify-between text-xs bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                              <span className="text-slate-300 truncate max-w-[180px]">{srv.name}</span>
                              <span className="text-emerald-400 font-semibold text-[11px]">From ₹{srv.startingPrice}</span>
                            </div>
                          ))
                        ) : (
                          shop.products.slice(0, 2).map((prod) => (
                            <div key={prod.id} className="flex items-center justify-between text-xs bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                              <span className="text-slate-300 truncate max-w-[180px]">{prod.name}</span>
                              <span className="text-emerald-400 font-semibold text-[11px]">₹{prod.price.toLocaleString('en-IN')}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex flex-col sm:flex-row items-center gap-2.5">
                  <Link
                    href={`/shop/${shop.slug}`}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
                  >
                    <span>View Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/builder?shop=${shop.slug}&category=${shop.categorySlug}&template=${shop.templateId}`}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Customize</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Explore All */}
        <div className="mt-12 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#142042] hover:bg-[#1C2C5C] text-blue-400 hover:text-blue-300 font-bold text-sm border border-blue-500/20 transition-all"
          >
            <span>Explore All Indian Shop Storefronts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
