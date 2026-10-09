'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Store, Heart, Sparkles, MapPin, Phone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#070D1E] border-t border-slate-800 text-slate-400 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />

      {/* Pre-footer Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-slate-800/80">
        <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 rounded-3xl p-8 sm:p-12 border border-blue-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {t.footer.initiative}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.footer.headline}
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.footer.subheadline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/order"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center gap-2 group transition-all"
            >
              <span>{t.footer.createBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center transition-colors"
            >
              {t.footer.exploreBtn}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Store className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Netraweb<span className="text-blue-500">ai</span>
              </span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              {t.footer.description}
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{t.footer.craftedWithPride}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Mobile-Friendly & WhatsApp-Integrated Storefronts</span>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/categories/mobile-shops" className="hover:text-blue-400 transition-colors">
                  Mobile Shops
                </Link>
              </li>
              <li>
                <Link href="/categories/mobile-repair" className="hover:text-blue-400 transition-colors">
                  Mobile Repair Shops
                </Link>
              </li>
              <li>
                <Link href="/categories/clothing" className="hover:text-blue-400 transition-colors">
                  Clothing & Boutiques
                </Link>
              </li>
              <li>
                <Link href="/categories/cafes" className="hover:text-blue-400 transition-colors">
                  Cafés & Chai Spots
                </Link>
              </li>
              <li>
                <Link href="/categories/jewellery" className="hover:text-blue-400 transition-colors">
                  Jewellery Stores
                </Link>
              </li>
              <li>
                <Link href="/categories/kirana" className="hover:text-blue-400 transition-colors">
                  Kirana & Grocery
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-blue-400 font-semibold hover:underline">
                  View All 20 Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Product & Platform */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Explore & Build
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/order" className="text-blue-400 font-semibold hover:underline">
                  Order Website / Request Quote &rarr;
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-blue-400 transition-colors">
                  Interactive Website Builder
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-blue-400 transition-colors">
                  Discover Live Demos
                </Link>
              </li>
              <li>
                <Link href="/designs" className="hover:text-blue-400 transition-colors">
                  Design Showcase
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-400 transition-colors text-slate-300">
                  Owner Portal & Enquiries
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-400 transition-colors">
                  Affordable Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Trust & Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/how-it-works#faq" className="hover:text-blue-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/919829012345?text=Hello%20Netrawebai%20Team%2C%20I%20want%20help%20building%20my%20website" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Helpdesk</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500">Privacy Policy (Compliant)</span>
              </li>
              <li>
                <span className="text-slate-500">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-500">Rajasthan MSME Support</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; 2026 Netrawebai Technologies. {t.footer.allRightsReserved}.
          </p>
          <div className="flex items-center gap-1 text-slate-300">
            <span>{t.footer.builtForBharat}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
