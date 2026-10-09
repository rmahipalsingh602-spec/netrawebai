'use client';

import React from 'react';
import Link from 'next/link';
import { Shop } from '@/types';
import { Sparkles, ArrowLeft, Wand2, Smartphone, Monitor, ShieldCheck, Share2 } from 'lucide-react';

interface StorefrontBannerProps {
  shop: Shop;
  isMobileFrame?: boolean;
  onToggleFrame?: () => void;
}

export default function StorefrontBanner({ shop, isMobileFrame, onToggleFrame }: StorefrontBannerProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-[#070D1E]/95 backdrop-blur-md border-b border-blue-500/30 text-white px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Netrawebai Back + Shop Identification */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <div className="w-4 h-4 rounded overflow-hidden border border-amber-400/40 bg-[#0F172A] shrink-0 shadow-sm">
              <img
                src="/images/logo.png"
                alt="Netrawebai Logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <span>Netraweb<span className="text-amber-400">ai</span></span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
              Demo Storefront
            </span>
            <span className="text-xs font-bold text-white hidden md:inline">
              {shop.name}
            </span>
          </div>
        </div>

        {/* Center: Device Frame Switcher (if handler provided) */}
        {onToggleFrame && (
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={onToggleFrame}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                !isMobileFrame ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
            <button
              onClick={onToggleFrame}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                isMobileFrame ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Simulation</span>
            </button>
          </div>
        )}

        {/* Right: Share + Big "Create a Website Like This" Action */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleShare}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition-colors"
            title="Share this demo link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>

          <Link
            href={`/builder?shop=${shop.slug}&category=${shop.categorySlug}&template=${shop.templateId}`}
            className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/40 flex items-center justify-center gap-1.5 transform hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Create a Website Like This</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
