import React from 'react';
import Link from 'next/link';
import { 
  IndianRupee, 
  Layers, 
  Smartphone, 
  ShoppingBag, 
  MessageSquare, 
  MapPin, 
  Palette, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ValueProposition() {
  const benefits = [
    {
      title: 'Affordable Website Creation',
      description: 'Traditional agencies charge ₹15,000–₹50,000. Netrawebai gives you premium quality at a fraction of that cost.',
      icon: IndianRupee,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Business-Specific Designs',
      description: 'Unlike generic website templates, our layouts are tailored for mobile shops, jewellery, cafes, salons, and kirana stores.',
      icon: Layers,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: '100% Mobile-Friendly Experience',
      description: 'Over 90% of your local customers browse from smartphones. Your website loads instantly and looks flawless on every screen.',
      icon: Smartphone,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Online Product & Service Catalogues',
      description: 'Display your fresh arrivals, discounts, specifications, and service menu without maintaining complex inventory software.',
      icon: ShoppingBag,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Direct WhatsApp & Phone Contact',
      description: 'Customers tap one button to send inquiries or orders straight to your personal WhatsApp number with product details filled in.',
      icon: MessageSquare,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Exact Shop Location & Opening Hours',
      description: 'Make it easy for walk-in customers to find your physical shop on Google Maps and know your daily operating timings.',
      icon: MapPin,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Custom Branding & Colors',
      description: 'Personalize your shop name, logo, primary colors, address, and banner imagery to reflect your true local reputation.',
      icon: Palette,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
    {
      title: 'Optional Future AI Enhancements',
      description: 'Easily opt into future AI catalogue descriptions, smart WhatsApp auto-responders, and automated banner generation as you grow.',
      icon: Sparkles,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#091124] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Why Choose Netrawebai</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Local Shop Owners in India
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything your business needs to turn local passersby and digital searchers into loyal, paying repeat customers.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-[#121A36] rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-5 ${benefit.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 rounded-2xl p-8 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-white">Have questions about setting up your shop?</h4>
            <p className="text-xs text-slate-300 mt-1">Chat directly with our support team on WhatsApp or preview sample stores.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              View Pricing
            </Link>
            <a
              href="https://wa.me/919829012345?text=Hello%20Netrawebai%2C%20I%20have%20a%20question%20about%20building%20my%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              WhatsApp Support
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
