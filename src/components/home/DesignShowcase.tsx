'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TEMPLATES, TEMPLATE_STYLES } from '@/data/templates';
import { 
  Palette, 
  Sparkles, 
  Monitor, 
  Smartphone, 
  ArrowRight, 
  Check, 
  Wand2,
  ExternalLink
} from 'lucide-react';

export default function DesignShowcase() {
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const filteredTemplates = selectedStyle === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.style === selectedStyle);

  return (
    <section id="designs" className="py-20 lg:py-28 bg-[#091124] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
              <Palette className="w-3.5 h-3.5 text-violet-400" />
              <span>Design Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              One Platform. Hundreds of Possibilities.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore 10 signature design themes designed to suit every retail aesthetic—from regal heritage sarees to modern cyber mobile storefronts.
            </p>
          </div>

          {/* Desktop/Mobile Device Switcher */}
          <div className="flex items-center gap-2 bg-[#131C38] p-1 rounded-xl border border-slate-800 shrink-0 self-start md:self-end">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                previewDevice === 'desktop'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                previewDevice === 'mobile'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View</span>
            </button>
          </div>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            onClick={() => setSelectedStyle('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedStyle === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#141E3B] text-slate-400 hover:text-white hover:bg-[#1C284F]'
            }`}
          >
            All 10 Styles ({TEMPLATES.length})
          </button>
          {TEMPLATE_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedStyle === style.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#141E3B] text-slate-400 hover:text-white hover:bg-[#1C284F]'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>

        {/* Templates Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
            return (
              <div
                key={template.id}
                className="group bg-[#121A36] rounded-2xl border border-slate-800/80 hover:border-violet-500/40 overflow-hidden shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-violet-950/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Template Image with Simulated Device Frame */}
                  <div className={`relative overflow-hidden bg-slate-900 transition-all duration-300 ${
                    previewDevice === 'mobile' ? 'h-64 px-12 py-3' : 'h-48'
                  }`}>
                    <div className={`w-full h-full rounded-lg overflow-hidden border border-slate-700/60 shadow-lg relative ${
                      previewDevice === 'mobile' ? 'max-w-[200px] mx-auto' : ''
                    }`}>
                      <img
                        src={template.previewImage}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      
                      {/* Style Name Badge */}
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-[10px] font-bold text-violet-300 border border-violet-500/30">
                        {template.styleName}
                      </div>

                      {template.badge && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-blue-600/90 text-[9px] font-bold text-white">
                          {template.badge}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                        {template.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-2">
                      {template.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center gap-3">
                  <Link
                    href={`/builder?template=${template.id}&category=${template.categorySlug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/30 transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Use This Template</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
