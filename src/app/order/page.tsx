'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Store, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  IndianRupee, 
  Clock, 
  Send, 
  Check, 
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORIES = [
  { id: 'mobile-shops', label: 'Mobile & Electronics Store', icon: '📱' },
  { id: 'mobile-repair', label: 'Mobile Repair & Services', icon: '🔧' },
  { id: 'clothing', label: 'Clothing Store & Boutique', icon: '👗' },
  { id: 'cafes', label: 'Café, Restaurant & Chai Spot', icon: '☕' },
  { id: 'jewellery', label: 'Jewellery & Ornament Showroom', icon: '💎' },
  { id: 'kirana', label: 'Kirana & Grocery Dukaan', icon: '🛒' },
  { id: 'sweets', label: 'Mithai & Bakery Shop', icon: '🍬' },
  { id: 'salon', label: 'Salon, Spa & Beauty Parlour', icon: '✂️' },
  { id: 'medical', label: 'Pharmacy & Medical Store', icon: '💊' },
  { id: 'footwear', label: 'Footwear & Shoes Store', icon: '👟' },
  { id: 'hardware', label: 'Hardware & Electricals', icon: '🔨' },
  { id: 'other', label: 'Other Retail or Service Business', icon: '🏬' },
];

const TEMPLATES = [
  { id: 'tmpl-dark-premium', name: 'Dark Obsidian & Neon Blue', desc: 'Sleek, high-tech aesthetic tailored for mobile, tech & modern boutiques.' },
  { id: 'tmpl-clean-simple', name: 'Clean Botanical Minimalist', desc: 'Crisp emerald & cream palette suited for kirana, organic & daily essentials.' },
  { id: 'tmpl-pro-service', name: 'Pro Service & Quick Diagnostics', desc: 'Trust-building layout with instant repair estimation and warranty badges.' },
  { id: 'tmpl-royal-gold', name: 'Royal Gold & Velvet Luxury', desc: 'Opulent warm tones crafted for fine jewellery, bridal fashion & festive shops.' },
  { id: 'tmpl-warm-bistro', name: 'Warm Amber & Artisan Bistro', desc: 'Mouth-watering photography showcase for cafés, chai bars & quick bites.' },
];

const POPULAR_PAGES = [
  'Home Showcase',
  'Products / Catalog',
  'WhatsApp Order Basket',
  'Price List / Repair Estimator',
  'Google Map & Store Timings',
  'Photo Gallery',
  'Customer Reviews',
  'About Our Shop',
  'Warranty & Return Policy',
];

const POPULAR_FEATURES = [
  'Direct WhatsApp Chat Ordering',
  'Click-to-Call Quick Actions',
  'Google Maps Live Navigation',
  '0% EMI & Festival Offer Badges',
  'Search & Filter Products',
  'UPI QR Code on Website',
  'Instagram Feed Integration',
  'Fast Mobile Performance (< 1.5s)',
];

function OrderFormInner() {
  const searchParams = useSearchParams();
  const { t, currentLangInfo } = useLanguage();
  const preselectedPackage = searchParams.get('package') || 'smart';
  const preselectedCategory = searchParams.get('category') || '';
  const preselectedTemplate = searchParams.get('template') || 'tmpl-dark-premium';

  // Form State
  const [packageType, setPackageType] = useState<string>(preselectedPackage);
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [category, setCategory] = useState(preselectedCategory || 'mobile-shops');
  const [preferredTemplate, setPreferredTemplate] = useState(preselectedTemplate);
  const [pagesNeeded, setPagesNeeded] = useState<string[]>([
    'Home Showcase',
    'Products / Catalog',
    'WhatsApp Order Basket',
    'Google Map & Store Timings',
  ]);
  const [featuresNeeded, setFeaturesNeeded] = useState<string[]>([
    'Direct WhatsApp Chat Ordering',
    'Click-to-Call Quick Actions',
    'Google Maps Live Navigation',
  ]);
  const [productsServices, setProductsServices] = useState('');
  const [preferredColors, setPreferredColors] = useState('Obsidian Navy & Electric Blue');
  const [domainNeeded, setDomainNeeded] = useState(true);
  const [domainName, setDomainName] = useState('');
  const [budgetRange, setBudgetRange] = useState('₹1,499 (Smart Dukaan)');
  const [targetDate, setTargetDate] = useState('Within 2 to 3 days');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consentPrivacy, setConsentPrivacy] = useState(true);

  // Honeypot spam trap
  const [honeypot, setHoneypot] = useState('');

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const publicWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919829012345';

  const togglePage = (page: string) => {
    setPagesNeeded((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const toggleFeature = (feat: string) => {
    setFeaturesNeeded((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.customerName = 'Please enter your full name (at least 2 characters).';
    }

    if (!businessName.trim() || businessName.trim().length < 2) {
      errs.businessName = 'Please enter your shop or business name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!sameAsPhone) {
      const cleanWa = whatsapp.replace(/[^0-9]/g, '');
      if (cleanWa.length < 10) {
        errs.whatsapp = 'Please enter a valid 10-digit WhatsApp number.';
      }
    }

    if (!category) {
      errs.category = 'Please select a business category.';
    }

    if (!consentPrivacy) {
      errs.consent = 'You must agree to the privacy policy to submit an enquiry.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      // Scroll to the first error
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalWhatsApp = sameAsPhone ? phone : whatsapp;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          businessName,
          email,
          phone,
          whatsapp: finalWhatsApp,
          category,
          preferredTemplate,
          pagesNeeded,
          featuresNeeded,
          productsServices,
          preferredColors,
          domainNeeded,
          domainName,
          budgetRange: packageType === 'smart' ? '₹1,499' : packageType === 'royal' ? '₹2,999' : budgetRange,
          targetDate,
          referenceLinks,
          additionalNotes,
          packageType,
          consentPrivacy,
          website_url_hp: honeypot, // Honeypot field
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      setSubmitSuccess(data);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp quick discuss message generator
  const getWhatsAppChatUrl = () => {
    const summary = `Namaste Netrawebai! I am interested in building a website for my shop *${businessName || 'My Shop'}* (${category || 'Local Business'}).\n\n- Package: ${packageType.toUpperCase()}\n- My Name: ${customerName || 'Shop Owner'}\n- Contact: ${phone || 'Available on WhatsApp'}\n\nPlease share details and help me get started!`;
    return `https://wa.me/${publicWhatsApp}?text=${encodeURIComponent(summary)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-white font-bold">{currentLangInfo.icon} {currentLangInfo.greeting}!</span>
          <span className="text-slate-500">•</span>
          <span>{t.order.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {t.order.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">{t.order.titleHighlight}</span>
        </h1>
        <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {t.order.subtitle}
        </p>

        {/* Quick WhatsApp Action bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://wa.me/${publicWhatsApp}?text=${encodeURIComponent('Hello Netrawebai team, I want to discuss creating a website for my local business.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-105"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>{t.order.preferWhatsAppBanner}</span>
          </a>
          <span className="text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="text-xs text-slate-400">No advance payment required for custom review</span>
        </div>
      </div>

      {/* Success View */}
      {submitSuccess ? (
        <div className="bg-[#1C2541]/90 rounded-3xl p-8 sm:p-12 border border-emerald-500/30 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
              Enquiry Successfully Recorded
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-4">
              Dhanyawaad, {customerName}!
            </h2>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Your website project request for <strong className="text-white font-semibold">{businessName}</strong> has been safely stored in our central repository.
            </p>

            {/* Reference Card */}
            <div className="my-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Enquiry ID / Tracking No:</span>
                <span className="font-mono font-bold text-blue-400">{submitSuccess.enquiryNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Selected Plan:</span>
                <span className="font-semibold text-white capitalize">{packageType} Dukaan</span>
              </div>
              {submitSuccess.quotedAmount ? (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Standard Package Amount:</span>
                  <span className="font-bold text-emerald-400">₹{submitSuccess.quotedAmount.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Estimated Quote Status:</span>
                  <span className="text-amber-400 font-medium">Pending Review by Tech Team</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-8">
              We have dispatched an email confirmation to <span className="text-slate-200 font-medium">{email}</span>. You can review your project details and track its progress anytime using your secure link below.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={submitSuccess.quoteUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                <span>View My Project & Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={getWhatsAppChatUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discuss On WhatsApp (Fastest)</span>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Your contact information is strictly confidential and protected by Netrawebai.</span>
            </div>
          </div>
        </div>
      ) : (
        /* The Enquiry Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Honeypot field (hidden from real users) */}
          <input
            type="text"
            name="website_url_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {serverError && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Submission Error</strong>
                <span>{serverError}</span>
              </div>
            </div>
          )}

          {/* Section 1: Choose Website Package / Order Path */}
          <div className="bg-[#1C2541]/70 rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Choose Your Website Package</h2>
                <p className="text-xs text-slate-400">Select a fixed all-inclusive package or request a custom quote</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option A1: Smart Dukaan (₹1,499) */}
              <div
                onClick={() => setPackageType('smart')}
                className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
                  packageType === 'smart'
                    ? 'bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                    : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase font-extrabold text-blue-400 tracking-wider">
                    Most Popular
                  </span>
                  {packageType === 'smart' && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">Smart Dukaan</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">₹1,499</span>
                  <span className="text-xs text-slate-400">one-time</span>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Up to 5 Pages + Catalog</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>WhatsApp Order Basket</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Free 1-Year Hosting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Ready in 2-3 Days</span>
                  </li>
                </ul>
              </div>

              {/* Option A2: Royal Brand (₹2,999) */}
              <div
                onClick={() => setPackageType('royal')}
                className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
                  packageType === 'royal'
                    ? 'bg-indigo-900/30 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                    : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                    Full Power
                  </span>
                  {packageType === 'royal' && (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">Royal Brand</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">₹2,999</span>
                  <span className="text-xs text-slate-400">one-time</span>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Unlimited Catalog Items</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Custom .in Domain Included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Google Maps SEO Setup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Priority 24h Delivery</span>
                  </li>
                </ul>
              </div>

              {/* Option B: Custom Website Quote */}
              <div
                onClick={() => setPackageType('custom')}
                className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
                  packageType === 'custom'
                    ? 'bg-violet-900/30 border-violet-500 shadow-lg shadow-violet-500/20 ring-1 ring-violet-500'
                    : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase font-extrabold text-violet-400 tracking-wider">
                    Tailored Quote
                  </span>
                  {packageType === 'custom' && (
                    <div className="w-5 h-5 rounded-full bg-violet-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">Custom Specification</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white">Custom</span>
                  <span className="text-xs text-slate-400">review & quote</span>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Multi-Branch or Franchise</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Custom Integrations & APIs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Payment Gateway Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Owner Prepares Quote</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Shop Information */}
          <div className="bg-[#1C2541]/70 rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Your Contact & Business Details</h2>
                <p className="text-xs text-slate-400">Where should we deliver your demo link and quote?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.customerName ? 'border-rose-500' : 'border-slate-700 focus:border-blue-500'
                  }`}
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs text-rose-400">{errors.customerName}</p>
                )}
              </div>

              {/* Shop / Business Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Shop or Business Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Balaji Mobile & Electronics"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.businessName ? 'border-rose-500' : 'border-slate-700 focus:border-blue-500'
                  }`}
                />
                {errors.businessName && (
                  <p className="mt-1 text-xs text-rose-400">{errors.businessName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.email ? 'border-rose-500' : 'border-slate-700 focus:border-blue-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
                )}
                <span className="text-[11px] text-slate-400 mt-1 block">We will send your quote & credentials here</span>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone Number (Calling) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-slate-400">+91</span>
                  <input
                    type="tel"
                    placeholder="98290 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.phone ? 'border-rose-500' : 'border-slate-700 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-400">{errors.phone}</p>
                )}
              </div>

              {/* WhatsApp Toggle */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 mb-2">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>My WhatsApp number is the same as calling number</span>
                </label>

                {!sameAsPhone && (
                  <div className="mt-2 max-w-sm">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      WhatsApp Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-slate-400">+91</span>
                      <input
                        type="tel"
                        placeholder="94140 12345"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className={`w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.whatsapp ? 'border-rose-500' : 'border-slate-700 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.whatsapp && (
                      <p className="mt-1 text-xs text-rose-400">{errors.whatsapp}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Business Category Selection */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Business Category <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`text-left p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 ${
                        category === cat.id
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/30'
                          : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Design & Styling Preferences */}
          <div className="bg-[#1C2541]/70 rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Design & Visual Style</h2>
                <p className="text-xs text-slate-400">Pick a starting visual theme and preferred color palette</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Preferred Template */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Preferred Visual Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => setPreferredTemplate(tmpl.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        preferredTemplate === tmpl.id
                          ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{tmpl.name}</span>
                        {preferredTemplate === tmpl.id && (
                          <span className="text-[10px] bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded">Selected</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{tmpl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred Colors */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Preferred Brand Colors
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Navy & Gold, Emerald Green & White, Saffron & Crimson"
                  value={preferredColors}
                  onChange={(e) => setPreferredColors(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Required Pages & Interactive Features */}
          <div className="bg-[#1C2541]/70 rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                4
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Pages, Features & Products</h2>
                <p className="text-xs text-slate-400">Select what features your website should include</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Pages Needed */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Pages You Need on Your Website
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_PAGES.map((page) => {
                    const active = pagesNeeded.includes(page);
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => togglePage(page)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          active
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {page}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Features Needed */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Interactive Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_FEATURES.map((feat) => {
                    const active = featuresNeeded.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {feat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products / Services to Display */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Top Products or Services to Display
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. iPhone 15 & 16, Samsung S24 Ultra, Fast 65W Chargers, Tempered Glass, 30-Minute Screen Replacement..."
                  value={productsServices}
                  onChange={(e) => setProductsServices(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Domain & Timeline */}
          <div className="bg-[#1C2541]/70 rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                5
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Domain & Delivery Timeline</h2>
                <p className="text-xs text-slate-400">Do you need a custom website address or have specific timelines?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Domain Requirements */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 mb-2">
                  <input
                    type="checkbox"
                    checked={domainNeeded}
                    onChange={(e) => setDomainNeeded(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>I want my own custom domain (e.g. yourshopname.in or .com)</span>
                </label>

                {domainNeeded && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="e.g. balajimobile.in or shreeramsweets.com"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Note: You also get a free instant address like <code className="text-blue-400">yourshop.netrawebai.in</code>
                    </span>
                  </div>
                )}
              </div>

              {/* Target Delivery Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Desired Completion Date
                </label>
                <select
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Within 24 to 48 hours (Express)">Within 24 to 48 hours (Express)</option>
                  <option value="Within 2 to 3 days">Within 2 to 3 days (Standard)</option>
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="Flexible / Preparing Catalog">Flexible / Preparing Catalog</option>
                </select>
              </div>

              {/* Reference Website Links */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Reference Website or Competitor Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={referenceLinks}
                  onChange={(e) => setReferenceLinks(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Additional Requirements */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Any Other Instructions or Special Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="Any particular banners, festival greetings, payment options or specific questions..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Privacy Consent & Submit Action */}
          <div className="bg-[#1C2541]/70 rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                id="consentPrivacy"
                checked={consentPrivacy}
                onChange={(e) => setConsentPrivacy(e.target.checked)}
                className="mt-1 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <label htmlFor="consentPrivacy" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                I agree to the <strong className="text-white">Netrawebai Privacy Policy & Terms</strong>. I authorize Netrawebai to contact me via WhatsApp or email regarding this website project enquiry. No private information is shared with third parties.
              </label>
            </div>
            {errors.consent && (
              <p className="mb-4 text-xs text-rose-400">{errors.consent}</p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero spam guarantee. Review before payment.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-blue-700/60 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Your Enquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {packageType === 'smart' 
                        ? 'Submit Enquiry & Book Smart Dukaan (₹1,499)' 
                        : packageType === 'royal'
                        ? 'Submit Enquiry & Book Royal Brand (₹2,999)'
                        : 'Submit Project For Custom Review'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="min-h-[500px] flex items-center justify-center text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
              Loading website request form...
            </div>
          }
        >
          <OrderFormInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
