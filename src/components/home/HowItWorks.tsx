import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Palette, 
  Edit3, 
  Rocket, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Shop Category',
      hindi: 'अपनी दुकान की श्रेणी चुनें',
      description: 'Select from 20 business types—whether you run a mobile shop, boutique, café, jewellery showroom, or kirana store.',
      icon: Layers,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      step: '02',
      title: 'Select Your Website Design',
      hindi: 'पसंदीदा वेबसाइट डिज़ाइन चुनें',
      description: 'Pick an aesthetic suited to your market: sleek dark cyber for tech, royal gold for jewellery, or clean botanical for groceries.',
      icon: Palette,
      color: 'from-violet-600 to-purple-600',
    },
    {
      step: '03',
      title: 'Add Shop Details & Items',
      hindi: 'दुकान की जानकारी और सामान जोड़ें',
      description: 'Enter your business name, address, WhatsApp number, and easily upload product photos, prices, and service descriptions.',
      icon: Edit3,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      step: '04',
      title: 'Preview, Save & Publish',
      hindi: 'प्रीव्यू करें, सेव करें और पब्लिश करें',
      description: 'Check how your website looks on mobile and desktop. Save your draft locally and publish your link to share on WhatsApp.',
      icon: Rocket,
      color: 'from-amber-600 to-orange-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#0B132B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Netrawebai Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            No technical knowledge needed. If you know how to send a WhatsApp message, you can launch your own business website with Netrawebai.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#121A36] rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  {/* Step Number Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-slate-700 group-hover:text-blue-500/40 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs text-blue-400/90 font-medium mt-0.5 mb-3">
                    {item.hindi}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Takes ~2 minutes</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 text-center">
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <span>Start Building for Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
