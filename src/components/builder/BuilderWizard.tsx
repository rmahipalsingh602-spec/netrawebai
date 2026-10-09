'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  Shop, 
  CategoryId, 
  Product, 
  WebsiteTemplate, 
  WebsiteDraft, 
  TemplateStyle 
} from '@/types';
import { CATEGORIES } from '@/data/categories';
import { TEMPLATES } from '@/data/templates';
import { DEMO_SHOPS, getShopBySlug } from '@/data/shops';
import { saveDraft, getDraftById } from '@/services/storage';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Layers, 
  Palette, 
  FileText, 
  ShoppingBag, 
  Sliders, 
  Eye, 
  Rocket, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import MobileStorefront from '@/components/storefront/MobileStorefront';
import RepairStorefront from '@/components/storefront/RepairStorefront';
import ClothingStorefront from '@/components/storefront/ClothingStorefront';
import CafeStorefront from '@/components/storefront/CafeStorefront';
import JewelleryStorefront from '@/components/storefront/JewelleryStorefront';
import KiranaStorefront from '@/components/storefront/KiranaStorefront';
import GenericStorefront from '@/components/storefront/GenericStorefront';

export default function BuilderWizard() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-300">Loading website builder...</div>}>
      <BuilderContent />
    </Suspense>
  );
}

function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial step: default to 1, or restore from URL
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    const draftIdParam = searchParams.get('draftId');
    if (draftIdParam) {
      const loaded = getDraftById(draftIdParam);
      if (loaded?.step) return loaded.step;
    }
    return 1;
  });
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  // Track draft ID
  const [draftId] = useState<string>(() => {
    const draftIdParam = searchParams.get('draftId');
    return draftIdParam || `draft-${Date.now()}`;
  });

  // Active Shop State
  const [shop, setShop] = useState<Shop>(() => {
    const draftIdParam = searchParams.get('draftId');
    if (draftIdParam) {
      const loaded = getDraftById(draftIdParam);
      if (loaded) return loaded.shopData;
    }
    const shopSlugParam = searchParams.get('shop');
    if (shopSlugParam) {
      const found = getShopBySlug(shopSlugParam);
      if (found) return JSON.parse(JSON.stringify(found));
    }
    const baseShop: Shop = JSON.parse(JSON.stringify(DEMO_SHOPS[0]));
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const matchingCat = CATEGORIES.find((c) => c.id === categoryParam);
      if (matchingCat) {
        baseShop.categorySlug = categoryParam as CategoryId;
        baseShop.category = matchingCat.name;
      }
    }
    const templateParam = searchParams.get('template');
    if (templateParam) {
      const matchingTmpl = TEMPLATES.find((t) => t.id === templateParam);
      if (matchingTmpl) {
        baseShop.templateId = matchingTmpl.id;
        baseShop.templateStyle = matchingTmpl.style;
      }
    }
    return baseShop;
  });

  // Product editing modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  const stepsList = [
    { num: 1, title: 'Category', icon: Layers },
    { num: 2, title: 'Design', icon: Palette },
    { num: 3, title: 'Shop Details', icon: FileText },
    { num: 4, title: 'Products', icon: ShoppingBag },
    { num: 5, title: 'Theme', icon: Sliders },
    { num: 6, title: 'Live Preview', icon: Eye },
    { num: 7, title: 'Publish', icon: Rocket },
  ];

  // Handler to persist draft
  const handleSaveDraft = (markReady = false) => {
    const draft: WebsiteDraft = {
      id: draftId,
      slug: shop.slug || `dukaan-${shop.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      shopData: shop,
      lastUpdated: new Date().toISOString(),
      step: currentStep,
      status: markReady ? 'ready' : 'draft',
      subdomain: `${shop.slug}.netrawebai.in`,
    };
    saveDraft(draft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    if (markReady) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  };

  // Render appropriate live storefront inside preview
  const renderLiveStorefront = () => {
    switch (shop.slug) {
      case 'mahadev-mobile':
        return <MobileStorefront shop={shop} />;
      case 'royal-mobile-repair':
        return <RepairStorefront shop={shop} />;
      case 'rangilo-clothing':
        return <ClothingStorefront shop={shop} />;
      case 'marwad-cafe':
        return <CafeStorefront shop={shop} />;
      case 'mahadev-jewellery':
        return <JewelleryStorefront shop={shop} />;
      case 'lakhmi-kirana':
        return <KiranaStorefront shop={shop} />;
      default:
        if (shop.categorySlug === 'mobile-shops') return <MobileStorefront shop={shop} />;
        if (shop.categorySlug === 'mobile-repair') return <RepairStorefront shop={shop} />;
        if (shop.categorySlug === 'clothing') return <ClothingStorefront shop={shop} />;
        if (shop.categorySlug === 'cafes' || shop.categorySlug === 'restaurants') return <CafeStorefront shop={shop} />;
        if (shop.categorySlug === 'jewellery') return <JewelleryStorefront shop={shop} />;
        if (shop.categorySlug === 'kirana') return <KiranaStorefront shop={shop} />;
        return <GenericStorefront shop={shop} />;
    }
  };

  // Product Add / Update handler
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isNewProduct) {
      setShop((prev) => ({
        ...prev,
        products: [
          ...prev.products,
          { ...editingProduct, id: `p-${Date.now()}` },
        ],
      }));
    } else {
      setShop((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === editingProduct.id ? editingProduct : p
        ),
      }));
    }

    setEditingProduct(null);
    setIsNewProduct(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setShop((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans">
      
      {/* Builder Top Bar */}
      <header className="sticky top-0 z-50 bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base">
                  Netrawebai Website Builder
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                  Step {currentStep}/7
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Customizing: <strong className="text-slate-200">{shop.name}</strong> ({shop.category})
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveDraft(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            <button
              onClick={() => setCurrentStep(6)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-semibold border border-blue-500/40 flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
            >
              Dashboard
            </Link>
          </div>

        </div>

        {/* Step Progress Pills Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {stepsList.map((st) => {
              const Icon = st.icon;
              const isActive = currentStep === st.num;
              const isPast = currentStep > st.num;
              return (
                <button
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : isPast
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-white text-blue-600 font-bold' : isPast ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isPast ? <Check className="w-3 h-3" /> : st.num}
                  </div>
                  <span>{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2 transition-all">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website draft saved to LocalStorage! You can resume editing anytime.</span>
        </div>
      )}

      {/* Main Step Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* ================= STEP 1: BUSINESS TYPE ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Step 1: Choose Your Shop Type</h2>
              <p className="text-xs text-slate-400">
                Select your industry. Netrawebai will preconfigure the ideal layout, product categories, and customer enquiry flow.
              </p>
            </div>

            {/* Search Categories */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories (e.g. mobile, saree, cafe, kirana)..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#121A33] border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()) || c.description.toLowerCase().includes(categorySearch.toLowerCase())).map((cat) => {
                const isSelected = shop.categorySlug === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setShop((prev) => ({
                        ...prev,
                        categorySlug: cat.id,
                        category: cat.name,
                      }));
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between group relative overflow-hidden ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-[#121A33] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 p-1 rounded-full bg-blue-600 text-white">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-blue-400">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-blue-400 font-medium mt-0.5">
                        {cat.hindiName}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{cat.templateCount} Templates</span>
                      <span className="text-blue-400 font-semibold group-hover:underline">Select &rarr;</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step Navigation */}
            <div className="flex justify-end pt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Continue to Choose Design</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CHOOSE DESIGN ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Step 2: Select a Design Style</h2>
              <p className="text-xs text-slate-400">
                Pick a visual style tailored for {shop.category}. You can tweak colors, fonts, and photos in the following steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATES.map((tmpl) => {
                const isSelected = shop.templateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      setShop((prev) => ({
                        ...prev,
                        templateId: tmpl.id,
                        templateStyle: tmpl.style,
                      }));
                    }}
                    className={`cursor-pointer rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500'
                        : 'bg-[#121A33] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="h-44 relative bg-slate-900 overflow-hidden">
                        <img
                          src={tmpl.previewImage}
                          alt={tmpl.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-bold text-violet-300">
                          {tmpl.styleName}
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Selected</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="font-bold text-white text-base">{tmpl.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{tmpl.description}</p>
                        <div className="pt-2 space-y-1">
                          {tmpl.features.slice(0, 2).map((f, i) => (
                            <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 mt-2">
                      <button
                        type="button"
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Current Selection' : 'Select This Design'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                &larr; Back to Categories
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Continue to Shop Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: BUSINESS DETAILS ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Step 3: Shop Information & Contact Details</h2>
              <p className="text-xs text-slate-400">
                These details will appear across your website header, WhatsApp buttons, footer, and Google Maps links.
              </p>
            </div>

            <div className="bg-[#121A33] rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    value={shop.name}
                    onChange={(e) => setShop({ ...shop, name: e.target.value })}
                    placeholder="e.g. Mahadev Mobile"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={shop.tagline}
                    onChange={(e) => setShop({ ...shop, tagline: e.target.value })}
                    placeholder="e.g. Latest 5G Phones & Best Deals"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Shop About / Business Story
                </label>
                <textarea
                  rows={3}
                  value={shop.description}
                  onChange={(e) => setShop({ ...shop, description: e.target.value })}
                  placeholder="Tell your customers what makes your shop special..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-blue-400 mb-4">Contact & Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      WhatsApp Number (with Country Code) *
                    </label>
                    <input
                      type="text"
                      value={shop.contact.whatsapp}
                      onChange={(e) => setShop({
                        ...shop,
                        contact: { ...shop.contact, whatsapp: e.target.value.replace(/[^0-9]/g, '') }
                      })}
                      placeholder="e.g. 919829012345"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Include &apos;91&apos; for India without plus sign
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Calling Phone Number
                    </label>
                    <input
                      type="text"
                      value={shop.contact.phone}
                      onChange={(e) => setShop({
                        ...shop,
                        contact: { ...shop.contact, phone: e.target.value }
                      })}
                      placeholder="e.g. +91 98290 12345"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={shop.contact.openingHours}
                      onChange={(e) => setShop({
                        ...shop,
                        contact: { ...shop.contact, openingHours: e.target.value }
                      })}
                      placeholder="e.g. 10:00 AM - 09:30 PM (Mon - Sun)"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Physical Shop Address
                    </label>
                    <input
                      type="text"
                      value={shop.contact.address}
                      onChange={(e) => setShop({
                        ...shop,
                        contact: { ...shop.contact, address: e.target.value }
                      })}
                      placeholder="e.g. Shop No. 14, Nai Sarak, Near Ghanta Ghar"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={shop.contact.city}
                      onChange={(e) => setShop({
                        ...shop,
                        contact: { ...shop.contact, city: e.target.value }
                      })}
                      placeholder="e.g. Jodhpur"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Headlines */}
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-blue-400 mb-4">Hero Banner Messaging</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Website Main Headline
                    </label>
                    <input
                      type="text"
                      value={shop.heroHeadline}
                      onChange={(e) => setShop({ ...shop, heroHeadline: e.target.value })}
                      placeholder="e.g. Experience the Next Gen 5G Revolution at Local Prices"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Hero Subheadline
                    </label>
                    <input
                      type="text"
                      value={shop.heroSubheadline}
                      onChange={(e) => setShop({ ...shop, heroSubheadline: e.target.value })}
                      placeholder="e.g. 100% Genuine Branded Smartphones with Official Warranty"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                &larr; Back to Design
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Continue to Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: PRODUCTS OR SERVICES ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Step 4: Manage Products & Catalogue</h2>
                <p className="text-xs text-slate-400">
                  Add items to showcase on your digital storefront. Customers can order or enquire with one click.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    id: `p-new-${Date.now()}`,
                    name: '',
                    category: shop.category,
                    price: 999,
                    description: '',
                    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
                    inStock: true,
                    badge: 'New Arrival',
                  });
                  setIsNewProduct(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 shrink-0 self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            {/* Products Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shop.products.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#121A33] rounded-2xl border border-slate-800 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                          {p.category}
                        </span>
                        <span className="text-xs font-black text-emerald-400">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate mt-0.5">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{p.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsNewProduct(false);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs flex items-center gap-1 border border-rose-800/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Edit / Add Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <form
                  onSubmit={handleSaveProduct}
                  className="bg-[#121A33] border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">
                      {isNewProduct ? 'Add New Product' : 'Edit Product'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. OnePlus 12 5G"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Original MRP (₹)</label>
                      <input
                        type="number"
                        value={editingProduct.originalPrice || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) || undefined })}
                        placeholder="Optional"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category / Brand</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="Product features, warranty, or weight..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                    >
                      Save Item
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                &larr; Back to Shop Details
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Continue to Theme Customizer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: CUSTOMIZATION ================= */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Step 5: Visual Theme & Styling Customizer</h2>
              <p className="text-xs text-slate-400">
                Choose accent colors, typography presets, button shapes, and banner layout.
              </p>
            </div>

            <div className="bg-[#121A33] rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
              
              {/* Accent Color Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Brand Accent Color
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { name: 'Electric Blue', hex: '#2563EB' },
                    { name: 'Emerald Green', hex: '#10B981' },
                    { name: 'Royal Gold', hex: '#EAB308' },
                    { name: 'Rose Red', hex: '#E11D48' },
                    { name: 'Violet Velvet', hex: '#8B5CF6' },
                    { name: 'Warm Amber', hex: '#D97706' },
                    { name: 'Teal Cyan', hex: '#06B6D4' },
                  ].map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setShop({
                        ...shop,
                        theme: { ...shop.theme, accentColor: color.hex }
                      })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        shop.theme.accentColor === color.hex
                          ? 'border-white bg-slate-800 text-white shadow-md'
                          : 'border-slate-700 bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Preset */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Typography Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: 'Outfit', label: 'Outfit (Modern Tech)' },
                    { id: 'Inter', label: 'Inter (Clean Neutral)' },
                    { id: 'Playfair', label: 'Playfair (Boutique Serif)' },
                    { id: 'Cinzel', label: 'Cinzel (Royal Luxury)' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setShop({
                        ...shop,
                        theme: { ...shop.theme, fontFamily: font.id as 'Outfit' | 'Inter' | 'Playfair' | 'Cinzel' }
                      })}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        shop.theme.fontFamily === font.id
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Shape Style */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Button Corner Style
                </label>
                <div className="flex gap-4">
                  {[
                    { id: 'rounded', label: 'Modern Rounded' },
                    { id: 'pill', label: 'Full Pill' },
                    { id: 'square', label: 'Sharp Elegant' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setShop({
                        ...shop,
                        theme: { ...shop.theme, buttonStyle: btn.id as 'rounded' | 'pill' | 'square' }
                      })}
                      className={`px-4 py-2 text-xs font-bold border transition-all ${
                        btn.id === 'pill' ? 'rounded-full' : btn.id === 'square' ? 'rounded-none' : 'rounded-xl'
                      } ${
                        shop.theme.buttonStyle === btn.id
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                &larr; Back to Products
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Continue to Live Preview</span>
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 6: LIVE PREVIEW ================= */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Step 6: Live Interactive Storefront Preview</h2>
                <p className="text-xs text-slate-400">
                  Test your actual storefront layout, WhatsApp buttons, and product catalog on desktop, tablet, and mobile.
                </p>
              </div>

              {/* Device Selector */}
              <div className="flex items-center gap-1.5 bg-[#121A33] p-1.5 rounded-xl border border-slate-700 self-start sm:self-auto">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    previewDevice === 'desktop' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    previewDevice === 'tablet' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    previewDevice === 'mobile' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Preview Frame Container */}
            <div className="flex justify-center bg-slate-950/80 p-4 rounded-3xl border border-slate-800 min-h-[600px] overflow-hidden">
              <div className={`transition-all duration-300 w-full bg-[#0B132B] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${
                previewDevice === 'mobile'
                  ? 'max-w-[390px] border-4 border-slate-700 rounded-[40px] p-2 min-h-[750px] max-h-[780px] overflow-y-auto'
                  : previewDevice === 'tablet'
                  ? 'max-w-[768px] border-2 border-slate-700 rounded-2xl overflow-y-auto max-h-[750px]'
                  : 'max-w-full overflow-y-auto max-h-[750px]'
              }`}>
                {renderLiveStorefront()}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                &larr; Back to Theme
              </button>
              <button
                onClick={() => setCurrentStep(7)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Continue to Save & Publish</span>
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 7: SAVE AND PUBLISH ================= */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Step 7: Save Draft & Publish Website</h2>
              <p className="text-xs text-slate-400">
                Your shop website is ready. Save it to your local workspace or inspect simulated deployment links.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Status Card & Actions */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-[#121A33] rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Website Configuration Complete</h3>
                      <p className="text-xs text-emerald-400 font-medium">Ready for Local Preview & Draft Persistence</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Shop Name:</span>
                      <strong className="text-white">{shop.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <span className="text-blue-400 font-semibold">{shop.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Products Configured:</span>
                      <span>{shop.products.length} Products</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">WhatsApp Link:</span>
                      <span className="text-emerald-400 font-mono">+{shop.contact.whatsapp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Simulated Subdomain:</span>
                      <span className="text-sky-400 font-mono">{shop.slug}.netrawebai.in</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleSaveDraft(true)}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Draft to LocalStorage</span>
                    </button>

                    <Link
                      href={`/shop/${shop.slug}`}
                      className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <span>Open Full Storefront</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Honest Publishing Roadmap Notice */}
                <div className="bg-amber-950/20 border border-amber-600/30 rounded-2xl p-5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Transparent Publishing Roadmap</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    In demo mode, all changes and drafts persist in your browser LocalStorage. For true public publishing to a custom domain (e.g. <em>mahadevmobile.com</em> or <em>.in</em>), a live hosting provider and domain registrar connection will be configured in the next phase.
                  </p>
                </div>

              </div>

              {/* Right Column: Export JSON & Next Steps */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-[#121A33] rounded-2xl p-6 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white">Export & Backup</h4>
                  <p className="text-xs text-slate-400">
                    Copy the complete structured JSON payload of your shop to export or share with technical staff.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(JSON.stringify(shop, null, 2));
                          setCopiedJson(true);
                          setTimeout(() => setCopiedJson(false), 2000);
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedJson ? 'JSON Copied!' : 'Copy Config JSON'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#121A33] rounded-2xl p-6 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white">What Next?</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Manage website in your <Link href="/dashboard" className="text-blue-400 underline">Dashboard</Link></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Test WhatsApp ordering on smartphone</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Explore other category templates</span>
                    </li>
                  </ul>

                  <Link
                    href="/dashboard"
                    className="block text-center w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
                  >
                    Go to Owner Dashboard &rarr;
                  </Link>
                </div>

              </div>

            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(6)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                &larr; Back to Live Preview
              </button>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
