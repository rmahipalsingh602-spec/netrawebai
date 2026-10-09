'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  IndianRupee, 
  Check, 
  Sparkles, 
  HelpCircle, 
  MessageCircle, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Digital Starter',
      hindi: 'डिजिटल शुरुआत',
      price: '0',
      period: 'Forever Demo',
      description: 'Ideal for local retailers wanting to design, preview, and test their storefront website.',
      badge: 'Free Demo Mode',
      popular: false,
      features: [
        'Full 20-category website builder',
        'Unlimited live previews on mobile & desktop',
        'LocalStorage draft persistence',
        'Direct WhatsApp inquiry integration',
        'Digital product & catalogue manager',
        'Export structured shop JSON',
      ],
      cta: 'Start Building Free',
      ctaHref: '/builder',
      accent: 'border-slate-800 bg-[#121A33]',
    },
    {
      name: 'Smart Dukaan',
      hindi: 'स्मार्ट दुकान',
      price: '1,499',
      period: 'per year',
      description: 'Everything a local shop owner needs to be visible online and take orders on WhatsApp.',
      badge: 'Most Popular for Retailers',
      popular: true,
      features: [
        'Everything in Digital Starter',
        'Dedicated subdomain (yourname.netrawebai.in)',
        'Up to 100 products & service items',
        'High-speed cloud edge CDN hosting',
        'Automatic SSL security padlock',
        'Google Maps location integration',
        'WhatsApp catalogue order generator',
      ],
      cta: 'Order Smart Dukaan (₹1,499)',
      ctaHref: '/order?package=smart',
      accent: 'border-blue-500 bg-[#162244] shadow-2xl shadow-blue-500/20 ring-1 ring-blue-500',
    },
    {
      name: 'Royal Dukaan',
      hindi: 'रॉयल दुकान',
      price: '2,999',
      period: 'per year',
      description: 'For established boutiques, jewellery showrooms, and cafes wanting their own custom domain name.',
      badge: 'Custom Domain Included',
      popular: false,
      features: [
        'Everything in Smart Dukaan',
        'Custom .in or .com domain registration',
        'Unlimited products & photo lookbooks',
        'Personal business email address',
        'Assisted setup via WhatsApp video call',
        'Priority Rajasthan MSME desk support',
      ],
      cta: 'Order Royal Dukaan (₹2,999)',
      ctaHref: '/order?package=royal',
      accent: 'border-slate-800 bg-[#121A33]',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Affordable & Transparent Pricing</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Honest Plans for Every Indian Dukaan
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              No hidden agency fees. No surprise maintenance charges. Build and preview your website completely free, pay only when you connect a live public domain.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 border flex flex-col justify-between relative ${plan.accent}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] tracking-wider uppercase shadow-lg shadow-blue-600/40">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">{plan.hindi}</div>
                    <h3 className="text-xl font-extrabold text-white mt-1">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-300">₹</span>
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400 ml-1">/ {plan.period}</span>
                  </div>

                  {/* Feature checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">What&apos;s Included:</div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing FAQ Banner */}
          <div className="bg-[#121A33] rounded-3xl p-8 border border-slate-800 max-w-4xl mx-auto space-y-6">
            <h3 className="text-lg font-bold text-white text-center">Frequently Asked Pricing Questions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="space-y-1.5">
                <h4 className="font-bold text-white">Can I change my template later?</h4>
                <p className="text-slate-400">Yes! You can switch design styles anytime without losing your saved products, photos, or shop details.</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-white">How does WhatsApp ordering work?</h4>
                <p className="text-slate-400">When customers tap order, WhatsApp opens with your phone number and the product title & price pre-written for immediate confirmation.</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-white">Do I have to pay commission on orders?</h4>
                <p className="text-slate-400">Zero commission! 100% of your earnings go straight to your shop UPI or cash counter. Netrawebai charges zero fees on your sales.</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-white">Can you help me set up my photos?</h4>
                <p className="text-slate-400">Yes! Contact our onboarding desk on WhatsApp and our team will guide you step-by-step.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
