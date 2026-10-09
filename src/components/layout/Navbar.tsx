'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { 
  Store, 
  Sparkles, 
  Menu, 
  X, 
  ArrowRight, 
  LayoutDashboard, 
  Compass, 
  Layers, 
  Palette, 
  HelpCircle, 
  IndianRupee,
  LogIn
} from 'lucide-react';

function NavbarContent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '/', icon: Store },
    { name: t.nav.order, href: '/order', icon: Sparkles },
    { name: t.nav.explore, href: '/explore', icon: Compass },
    { name: t.nav.categories, href: '/categories', icon: Layers },
    { name: t.nav.designs, href: '/designs', icon: Palette },
    { name: t.nav.howItWorks, href: '/how-it-works', icon: HelpCircle },
    { name: t.nav.pricing, href: '/pricing', icon: IndianRupee },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Netraweb<span className="text-blue-500">ai</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  India
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                {t.nav.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#1C2541]/60 px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs & Language Switcher */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <LanguageSwitcher />

            <Link
              href="/admin"
              className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
              title="Admin & Enquiry Management"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.nav.ownerPortal}</span>
            </Link>

            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.nav.login}</span>
            </Link>

            <Link
              href="/order"
              className="relative inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.nav.order}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button & Language Switcher */}
          <div className="flex sm:hidden items-center gap-2">
            <LanguageSwitcher compact />
            <Link
              href="/order"
              className="px-2.5 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg shadow-sm"
            >
              Order
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0B132B]/98 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 mt-2 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">भाषा / Language:</span>
            <LanguageSwitcher />
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/order"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.nav.order} (₹1,499)</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/60"
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                {t.nav.ownerPortal}
              </span>
              <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">Quotes & Orders</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/60"
            >
              <LogIn className="w-4 h-4 text-slate-400" />
              {t.nav.login}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <NavbarContent />
    </Suspense>
  );
}
