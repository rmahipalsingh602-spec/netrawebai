'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Smartphone, 
  ShoppingBag, 
  Coffee, 
  Gem, 
  ShoppingBasket, 
  Wrench,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { t, currentLangInfo } = useLanguage();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  const previewStores = [
    {
      name: 'Mahadev Mobile',
      cat: 'Mobile Shop',
      city: 'Jodhpur',
      slug: 'mahadev-mobile',
      tag: '5G Phones & Deals',
      color: 'from-blue-600 to-indigo-900',
      icon: Smartphone,
    },
    {
      name: 'Rangilo Boutique',
      cat: 'Fashion & Sarees',
      city: 'Jaipur',
      slug: 'rangilo-clothing',
      tag: 'Bandhej & Lehengas',
      color: 'from-rose-500 to-amber-700',
      icon: ShoppingBag,
    },
    {
      name: 'Marwad Café',
      cat: 'Café & Chai',
      city: 'Jodhpur',
      slug: 'marwad-cafe',
      tag: 'Kullad Chai & Brews',
      color: 'from-amber-600 to-stone-900',
      icon: Coffee,
    },
    {
      name: 'Mahadev Jewellery',
      cat: 'Gold & Diamond',
      city: 'Udaipur',
      slug: 'mahadev-jewellery',
      tag: '916 BIS Hallmark',
      color: 'from-yellow-600 to-amber-950',
      icon: Gem,
    },
    {
      name: 'Lakhmi Kirana',
      cat: 'Grocery Essentials',
      city: 'Jodhpur',
      slug: 'lakhmi-kirana',
      tag: 'Daily Desi Ghee & Atta',
      color: 'from-emerald-600 to-teal-900',
      icon: ShoppingBasket,
    },
    {
      name: 'Royal Mobile Repair',
      cat: 'Service Doctor',
      city: 'Jodhpur',
      slug: 'royal-mobile-repair',
      tag: '30-Min Screen Fix',
      color: 'from-cyan-600 to-slate-900',
      icon: Wrench,
    },
  ];

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#070D1E] via-[#0B132B] to-[#0F172A]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy, Search, CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Mission Badge with 3D Logo */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-amber-500/5">
              <div className="w-5 h-5 rounded-lg overflow-hidden border border-amber-400/50 bg-[#0F172A] shrink-0 shadow-sm">
                <img
                  src="/images/logo.png"
                  alt="Netrawebai Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Har Dukaan Online — हर दुकान ऑनलाइन</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-200">Your Shop. Your Style. Your Website.</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                {t.hero.headlinePart1}{' '}
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  {t.hero.headlineHighlight}
                </span>{' '}
                {t.hero.headlinePart2}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t.hero.subheading}
              </p>
            </div>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shops, business categories, or website designs..."
                  className="w-full pl-12 pr-32 py-4 bg-[#16203D]/90 border border-slate-700/80 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all shadow-xl shadow-black/20"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  Search
                </button>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-[11px] text-slate-400">
                <span className="text-slate-500">Popular:</span>
                {['Mobile Shops', 'Repair', 'Clothing', 'Café', 'Jewellery', 'Kirana'].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      setSearchQuery(item);
                      router.push(`/explore?q=${encodeURIComponent(item)}`);
                    }}
                    className="hover:text-blue-400 underline underline-offset-2 decoration-slate-600 hover:decoration-blue-400 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </form>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/order"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.hero.createBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <span>{t.hero.exploreBtn}</span>
              </Link>
            </div>

            {/* Trust bullet points */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Coding Needed</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Integrated</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live in 10 Minutes</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Overlapping Storefront Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Overlapping Storefront Card */}
              <div className="bg-[#151D3B] border border-slate-700/80 rounded-2xl p-4 shadow-2xl shadow-blue-950/50 relative z-20">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-[11px] font-mono text-slate-400 ml-2">mahadev-mobile.netrawebai.in</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                    Live Demo
                  </span>
                </div>

                {/* Card Interior Preview */}
                <div className="pt-3 space-y-3">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group">
                    <img
                      src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80"
                      alt="Mahadev Mobile Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded">
                          Mobile Shop
                        </span>
                        <h4 className="text-white font-bold text-base mt-1">Mahadev Mobile</h4>
                        <p className="text-[11px] text-slate-300">Nai Sarak, Jodhpur • 4.9 ★ (342 reviews)</p>
                      </div>
                      <Link
                        href="/shop/mahadev-mobile"
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors"
                        title="View Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Sample Product Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-200">Galaxy S24 Ultra</div>
                        <div className="text-[10px] text-emerald-400 font-bold">₹1,29,999</div>
                      </div>
                      <div className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Samsung</div>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-200">iPhone 16 Pro</div>
                        <div className="text-[10px] text-emerald-400 font-bold">₹1,19,900</div>
                      </div>
                      <div className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Apple</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <Link
                      href="/shop/mahadev-mobile"
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <span>Open Mahadev Mobile Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href="https://wa.me/919829012345?text=Hello%20Mahadev%20Mobile%2C%20I%20am%20interested%20in%20smartphones"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp Order</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Overlapping Quick Pills around the main card */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previewStores.slice(1, 4).map((store) => {
                  const Icon = store.icon;
                  return (
                    <Link
                      key={store.slug}
                      href={`/shop/${store.slug}`}
                      className="group bg-[#111933]/90 hover:bg-[#1A254B] border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 group-hover:text-blue-400">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] text-slate-400">{store.city}</span>
                      </div>
                      <div className="text-[11px] font-bold text-white truncate group-hover:text-blue-400">
                        {store.name}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">{store.tag}</div>
                    </Link>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
