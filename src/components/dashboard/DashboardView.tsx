'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { WebsiteDraft } from '@/types';
import { getSavedDrafts, deleteDraft, createNewDraftFromShop } from '@/services/storage';
import { DEMO_SHOPS } from '@/data/shops';
import { 
  LayoutDashboard, 
  Store, 
  Sparkles, 
  Plus, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  ShoppingBag, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  HelpCircle, 
  AlertCircle,
  Rocket,
  Search,
  Globe
} from 'lucide-react';

export default function DashboardView() {
  const [drafts, setDrafts] = useState<WebsiteDraft[]>(() => {
    if (typeof window === 'undefined') return [];
    return getSavedDrafts();
  });
  const [activeTab, setActiveTab] = useState<'websites' | 'products' | 'publish' | 'help'>('websites');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteDraft(id);
    setDrafts(getSavedDrafts());
    setConfirmDeleteId(null);
  };

  const handleDuplicate = (baseDraft: WebsiteDraft) => {
    createNewDraftFromShop({
      ...baseDraft.shopData,
      name: `${baseDraft.shopData.name} (Copy)`,
      slug: `${baseDraft.slug}-copy`,
    });
    setDrafts(getSavedDrafts());
  };

  const filteredDrafts = drafts.filter((d) =>
    d.shopData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.shopData.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md shadow-amber-500/20 border border-amber-500/30 bg-[#0F172A] shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Netrawebai Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Shop Owner Dashboard
                  </h1>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                    Demo Mode
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your shop websites, review visitor inquiry links, and edit product catalogs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/builder"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Website</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121A33] rounded-2xl p-5 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-medium">My Websites</div>
              <div className="text-2xl font-black text-white">{drafts.length}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">Active in browser storage</div>
            </div>

            <div className="bg-[#121A33] rounded-2xl p-5 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Total Products</div>
              <div className="text-2xl font-black text-white">
                {drafts.reduce((sum, d) => sum + d.shopData.products.length, 0)}
              </div>
              <div className="text-[10px] text-blue-400 font-semibold">Catalogued items</div>
            </div>

            <div className="bg-[#121A33] rounded-2xl p-5 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-medium">WhatsApp Orders</div>
              <div className="text-2xl font-black text-emerald-400">100% Direct</div>
              <div className="text-[10px] text-slate-400">Direct to your phone</div>
            </div>

            <div className="bg-[#121A33] rounded-2xl p-5 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Publishing Status</div>
              <div className="text-2xl font-black text-sky-400">Simulated</div>
              <div className="text-[10px] text-slate-400">Instant local preview</div>
            </div>
          </div>

          {/* Dashboard Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'websites', label: 'My Websites & Drafts', icon: Store },
              { id: 'products', label: 'All Catalogue Items', icon: ShoppingBag },
              { id: 'publish', label: 'Publishing Roadmap', icon: Rocket },
              { id: 'help', label: 'Help & Support', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-blue-500 text-white bg-blue-600/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: WEBSITES & DRAFTS */}
          {activeTab === 'websites' && (
            <div className="space-y-6">
              
              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search my websites..."
                    className="w-full pl-9 pr-3 py-2 bg-[#121A33] border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="text-xs text-slate-400">
                  Showing {filteredDrafts.length} website{filteredDrafts.length === 1 ? '' : 's'}
                </div>
              </div>

              {/* Websites Grid */}
              {filteredDrafts.length === 0 ? (
                <div className="bg-[#121A33] rounded-2xl p-12 text-center border border-slate-800 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">No websites found</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm ? 'Try a different search term or clear the filter.' : 'You haven’t created any custom websites yet.'}
                    </p>
                  </div>
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Website</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDrafts.map((draft) => {
                    const shop = draft.shopData;
                    return (
                      <div
                        key={draft.id}
                        className="bg-[#121A33] rounded-2xl border border-slate-800 hover:border-slate-700 overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Banner Preview */}
                          <div className="h-40 relative bg-slate-900 overflow-hidden">
                            <img
                              src={shop.bannerImage}
                              alt={shop.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121A33] via-transparent to-transparent" />
                            <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/80 text-blue-400 text-[10px] font-bold border border-slate-800">
                              {shop.category}
                            </div>
                            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                              {draft.status === 'ready' ? 'Ready to Deploy' : 'Draft Saved'}
                            </div>
                          </div>

                          {/* Body */}
                          <div className="p-5 space-y-3">
                            <div>
                              <h3 className="text-lg font-bold text-white truncate">{shop.name}</h3>
                              <p className="text-[11px] text-blue-400 font-medium truncate">{shop.tagline}</p>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Updated: {new Date(draft.lastUpdated).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>{shop.products.length} Products Configured</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-emerald-400">
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp: +{shop.contact.whatsapp}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-5 pt-0 border-t border-slate-800/80 mt-4 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/builder?draftId=${draft.id}`}
                              className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Website</span>
                            </Link>

                            <Link
                              href={`/shop/${draft.slug}`}
                              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                            >
                              <span>View Live</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <button
                              onClick={() => handleDuplicate(draft)}
                              className="text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Duplicate</span>
                            </button>

                            <button
                              onClick={() => setConfirmDeleteId(draft.id)}
                              className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Confirm Delete Modal */}
              {confirmDeleteId && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-[#121A33] border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4">
                    <h4 className="font-bold text-white text-base">Delete this website draft?</h4>
                    <p className="text-xs text-slate-400">
                      This will remove the saved website from your browser storage. This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(confirmDeleteId)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
                      >
                        Delete Draft
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Aggregated Products Across All Drafts</h3>
                <p className="text-xs text-slate-400">All items currently configured in your digital storefronts.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.flatMap((d) => d.shopData.products).map((product, idx) => (
                  <div key={idx} className="bg-[#121A33] rounded-2xl p-4 border border-slate-800 flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] text-blue-400 font-bold uppercase">{product.category}</div>
                      <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                      <div className="text-xs font-black text-emerald-400 mt-0.5">₹{product.price.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PUBLISHING STATUS */}
          {activeTab === 'publish' && (
            <div className="bg-[#121A33] rounded-3xl p-8 border border-slate-800 space-y-6 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Publishing & Domain Architecture</h3>
                  <p className="text-xs text-slate-400">From Localhost Drafts to Pan-India Public Discovery</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Phase 1: Local Browser Persistence (Active)</span>
                  </div>
                  <p className="text-slate-400">
                    Your drafts and custom business details are safely persisted in your browser’s LocalStorage. You can preview, edit, and test WhatsApp flows anytime.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span>Phase 2: Subdomain Publishing (Next)</span>
                  </div>
                  <p className="text-slate-400">
                    Publish to a public Netrawebai subdomain (e.g. <code>mahadev-mobile.netrawebai.in</code>) with automated SSL certificate and CDN edge routing.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Phase 3: Custom Domains (.in / .com)</span>
                  </div>
                  <p className="text-slate-400">
                    Connect your own domain name (e.g. <code>rangilostore.in</code>) with DNS records and custom business email support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HELP & SUPPORT */}
          {activeTab === 'help' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#121A33] rounded-3xl p-8 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white">Dedicated WhatsApp Onboarding Desk</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Stuck with setting up your catalogue or want a customized logo designed for your physical shop? Our onboarding team in Rajasthan is here to assist every local shop owner.
                </p>
                <a
                  href="https://wa.me/919829012345?text=Hello%20Netrawebai%2C%20I%20need%20help%20setting%20up%20my%20website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5C] text-white font-bold text-xs shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 98290 12345)</span>
                </a>
              </div>

              <div className="bg-[#121A33] rounded-3xl p-8 border border-slate-800 space-y-3 text-xs">
                <h3 className="text-lg font-bold text-white">Frequently Asked Questions</h3>
                <div className="space-y-2 text-slate-300">
                  <p className="font-semibold text-white">Q: Do I need a credit card or GST number to start?</p>
                  <p className="text-slate-400">A: No! You can design and test your full website without any payment or GST requirements.</p>
                  <p className="font-semibold text-white pt-2">Q: How do customers order?</p>
                  <p className="text-slate-400">A: Customers tap &ldquo;Enquire on WhatsApp&rdquo;, and their desired product details are pre-filled in their WhatsApp message to your phone.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
