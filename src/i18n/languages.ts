export type LanguageCode = 
  | 'hi'   // Hindi (हिन्दी)
  | 'mwr'  // Marwadi / Rajasthani (मारवाड़ी)
  | 'gu'   // Gujarati (ગુજરાતી)
  | 'mr'   // Marathi (मराठी)
  | 'ta'   // Tamil (தமிழ்)
  | 'te'   // Telugu (తెలుగు)
  | 'bn'   // Bengali (বাংলা)
  | 'pa'   // Punjabi (ਪੰਜਾਬੀ)
  | 'en';  // English

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
  icon: string;
  greeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'सम्पूर्ण भारत (All India)',
    icon: '🇮🇳',
    greeting: 'नमस्ते',
  },
  {
    code: 'mwr',
    name: 'Marwadi',
    nativeName: 'मारवाड़ी',
    region: 'राजस्थान (Rajasthan & Marwad)',
    icon: '🏰',
    greeting: 'खम्मा घणी',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'ગુજરાત (Gujarat)',
    icon: '🦁',
    greeting: 'નમસ્તે',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'தமிழ்நாடு (Tamil Nadu)',
    icon: '🏛️',
    greeting: 'வணக்கம்',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'महाराष्ट्र (Maharashtra)',
    icon: '🚩',
    greeting: 'नमस्कार',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'ఆంధ్రప్రదేశ్ & తెలంగాణ (AP & Telangana)',
    icon: '🌾',
    greeting: 'నమస్కారం',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'পশ্চিমবঙ্গ (West Bengal)',
    icon: '🪷',
    greeting: 'নমস্কার',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'ਪੰਜਾਬ (Punjab)',
    icon: '✨',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Global / Indian Business',
    icon: '🌐',
    greeting: 'Welcome',
  },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'hi';
