'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TEMPLATES, TEMPLATE_STYLES } from '@/data/templates';
import { 
  Palette, 
  Sparkles, 
  Monitor, 
  Smartphone, 
  Check, 
  Wand2, 
  ExternalLink 
} from 'lucide-react';

export default function DesignsPage() {
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  const filteredTemplates = selectedStyle === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.style === selectedStyle);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
              <Palette className="w-3.5 h-3.5" />
              <span>Full Design Gallery</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Website Designs & Styles
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every design is purpose-built with mobile-first responsive cards, high-conversion inquiry buttons, and optimized layout typography.
            </p>
          </div>

          {/* Device and Style Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <button
                onClick={() => setSelectedStyle('all')}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedStyle === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#121A33] text-slate-400 hover:text-white'
                }`}
              >
                All 10 Styles ({TEMPLATES.length})
              </button>
              {TEMPLATE_STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id)}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedStyle === st.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-[#121A33] text-slate-400 hover:text-white'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#121A33] p-1 rounded-xl border border-slate-800 shrink-0 self-start md:self-auto text-xs">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  deviceView === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  deviceView === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-[#121A36] rounded-2xl border border-slate-800 hover:border-violet-500/40 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`relative bg-slate-900 transition-all ${
                    deviceView === 'mobile' ? 'h-64 px-12 py-3' : 'h-48'
                  }`}>
                    <div className="w-full h-full rounded-lg overflow-hidden border border-slate-700/60 relative">
                      <img
                        src={template.previewImage}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-[10px] font-bold text-violet-300">
                        {template.styleName}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-white">{template.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{template.description}</p>
                    
                    <div className="space-y-1.5 pt-2">
                      {template.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-800/80 mt-4">
                  <Link
                    href={`/builder?template=${template.id}&category=${template.categorySlug}`}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-600/30 transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Build With This Style</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
