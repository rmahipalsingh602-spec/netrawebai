'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HowItWorks from '@/components/home/HowItWorks';
import ValueProposition from '@/components/home/ValueProposition';
import { Sparkles, ArrowRight, HelpCircle, Phone, MessageCircle } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 pt-28">
        {/* Intro */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Step-by-Step Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Netrawebai Brings Your Shop Online
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Everything designed for busy shop owners in India. If you can use a smartphone, you can build your own professional website in 10 minutes.
          </p>
        </div>

        {/* Existing modular HowItWorks and ValueProposition components */}
        <HowItWorks />
        <ValueProposition />

        {/* Interactive FAQ Section with #faq anchor */}
        <section id="faq" className="py-20 bg-[#091124] border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Got Questions? We Have Answers.</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Do I need computer coding or design skills?",
                  a: "None at all. All designs are ready-made. You simply select your shop type, type in your shop name, address, and WhatsApp number, and upload product photos or select samples.",
                },
                {
                  q: "How do customers reach me from my website?",
                  a: "Every product and page includes direct WhatsApp and phone call buttons. When a customer taps the button, WhatsApp opens directly to your mobile number with the product details already typed out.",
                },
                {
                  q: "Can I show my shop's exact location on Google Maps?",
                  a: "Yes! Simply paste your shop location link or address, and Netrawebai automatically renders a clickable navigation map button so walk-in customers can visit your physical shop.",
                },
                {
                  q: "What if I want to update my prices or add new arrivals later?",
                  a: "You can open your Shop Owner Dashboard anytime, edit product prices, mark items in or out of stock, and save your changes immediately.",
                },
                {
                  q: "Is Netrawebai available in regional Indian states like Rajasthan?",
                  a: "Yes! Netrawebai is crafted with pride in Rajasthan specifically for Indian local business owners, boutiques, kirana stores, cafés, and repair shops across Bharat.",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#121A33] rounded-2xl p-6 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-white text-sm sm:text-base">{item.q}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 text-center">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all"
              >
                <span>Launch Your Shop Website Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
