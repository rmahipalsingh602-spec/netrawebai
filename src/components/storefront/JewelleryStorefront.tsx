'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shop, Product } from '@/types';
import { 
  Gem, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Calendar, 
  Check, 
  Award,
  Video
} from 'lucide-react';

interface Props {
  shop: Shop;
}

export default function JewelleryStorefront({ shop }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showVipModal, setShowVipModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [appointmentType, setAppointmentType] = useState('In-Store VIP Lounge');
  const [preferredDate, setPreferredDate] = useState('This Saturday');

  const categories = ['All', 'Gold Necklaces', 'Bridal Sets', 'Diamond Rings', 'Silver Articles'];

  const filteredProducts = activeCategory === 'All'
    ? shop.products
    : shop.products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  const getWhatsAppEnquiry = (product?: Product) => {
    const text = product 
      ? `Hello Mahadev Jewellery! I am interested in viewing:
Ornament: ${product.name}
Reference Price: ₹${product.price.toLocaleString('en-IN')}
Category: ${product.category}
Can you provide weight details, current gold rate estimate, and arrange a viewing?`
      : `Hello Mahadev Jewellery! I would like to enquire about your BIS 916 hallmarked bridal collection.`;
    return `https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const getVipAppointmentLink = () => {
    const text = `Hello Mahadev Jewellery! I would like to book a VIP appointment:
Client Name: ${customerName || 'Valued Client'}
Type: ${appointmentType}
Date: ${preferredDate}
Please confirm private salon availability!`;
    return `https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#09090B] text-amber-100 min-h-screen font-serif selection:bg-amber-500 selection:text-black">
      {/* Top Hallmark Notice Bar */}
      <div className="bg-[#121008] border-b border-amber-900/40 text-amber-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-sans">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>100% BIS 916 Hallmarked Gold • IGI Certified Solitaire Diamonds</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-amber-200/80">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Sarafa Bazaar, Jodhpur</span>
            </span>
            <a href={`tel:${shop.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{shop.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-[45px] z-40 bg-[#09090B]/95 backdrop-blur-md border-b border-amber-900/30 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20">
              <Gem className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-amber-300">{shop.name}</h1>
              <p className="text-[10px] font-sans text-amber-400/80 font-semibold tracking-widest uppercase">
                Sarafa Bazaar • Est. 1988
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-sans">
            <button
              onClick={() => setShowVipModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book VIP Appointment</span>
            </button>
            <a
              href={getWhatsAppEnquiry()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 rounded-xl text-xs font-bold border border-amber-600/40 flex items-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Luxury Jewellery Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-[#14120A] via-[#09090B] to-[#09090B] border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3.5 py-1 rounded-full bg-amber-950 border border-amber-700/60 text-amber-300 text-xs font-sans font-bold tracking-widest uppercase">
                Royal Swarn Sangraha • Rajputana Heritage
              </span>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-amber-100 leading-tight">
                {shop.heroHeadline}
              </h2>

              <p className="text-base font-sans text-amber-200/80 leading-relaxed max-w-xl">
                {shop.heroSubheadline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 font-sans">
                <a
                  href="#collection"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-extrabold text-xs shadow-xl shadow-amber-600/20 transition-all"
                >
                  Explore Jewellery Vault
                </a>
                <button
                  onClick={() => setShowVipModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-bold text-xs border border-amber-600/40 transition-all flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-amber-400" />
                  <span>Book Live Video Call Viewing</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-950 font-sans text-xs">
                <div>
                  <div className="text-amber-200 font-bold text-sm">916 Hallmark</div>
                  <div className="text-amber-400/60 text-[11px]">100% Certified 22K Purity</div>
                </div>
                <div>
                  <div className="text-amber-200 font-bold text-sm">IGI Certified</div>
                  <div className="text-amber-400/60 text-[11px]">Natural Solitaire Diamonds</div>
                </div>
                <div>
                  <div className="text-amber-200 font-bold text-sm">Lifetime Buyback</div>
                  <div className="text-amber-400/60 text-[11px]">Guaranteed Exchange Value</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-600/40 group">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
                  alt="Royal Gold Haar"
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-[10px] font-sans font-extrabold tracking-widest text-amber-400 uppercase bg-black/80 px-2 py-0.5 rounded">
                    Masterpiece
                  </span>
                  <div className="text-xl font-serif text-white font-bold mt-1">22K Royal Rajputana Haar</div>
                  <div className="text-xs font-sans text-amber-300">Net Weight: 32.50 Grams • 916 BIS Verified</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Jewellery Vault Grid */}
      <section id="collection" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-amber-950 font-sans">
          <div>
            <h3 className="text-2xl font-bold text-amber-200 font-serif">Curated Jewellery Vault</h3>
            <p className="text-xs text-amber-400/70 mt-0.5">Filter collections to view weight specifications and request real-time gold rates.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === c
                    ? 'bg-amber-600 text-black font-bold shadow'
                    : 'bg-neutral-900 text-amber-200/80 hover:text-white border border-amber-900/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-[#14120D] rounded-2xl overflow-hidden border border-amber-900/40 hover:border-amber-600/60 shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 bg-black overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14120D] via-transparent to-transparent" />
                  {item.badge && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-600 text-black text-[10px] font-sans font-extrabold shadow">
                      {item.badge}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/80 font-sans text-amber-300 text-[10px] border border-amber-800">
                    {item.category}
                  </div>
                </div>

                <div className="p-6 space-y-3 font-sans">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-amber-200">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-amber-400/80 uppercase tracking-widest font-bold">
                      Est. Price
                    </span>
                  </div>

                  <h4 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h4>

                  <p className="text-xs text-amber-200/70 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Specs */}
                  {item.specs && (
                    <div className="pt-3 border-t border-amber-950 space-y-1.5">
                      {item.specs.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px]">
                          <span className="text-amber-400/70">{s.label}</span>
                          <span className="text-amber-100 font-semibold">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-amber-950 mt-4 font-sans flex items-center gap-2">
                <a
                  href={getWhatsAppEnquiry(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-black" />
                  <span>Enquire Price / Video View</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* VIP Modal */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-[#14120D] border border-amber-600/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-amber-100">
            <button
              onClick={() => setShowVipModal(false)}
              className="absolute top-4 right-4 text-amber-400 hover:text-white text-lg font-bold"
            >
              &times;
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-serif">VIP Viewing Salon</h4>
                <p className="text-xs text-amber-400/80">Sarafa Bazaar, Jodhpur</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-amber-200 font-semibold mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-amber-900/60 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-200 font-semibold mb-1">Appointment Type</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-amber-900/60 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="In-Store VIP Lounge">In-Store VIP Lounge (Sarafa Bazaar)</option>
                  <option value="One-on-One Video Call Viewing">One-on-One Live Video Call Viewing (WhatsApp)</option>
                  <option value="Custom Bridal Jewellery Consultation">Custom Bridal Jewellery Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-200 font-semibold mb-1">Preferred Date</label>
                <select
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-amber-900/60 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This Saturday">This Saturday</option>
                  <option value="This Sunday">This Sunday</option>
                </select>
              </div>

              <a
                href={getVipAppointmentLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowVipModal(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all mt-4"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Confirm VIP Booking on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#060608] border-t border-amber-950 py-12 px-4 font-sans text-xs text-amber-400/70">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-serif text-white font-bold text-sm mb-3">{shop.name}</h5>
            <p className="leading-relaxed">{shop.description}</p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Sarafa Bazaar Showroom</h5>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-amber-200">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{shop.contact.address}, {shop.contact.city} - {shop.contact.pincode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{shop.contact.openingHours}</span>
              </p>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Customer Desk</h5>
            <div className="space-y-2">
              <p>Phone: {shop.contact.phone}</p>
              <p>WhatsApp: +{shop.contact.whatsapp}</p>
              <p className="text-amber-300 font-semibold">100% Genuine BIS Hallmark & Insured Transit</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
