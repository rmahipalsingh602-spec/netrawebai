'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shop, Product } from '@/types';
import { 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  Star, 
  Search,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface Props {
  shop: Shop;
}

export default function GenericStorefront({ shop }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Collect distinct product categories
  const categories = ['All', ...Array.from(new Set(shop.products.map((p) => p.category)))];

  const filteredProducts = shop.products.filter((p) => {
    const matchesCat = selectedCategory === 'All' ? true : p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getWhatsAppLink = (product?: Product) => {
    const text = product 
      ? `Hello ${shop.name}! I am interested in: "${product.name}" (₹${product.price}). Is this currently available?`
      : `Hello ${shop.name}! I would like to enquire about your products and services.`;
    return `https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#0B132B] text-slate-100 min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#101A38] border-b border-slate-800 px-4 py-2 text-xs">
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
            <a href={`tel:${shop.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-blue-400 flex items-center gap-1 font-semibold">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{shop.contact.phone}</span>
            </a>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Shop</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-[45px] z-40 bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: shop.theme.accentColor || '#2563EB' }}
            >
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">{shop.name}</h1>
              <p className="text-[11px] text-blue-400 font-medium">
                {shop.tagline}
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-14 lg:py-20 bg-gradient-to-b from-[#142042] via-[#0B132B] to-[#0B132B] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Local Shop • {shop.contact.city}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {shop.heroHeadline}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {shop.heroSubheadline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#catalog"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  Explore Showcase
                </a>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Send WhatsApp Message</span>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs">
                <div>
                  <div className="text-white font-bold text-sm">Best Quality</div>
                  <div className="text-slate-400 text-[11px]">100% Genuine Guarantee</div>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Doorstep Delivery</div>
                  <div className="text-slate-400 text-[11px]">Local City Express</div>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Direct Support</div>
                  <div className="text-slate-400 text-[11px]">Instant WhatsApp Help</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src={shop.bannerImage}
                  alt={shop.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">
                    {shop.category}
                  </span>
                  <div className="text-white font-bold text-lg mt-1">{shop.name}</div>
                  <div className="text-xs text-slate-300">{shop.contact.address}, {shop.contact.city}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Catalog & Services */}
      <section id="catalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-2xl font-bold text-white">Products & Catalog</h3>
            <p className="text-xs text-slate-400 mt-1">Tap any item to enquire directly on WhatsApp.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="pl-9 pr-4 py-2 bg-[#121A33] border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 w-full sm:w-52"
              />
            </div>

            {categories.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === c
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-[#121A33] text-slate-400 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Services if available */}
        {shop.services && shop.services.length > 0 && (
          <div className="mb-12">
            <h4 className="text-lg font-bold text-white mb-4">Our Services & Treatments</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shop.services.map((svc) => (
                <div key={svc.id} className="bg-[#121A36] rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-base">{svc.name}</h5>
                      <span className="text-xs font-bold text-emerald-400">From ₹{svc.startingPrice}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{svc.description}</p>
                    {svc.duration && <div className="text-[11px] text-blue-400 font-medium mt-2">Duration: {svc.duration}</div>}
                  </div>
                  <a
                    href={`https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(`Hello ${shop.name}! I would like to book service: ${svc.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Book Service</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#11182E] rounded-2xl border border-slate-800/80 hover:border-blue-500/50 overflow-hidden shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 bg-slate-900 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-emerald-400 text-xs font-black">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                    {product.category}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-800/80 mt-3">
                <a
                  href={getWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-[#070D1E] border-t border-slate-800 py-12 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-white font-bold text-sm mb-3">{shop.name}</h5>
            <p className="leading-relaxed">{shop.description}</p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Address & Hours</h5>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{shop.contact.address}, {shop.contact.city} - {shop.contact.pincode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{shop.contact.openingHours}</span>
              </p>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Customer Desk</h5>
            <div className="space-y-2">
              <p>Phone: {shop.contact.phone}</p>
              <p>WhatsApp: +{shop.contact.whatsapp}</p>
              <p className="text-blue-400 font-semibold">100% Genuine Local Retailer</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
