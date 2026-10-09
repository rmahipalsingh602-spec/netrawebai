'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shop, Product } from '@/types';
import { 
  Coffee, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Utensils, 
  Calendar, 
  Users, 
  Check, 
  Heart,
  Sparkles
} from 'lucide-react';

interface Props {
  shop: Shop;
}

export default function CafeStorefront({ shop }: Props) {
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('All');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('Today Evening');
  const [bookingGuests, setBookingGuests] = useState('2 Guests');
  const [bookingTime, setBookingTime] = useState('7:30 PM');
  const [customerName, setCustomerName] = useState('');

  const menuCategories = ['All', 'Chai & Tea', 'Cold Brews', 'Snacks & Bites', 'Pizza & Pasta', 'Desserts'];

  const filteredProducts = activeMenuCategory === 'All'
    ? shop.products
    : shop.products.filter((p) => p.category.toLowerCase() === activeMenuCategory.toLowerCase());

  const getWhatsAppOrderLink = (item?: Product) => {
    const text = item 
      ? `Hello Marwad Café! I would like to order: "${item.name}" (₹${item.price}). Can you prepare this for takeaway / dining?`
      : `Hello Marwad Café! I would like to enquire about your menu and today's specials.`;
    return `https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const getReservationWhatsAppLink = () => {
    const text = `Hello Marwad Café! I would like to reserve a table:
Name: ${customerName || 'Guest'}
Date: ${bookingDate}
Time: ${bookingTime}
Party Size: ${bookingGuests}
Please confirm table availability!`;
    return `https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#1C1917] text-stone-100 min-h-screen font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#292524] text-amber-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Specialty Roasted Coffee • Authentic Jodhpuri Kullad Chai</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-stone-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{shop.contact.openingHours}</span>
            </span>
            <a href={`tel:${shop.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{shop.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-[45px] z-40 bg-[#1C1917]/95 backdrop-blur-md border-b border-stone-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-600 flex items-center justify-center text-white shadow-md">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">{shop.name}</h1>
              <p className="text-[11px] text-amber-400/90 font-medium">{shop.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </button>
            <a
              href={getWhatsAppOrderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Café Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-[#292524] via-[#1C1917] to-[#1C1917] border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cosy Hangout & Specialty Bites in Jodhpur</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {shop.heroHeadline}
              </h2>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
                {shop.heroSubheadline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#menu"
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-lg transition-all"
                >
                  View Digital Menu
                </a>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 transition-all"
                >
                  Reserve a Table
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800 text-xs">
                <div>
                  <div className="text-white font-bold text-sm">Fresh Brews</div>
                  <div className="text-stone-400 text-[11px]">Arabica Beans Grinded Daily</div>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Free Wi-Fi</div>
                  <div className="text-stone-400 text-[11px]">Work & Study Friendly</div>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Live Music</div>
                  <div className="text-stone-400 text-[11px]">Weekend Acoustic Nights</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-700 group">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
                  alt="Marwad Cafe Ambient Vibe"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] bg-amber-600 text-stone-950 font-extrabold px-2 py-0.5 rounded">
                    Paota Circle Flagship
                  </span>
                  <div className="text-white font-bold text-lg mt-1">Marwad Café & Bistro</div>
                  <div className="text-xs text-amber-200">Open Daily 08:00 AM - 11:00 PM</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Menu Categories Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-stone-800">
          <div>
            <h3 className="text-2xl font-bold text-white">Our Signature Menu</h3>
            <p className="text-xs text-stone-400 mt-0.5">Prepared fresh with pure ingredients and lots of love.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {menuCategories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveMenuCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeMenuCategory === c
                    ? 'bg-amber-600 text-stone-950 font-bold shadow'
                    : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-[#24201D] rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/40 shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-stone-900 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-amber-600 text-stone-950 text-[10px] font-extrabold shadow">
                      {item.badge}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 text-xs font-black">
                    ₹{item.price}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-800/80 mt-3">
                <a
                  href={getWhatsAppOrderLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-stone-700 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Order via WhatsApp (₹{item.price})</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Table Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#24201D] border border-amber-600/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg font-bold"
            >
              &times;
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Reserve a Table</h4>
                <p className="text-xs text-stone-400">Marwad Café & Bistro, Paota Circle</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Date</label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Today Evening">Today Evening</option>
                    <option value="Tomorrow Afternoon">Tomorrow Afternoon</option>
                    <option value="Tomorrow Evening">Tomorrow Evening</option>
                    <option value="This Weekend">This Weekend</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Party Size</label>
                  <select
                    value={bookingGuests}
                    onChange={(e) => setBookingGuests(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests (Couple)</option>
                    <option value="4 Guests">4 Guests</option>
                    <option value="6+ Guests">6+ Guests (Party)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Preferred Time</label>
                <input
                  type="text"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  placeholder="e.g. 7:30 PM"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <a
                href={getReservationWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowBookingModal(false)}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all mt-4"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm Reservation via WhatsApp</span>
              </a>

              <p className="text-[10px] text-stone-400 text-center">
                We will confirm table availability within 5 minutes on WhatsApp!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#141210] border-t border-stone-800 py-12 px-4 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-white font-bold text-sm mb-3">{shop.name}</h5>
            <p className="leading-relaxed">{shop.description}</p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Location & Hours</h5>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-stone-300">
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
            <h5 className="text-white font-bold text-sm mb-3">Reservations & Calls</h5>
            <div className="space-y-2">
              <p>Phone: {shop.contact.phone}</p>
              <p>WhatsApp: +{shop.contact.whatsapp}</p>
              <p className="text-amber-400 font-semibold">Takeaway & Swiggy/Zomato pickup available</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
