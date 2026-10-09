'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';
import { LanguageCode } from '@/i18n/languages';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage, currentLangInfo, availableLanguages, isAutoDetected } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-full border transition-all duration-200 ${
          compact
            ? 'px-2.5 py-1 text-xs bg-slate-900/80 border-slate-700 hover:border-blue-500 text-slate-200'
            : 'px-3 py-1.5 text-xs font-semibold bg-[#1C2541]/80 hover:bg-[#1C2541] border-slate-700/80 hover:border-blue-500/80 text-white shadow-sm'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language / भाषा बदलें"
      >
        <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="font-bold tracking-wide">{currentLangInfo.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Language Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F172A]/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              अपनी भाषा चुनें (Choose Language)
            </span>
            {isAutoDetected && (
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                ऑटो-डिटेक्ट
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto py-1 space-y-0.5 scrollbar-thin">
            {availableLanguages.map((lang) => {
              const active = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                    active
                      ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.icon}</span>
                    <div>
                      <div className="text-xs font-bold leading-tight text-white flex items-center gap-1.5">
                        <span>{lang.nativeName}</span>
                        <span className="text-[10px] font-normal text-slate-400">({lang.name})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {lang.greeting} • {lang.region}
                      </div>
                    </div>
                  </div>

                  {active && (
                    <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-1 border-t border-slate-800/80 px-2 text-[10px] text-slate-500 text-center">
            मारवाड़ी, गुजराती, तमिल समेत 9 भारतीय भाषाएँ समर्थित हैं
          </div>
        </div>
      )}
    </div>
  );
}
