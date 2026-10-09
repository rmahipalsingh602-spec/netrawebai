'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shop } from '@/types';
import { 
  Wrench, 
  Smartphone, 
  BatteryCharging, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface Props {
  shop: Shop;
}

export default function RepairStorefront({ shop }: Props) {
  const [deviceBrand, setDeviceBrand] = useState('Apple');
  const [issueType, setIssueType] = useState('Display & Screen');
  const [modelName, setModelName] = useState('');
  const [quoteRequested, setQuoteRequested] = useState(false);

  const supportedBrands = ['Apple', 'Samsung', 'OnePlus', 'Vivo', 'Oppo', 'Realme', 'Xiaomi', 'Google Pixel'];

  const getRepairWhatsAppLink = () => {
    const text = `Hello Royal Mobile Repair! I need a repair quote for:
Device Brand: ${deviceBrand}
Model: ${modelName || 'Not specified'}
Issue: ${issueType}
Please let me know estimated cost and repair turnaround time.`;
    return `https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#121214] text-neutral-100 min-h-screen font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Banner */}
      <div className="bg-emerald-950/50 border-b border-emerald-900/50 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-emerald-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free Diagnostics • 90 Days Service Warranty</span>
            </span>
            <span className="hidden sm:inline text-neutral-400">|</span>
            <span className="hidden sm:flex items-center gap-1 text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>30-Minute Express Screen Change</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a href={`tel:${shop.contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1 text-neutral-200 hover:text-white">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{shop.contact.phone}</span>
            </a>
            <a href={getRepairWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-400 hover:underline">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Instant WhatsApp Quote</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-[45px] z-40 bg-[#121214]/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-black font-extrabold shadow-lg shadow-emerald-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">{shop.name}</h1>
              <p className="text-[11px] text-emerald-400 font-medium">
                {shop.tagline}
              </p>
            </div>
          </div>

          <a
            href={getRepairWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Book Repair</span>
          </a>
        </div>
      </header>

      {/* Hero Service Section */}
      <section className="relative py-14 lg:py-20 bg-gradient-to-b from-[#18191D] via-[#121214] to-[#121214] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified Smartphone Technicians in Jodhpur</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {shop.heroHeadline}
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                {shop.heroSubheadline}
              </p>

              {/* Supported Brands Ticker */}
              <div>
                <div className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 mb-2">
                  Brands We Specialize In
                </div>
                <div className="flex flex-wrap gap-2">
                  {supportedBrands.map((b) => (
                    <span
                      key={b}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-medium border border-neutral-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>30 Mins</span>
                  </div>
                  <div className="text-neutral-400 text-[11px]">Instant Display Fit</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>90-Day</span>
                  </div>
                  <div className="text-neutral-400 text-[11px]">Service Warranty</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Data</span>
                  </div>
                  <div className="text-neutral-400 text-[11px]">Complete Privacy</div>
                </div>
              </div>
            </div>

            {/* Instant Repair Quote Calculator */}
            <div className="lg:col-span-5">
              <div className="bg-[#1A1B20] rounded-2xl p-6 border border-neutral-700 shadow-2xl relative">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Instant Repair Estimator</h3>
                    <p className="text-[11px] text-neutral-400">Get honest estimate in seconds</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1.5">
                      Select Device Brand
                    </label>
                    <select
                      value={deviceBrand}
                      onChange={(e) => setDeviceBrand(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {supportedBrands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1.5">
                      Phone Model (e.g. iPhone 13, Galaxy S21, OnePlus 11R)
                    </label>
                    <input
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      placeholder="Type your model name..."
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1.5">
                      What needs fixing?
                    </label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Display & Screen Replacement">Display & Cracked Screen Replacement</option>
                      <option value="Battery Fast Drain & Swollen Battery">Battery Replacement (High Drain / Overheating)</option>
                      <option value="Charging Port & Mic Issue">Charging Port Loose / Slow Charging / Mic Repair</option>
                      <option value="Water Damage Chemical Cleaning">Water Damage / Liquid Dropped</option>
                      <option value="Motherboard IC Micro-Soldering">Dead Motherboard / No Network IC Fault</option>
                      <option value="Software Stuck on Logo & Bootloop">Software Flashing & Bootloop Fix</option>
                    </select>
                  </div>

                  <a
                    href={getRepairWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all mt-4"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Get Free Quote on WhatsApp</span>
                  </a>

                  <p className="text-[10px] text-neutral-400 text-center">
                    No advance payment required. Pay only after your phone is fully fixed and verified.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-white">Our Signature Repair Services</h3>
          <p className="text-xs text-neutral-400 mt-1">All repairs performed in front of you on clean dust-free workstations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shop.services?.map((svc) => (
            <div
              key={svc.id}
              className="bg-[#18191E] rounded-2xl p-6 border border-neutral-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  {svc.popular && (
                    <span className="text-[10px] font-bold bg-emerald-500 text-black px-2 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {svc.name}
                </h4>

                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {svc.description}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Est. Time: <strong className="text-white">{svc.duration}</strong></span>
                  <span className="text-emerald-400 font-black text-sm">From ₹{svc.startingPrice}</span>
                </div>
              </div>

              <a
                href={getRepairWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enquire Price</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer & Shop Details */}
      <footer className="bg-[#0B0C0E] border-t border-neutral-800 py-12 px-4 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-white font-bold text-sm mb-3">{shop.name}</h5>
            <p className="leading-relaxed">{shop.description}</p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Service Centre Location</h5>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{shop.contact.address}, {shop.contact.city} - {shop.contact.pincode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{shop.contact.openingHours}</span>
              </p>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Helpdesk</h5>
            <div className="space-y-2">
              <a href={`tel:${shop.contact.phone}`} className="flex items-center gap-2 hover:text-white">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{shop.contact.phone}</span>
              </a>
              <a href={getRepairWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-400 hover:underline">
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
