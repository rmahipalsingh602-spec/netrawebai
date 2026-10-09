'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shop, Product } from '@/types';
import { 
  Smartphone, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles, 
  Cpu, 
  BatteryCharging, 
  Camera, 
  Search, 
  Zap,
  Wrench,
  Check
} from 'lucide-react';

interface Props {
  shop: Shop;
}

export default function MobileStorefront({ shop }: Props) {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const brands = ['All', 'Samsung', 'Apple', 'OnePlus', 'Vivo', 'Accessories'];

  const filteredProducts = shop.products.filter((p) => {
    const matchesBrand = selectedBrand === 'All' ? true : p.category.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const getWhatsAppLink = (productName?: string) => {
    const text = productName 
      ? `Hello ${shop.name}! I am interested in purchasing "${productName}". Is it currently available at your shop?`
      : `Hello ${shop.name}! I would like to enquire about smartphones and accessories.`;
    return `https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#090D1A] text-slate-100 min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Shop Notice Bar */}
      <div className="bg-[#10182E] border-b border-blue-900/40 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{shop.contact.address}, {shop.contact.city}</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{shop.contact.openingHours}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href={`tel:${shop.contact.phone.replace(/[^0-9+]/g, '')}`} 
              className="hover:text-blue-400 flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{shop.contact.phone}</span>
            </a>
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Shop</span>
            </a>
          </div>
        </div>
      </div>

      {/* Store Header */}
      <header className="sticky top-[45px] z-40 bg-[#090D1A]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">{shop.name}</h1>
              <p className="text-[11px] text-blue-400 font-medium tracking-wide">
                {shop.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Order</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative py-14 lg:py-20 overflow-hidden bg-gradient-to-b from-[#0F172E] via-[#090D1A] to-[#090D1A] border-b border-slate-800">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>100% Genuine Brand Warranty • Jodhpur Trusted Store</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {shop.heroHeadline}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {shop.heroSubheadline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#products"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Browse Smartphones</span>
                </a>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask Today&apos;s Price</span>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
                <div>
                  <div className="text-white font-bold text-base">0% EMI</div>
                  <div className="text-slate-400 text-[11px]">Instant Paperless Approval</div>
                </div>
                <div>
                  <div className="text-white font-bold text-base">Old Phone</div>
                  <div className="text-slate-400 text-[11px]">Best Exchange Value</div>
                </div>
                <div>
                  <div className="text-white font-bold text-base">Free Transfer</div>
                  <div className="text-slate-400 text-[11px]">100% Secure Data Shift</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"
                  alt="Flagship Smartphones"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">
                      In-Store Special
                    </span>
                    <div className="text-white font-bold text-base mt-1">Galaxy & iPhone Flagships</div>
                    <div className="text-xs text-slate-300">Ready in stock for instant hands-on demo</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls: Search & Brand Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-2xl font-extrabold text-white">Smartphones & Gadgets</h3>
            <p className="text-xs text-slate-400 mt-1">All models include GST invoice and official brand warranty.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model or specs..."
                className="pl-9 pr-4 py-2 bg-[#121A33] border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 w-full sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedBrand === b
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-[#121A33] text-slate-400 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="bg-[#11182E] rounded-2xl border border-slate-800/80 hover:border-blue-500/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-950/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 bg-slate-900 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11182E] via-transparent to-transparent" />
                    
                    {product.badge && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-blue-600 text-[10px] font-bold text-white shadow">
                        {product.badge}
                      </div>
                    )}

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-semibold text-slate-300 border border-slate-800">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h4>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                          Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Specs Pills */}
                    {product.specs && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        {product.specs.slice(0, 3).map((spec, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{spec.label}</span>
                            <span className="text-slate-200 font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-800/80 mt-4 flex items-center gap-2">
                  <a
                    href={getWhatsAppLink(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Repair Clinic Promotion Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-8 border border-blue-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Need Fast Screen Replacement or Battery Repair?</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                We also offer rapid chip-level repair with certified parts. Check out our dedicated repair partner showcase or bring your device to the shop today.
              </p>
            </div>
          </div>
          <Link
            href="/shop/royal-mobile-repair"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 transition-colors"
          >
            Check Repair Services &rarr;
          </Link>
        </div>

      </section>

      {/* Shop Location & Contact Footer */}
      <footer className="bg-[#060914] border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-400">
          <div>
            <h5 className="text-white font-bold text-sm mb-3">{shop.name}</h5>
            <p className="leading-relaxed">{shop.description}</p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Store Location & Hours</h5>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{shop.contact.address}, {shop.contact.city}, {shop.contact.state} - {shop.contact.pincode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{shop.contact.openingHours}</span>
              </p>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Quick Contact</h5>
            <div className="space-y-2">
              <a href={`tel:${shop.contact.phone}`} className="flex items-center gap-2 hover:text-white">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>{shop.contact.phone}</span>
              </a>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-400 hover:underline">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +{shop.contact.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
