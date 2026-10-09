'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shop, Product } from '@/types';
import { 
  Shirt, 
  Heart, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  Star, 
  Clock, 
  Check, 
  ShoppingBag,
  Scissors
} from 'lucide-react';

interface Props {
  shop: Shop;
}

export default function ClothingStorefront({ shop }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const categories = ['All', 'Sarees', 'Lehengas', 'Kurtas', 'Menswear', 'Dupattas'];

  const filteredProducts = selectedCategory === 'All'
    ? shop.products
    : shop.products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const getWhatsAppOrderLink = (product: Product) => {
    const chosenSize = selectedSizes[product.id] || (product.sizes ? product.sizes[0] : 'Standard');
    const text = `Hello Rangilo Clothing Store! I want to order this product:
Name: ${product.name}
Price: ₹${product.price.toLocaleString('en-IN')}
Selected Size: ${chosenSize}
Please let me know how to confirm and arrange home delivery/pickup.`;
    return `https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#FAF8F5] text-stone-900 min-h-screen font-serif selection:bg-rose-200 selection:text-rose-900">
      {/* Top Heritage Notice Bar */}
      <div className="bg-[#5C2417] text-amber-100 text-xs py-2 px-4 border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-sans font-semibold tracking-wide">
              Handcrafted Rajasthani Heritage • Authentic Bandhej & Gota Patti
            </span>
          </div>
          <div className="flex items-center gap-4 font-sans text-xs">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>{shop.contact.address}, {shop.contact.city}</span>
            </span>
            <a href={`tel:${shop.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>{shop.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-[45px] z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#832B1E] flex items-center justify-center text-amber-100 shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#5C2417]">{shop.name}</h1>
              <p className="text-[11px] font-sans text-stone-500 font-medium">
                {shop.tagline}
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent("Hello Rangilo Clothing! I would like to enquire about your festive collection.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#832B1E] hover:bg-[#682015] text-amber-50 rounded-full text-xs font-sans font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>
      </header>

      {/* Editorial Fashion Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-r from-[#F5EFE6] via-[#FAF8F5] to-[#F5EFE6] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-sans font-bold tracking-wider uppercase">
                Royal Rajasthani Festive Lookbook
              </span>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#4A1D13] leading-tight">
                {shop.heroHeadline}
              </h2>

              <p className="text-base font-sans text-stone-600 leading-relaxed max-w-xl">
                {shop.heroSubheadline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 font-sans">
                <a
                  href="#collection"
                  className="px-6 py-3 rounded-full bg-[#832B1E] hover:bg-[#682015] text-amber-50 font-bold text-xs shadow-lg transition-all"
                >
                  Explore Collection
                </a>
                <a
                  href={`https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent("Hello Rangilo! Can you share custom bridal lehenga catalogues?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-all"
                >
                  Request Bridal Catalogue
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-300/80 font-sans text-xs">
                <div>
                  <div className="font-bold text-stone-900 text-sm">Pure Fabrics</div>
                  <div className="text-stone-500 text-[11px]">Georgette, Silk & Fine Cotton</div>
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">Jaipuri Bandhej</div>
                  <div className="text-stone-500 text-[11px]">100% Hand Tie-Dye</div>
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">Custom Fitting</div>
                  <div className="text-stone-500 text-[11px]">In-house Master Tailoring</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-100/80 group">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                  alt="Royal Saree"
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-amber-300">
                    Handcrafted Heritage
                  </span>
                  <div className="text-xl font-serif font-bold mt-1">Royal Bandhani Silk Saree</div>
                  <div className="text-xs font-sans text-amber-200">Tripolia Bazaar Flagship Studio</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Collection Catalog Grid */}
      <section id="collection" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-stone-200">
          <div>
            <h3 className="text-2xl font-bold text-[#4A1D13]">Festive & Daily Collections</h3>
            <p className="text-xs font-sans text-stone-500 mt-0.5">Select a category or tap an item to pick your size.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-sans">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c
                    ? 'bg-[#832B1E] text-white shadow'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const currentSize = selectedSizes[product.id] || (product.sizes ? product.sizes[0] : '');
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-72 bg-stone-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#832B1E] text-amber-50 text-[10px] font-sans font-bold shadow">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-sans font-bold text-rose-800 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <div className="flex items-baseline gap-2 font-sans">
                        <span className="text-lg font-extrabold text-stone-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-[#4A1D13] leading-snug">
                      {product.name}
                    </h4>

                    <p className="text-xs font-sans text-stone-600 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Sizes Selection */}
                    {product.sizes && (
                      <div className="pt-2 font-sans">
                        <div className="text-[11px] font-semibold text-stone-500 mb-1.5">
                          Available Sizes:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {product.sizes.map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleSizeSelect(product.id, sz)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                                currentSize === sz
                                  ? 'bg-[#832B1E] text-white border-[#832B1E]'
                                  : 'bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-stone-100 mt-4 font-sans">
                  <a
                    href={getWhatsAppOrderLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order via WhatsApp ({currentSize || 'Standard'})</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-[#4A1D13] text-amber-100 py-12 px-4 font-sans text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-serif text-white font-bold text-base mb-3">{shop.name}</h5>
            <p className="text-amber-200/80 leading-relaxed">{shop.description}</p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Boutique Address</h5>
            <div className="space-y-1 text-amber-200/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{shop.contact.address}, {shop.contact.city} - {shop.contact.pincode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{shop.contact.openingHours}</span>
              </p>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Order Support</h5>
            <div className="space-y-2 text-amber-200/80">
              <p>Phone: {shop.contact.phone}</p>
              <p>WhatsApp: +{shop.contact.whatsapp}</p>
              <p className="text-amber-300 font-semibold">Worldwide & Pan-India Shipping Available</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
