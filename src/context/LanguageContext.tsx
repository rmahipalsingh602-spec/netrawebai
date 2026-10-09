'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, LanguageInfo, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/i18n/languages';
import { translations, Translations } from '@/i18n/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLangInfo: LanguageInfo;
  availableLanguages: LanguageInfo[];
  t: Translations;
  isAutoDetected: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'netrawebai_language_pref';

function detectUserLanguage(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  // 1. Saved user preference takes highest priority
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
  } catch {}

  // 2. Browser navigator.languages detection
  try {
    const navLanguages = navigator.languages || [navigator.language || ''];
    for (const rawLang of navLanguages) {
      const lower = rawLang.toLowerCase();
      if (lower.startsWith('gu')) return 'gu';
      if (lower.startsWith('ta')) return 'ta';
      if (lower.startsWith('mr')) return 'mr';
      if (lower.startsWith('te')) return 'te';
      if (lower.startsWith('bn')) return 'bn';
      if (lower.startsWith('pa')) return 'pa';
      if (lower.startsWith('hi')) return 'hi';
    }
  } catch {}

  // 3. Indian default timezone check
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta')) {
      return 'hi'; // Default to Hindi for Indian locales
    }
  } catch {}

  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const detected = detectUserLanguage();
    setLanguageState(detected);
    const hasManualPreference = Boolean(localStorage.getItem(STORAGE_KEY));
    setIsAutoDetected(!hasManualPreference && detected !== DEFAULT_LANGUAGE);
    setMounted(true);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = detected;
    }
  }, []);

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    setIsAutoDetected(false);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
      }
    } catch {}
  };

  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const t = translations[language] || translations[DEFAULT_LANGUAGE];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLangInfo,
        availableLanguages: SUPPORTED_LANGUAGES,
        t,
        isAutoDetected,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
