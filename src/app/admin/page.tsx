'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Store, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Search, 
  Filter, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  ExternalLink, 
  Send, 
  Eye, 
  Edit3, 
  ChevronRight, 
  FileText, 
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Enquiry, EnquiryStatus } from '@/server/db/types';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Data State
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Edit Quote State
  const [editQuotedAmount, setEditQuotedAmount] = useState<string>('');
  const [editQuoteScope, setEditQuoteScope] = useState<string>('');
  const [editQuoteExclusions, setEditQuoteExclusions] = useState<string>('');
  const [editQuoteTerms, setEditQuoteTerms] = useState<string>('');
  const [editStatus, setEditStatus] = useState<EnquiryStatus>('pending');
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchEnquiries();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setIsAuthenticated(true);
      fetchEnquiries();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setIsAuthenticated(false);
    setSelectedEnquiry(null);
  };

  const fetchEnquiries = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const json = await res.json();
        setEnquiries(json.enquiries || []);
      }
    } catch (e) {
      console.error('Failed to load enquiries', e);
    } finally {
      setLoadingData(false);
    }
  };

  const openEnquiryDrawer = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setEditQuotedAmount(enq.quotedAmount ? String(enq.quotedAmount) : '1499');
    setEditQuoteScope(enq.quoteScope || '');
    setEditQuoteExclusions(enq.quoteExclusions || '');
    setEditQuoteTerms(enq.quoteTerms || 'Standard 1-year hosting with 3-day turnaround upon payment.');
    setEditStatus(enq.status);
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSaveQuote = async () => {
    if (!selectedEnquiry) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          quotedAmount: Number(editQuotedAmount) || 0,
          quoteScope: editQuoteScope,
          quoteExclusions: editQuoteExclusions,
          quoteTerms: editQuoteTerms,
          notifyCustomer,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to update quote');
      }

      setSaveSuccess(true);
      setSelectedEnquiry(json.enquiry);
      // Refresh list
      await fetchEnquiries();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating enquiry';
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered list
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.enquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'paid') return enq.paymentStatus === 'paid';
    if (statusFilter === 'pending') return enq.status === 'pending' || enq.status === 'in_review';
    if (statusFilter === 'quoted') return enq.status === 'quoted' || enq.status === 'quote_accepted';
    return enq.status === statusFilter;
  });

  // Analytics Metrics
  const totalEnquiries = enquiries.length;
  const pendingCount = enquiries.filter((e) => e.status === 'pending' || e.status === 'in_review').length;
  const quotedCount = enquiries.filter((e) => e.status === 'quoted' || e.status === 'quote_accepted').length;
  const paidCount = enquiries.filter((e) => e.paymentStatus === 'paid').length;
  const totalRevenue = enquiries.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="max-w-md mx-auto my-16 bg-[#1C2541]/90 rounded-3xl p-8 sm:p-10 border border-slate-700/60 shadow-2xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-600/30">
              <Lock className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-extrabold text-white text-center">
              Netrawebai Owner Portal
            </h1>
            <p className="mt-2 text-xs text-slate-400 text-center leading-relaxed">
              Secure administrative access for managing customer website orders, issuing quotes, and monitoring payment settlements.
            </p>

            {authError && (
              <div className="mt-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Owner Security Password
                </label>
                <input
                  type="password"
                  placeholder="Enter administrator password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Default test passphrase: <code className="text-slate-400">admin_netrawebai_2026</code>
                </span>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Access Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-8">
            {/* Top Bar with Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active Session
                  </span>
                  <span className="text-xs text-slate-400">Netrawebai Rajasthan Operations</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Enquiry & Order Management
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchEnquiries}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Refresh Enquiries"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-[#1C2541]/70 rounded-2xl p-4 border border-slate-700/60 shadow-lg">
                <span className="text-xs text-slate-400">Total Enquiries</span>
                <div className="text-2xl font-black text-white mt-1">{totalEnquiries}</div>
                <span className="text-[10px] text-blue-400 font-medium">All customer requests</span>
              </div>

              <div className="bg-[#1C2541]/70 rounded-2xl p-4 border border-amber-500/20 shadow-lg">
                <span className="text-xs text-amber-400">Pending Review</span>
                <div className="text-2xl font-black text-amber-300 mt-1">{pendingCount}</div>
                <span className="text-[10px] text-slate-400 font-medium">Awaiting team review</span>
              </div>

              <div className="bg-[#1C2541]/70 rounded-2xl p-4 border border-blue-500/20 shadow-lg">
                <span className="text-xs text-blue-400">Quoted / Accepted</span>
                <div className="text-2xl font-black text-blue-300 mt-1">{quotedCount}</div>
                <span className="text-[10px] text-slate-400 font-medium">Quotes in customer hands</span>
              </div>

              <div className="bg-[#1C2541]/70 rounded-2xl p-4 border border-emerald-500/20 shadow-lg">
                <span className="text-xs text-emerald-400">Paid Orders</span>
                <div className="text-2xl font-black text-emerald-300 mt-1">{paidCount}</div>
                <span className="text-[10px] text-emerald-400/80 font-medium">Ready for deployment</span>
              </div>

              <div className="bg-[#1C2541]/70 rounded-2xl p-4 border border-indigo-500/20 shadow-lg col-span-2 sm:col-span-1">
                <span className="text-xs text-indigo-300">Revenue Collected</span>
                <div className="text-2xl font-black text-white mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-indigo-400 font-medium">Razorpay settled</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by shop, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C2541]/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                {['all', 'pending', 'quoted', 'paid'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                      statusFilter === tab
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Enquiries Table / Cards */}
            <div className="bg-[#1C2541]/80 rounded-3xl border border-slate-700/60 shadow-xl overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-700/60 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Enquiry No.</th>
                      <th className="py-3.5 px-4 font-bold">Shop & Customer</th>
                      <th className="py-3.5 px-4 font-bold">Category</th>
                      <th className="py-3.5 px-4 font-bold">Plan</th>
                      <th className="py-3.5 px-4 font-bold">Quoted Price</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold">Payment</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                          No customer enquiries matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((enq) => (
                        <tr 
                          key={enq.id}
                          className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                          onClick={() => openEnquiryDrawer(enq)}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                            {enq.enquiryNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white block">{enq.businessName}</span>
                            <span className="text-[11px] text-slate-400">{enq.customerName} • {enq.phone}</span>
                          </td>
                          <td className="py-3.5 px-4 capitalize text-slate-300">
                            {enq.category.replace('-', ' ')}
                          </td>
                          <td className="py-3.5 px-4 capitalize font-medium text-slate-200">
                            {enq.packageType}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            {enq.quotedAmount ? `₹${enq.quotedAmount.toLocaleString('en-IN')}` : (
                              <span className="text-slate-500 font-normal">Not Set</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              enq.status === 'in_progress'
                                ? 'bg-purple-950/60 text-purple-300 border border-purple-500/20'
                                : enq.status === 'quote_accepted'
                                ? 'bg-blue-950/60 text-blue-300 border border-blue-500/20'
                                : enq.status === 'quoted'
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/20'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {enq.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              enq.paymentStatus === 'paid'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20'
                                : 'bg-rose-950/40 text-rose-300 border border-rose-500/20'
                            }`}>
                              {enq.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEnquiryDrawer(enq);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors font-medium text-xs inline-flex items-center gap-1"
                            >
                              <span>Manage</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Enquiry Manage Drawer / Modal */}
            {selectedEnquiry && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <div className="bg-[#1C2541] rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-blue-500/30 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#1C2541] z-10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-400 text-sm">
                          {selectedEnquiry.enquiryNumber}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-white">
                          {selectedEnquiry.businessName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Requested by {selectedEnquiry.customerName} on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="text-slate-400 hover:text-white text-base p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {saveSuccess && (
                    <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Quote and project status updated successfully! Customer notified if selected.</span>
                    </div>
                  )}

                  {saveError && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{saveError}</span>
                    </div>
                  )}

                  {/* Customer Direct Contact Quick Actions */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-blue-400" />
                        <span>{selectedEnquiry.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{selectedEnquiry.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${selectedEnquiry.whatsapp}?text=${encodeURIComponent(`Hello ${selectedEnquiry.customerName}, this is Netrawebai team regarding your website enquiry ${selectedEnquiry.enquiryNumber} for ${selectedEnquiry.businessName}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/50 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Customer</span>
                      </a>

                      <Link
                        href={`/quote/${selectedEnquiry.id}?token=${selectedEnquiry.accessToken}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/30 hover:bg-blue-600/50 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Customer View</span>
                      </Link>
                    </div>
                  </div>

                  {/* Requirement Details */}
                  <div className="mt-5 space-y-3 text-xs">
                    <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-400">
                      Customer Project Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300">
                      <div>
                        <span className="text-slate-500 block">Category:</span>
                        <span className="font-semibold text-white capitalize">{selectedEnquiry.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Visual Template:</span>
                        <span className="font-semibold text-white">{selectedEnquiry.preferredTemplate || 'Standard'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Budget:</span>
                        <span className="text-white">{selectedEnquiry.budgetRange || 'Standard package'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Target Timeline:</span>
                        <span className="text-white">{selectedEnquiry.targetDate || '2-3 days'}</span>
                      </div>
                      {selectedEnquiry.domainNeeded && (
                        <div className="col-span-2">
                          <span className="text-slate-500 block">Domain Requested:</span>
                          <span className="text-blue-400 font-semibold">{selectedEnquiry.domainName || 'Custom domain needed'}</span>
                        </div>
                      )}
                      {selectedEnquiry.productsServices && (
                        <div className="col-span-2">
                          <span className="text-slate-500 block">Catalog / Products:</span>
                          <span className="text-slate-300">{selectedEnquiry.productsServices}</span>
                        </div>
                      )}
                      {selectedEnquiry.preferredColors && (
                        <div className="col-span-2">
                          <span className="text-slate-500 block">Color Palette:</span>
                          <span className="text-slate-300">{selectedEnquiry.preferredColors}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Storefront Design Preview Link */}
                  <div className="mt-4 p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      Selected Category Blueprint: <strong className="text-white capitalize">{selectedEnquiry.category}</strong>
                    </span>
                    <Link
                      href={`/categories/${selectedEnquiry.category}`}
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <span>Preview Demo Storefront</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Prepare / Revise Quote Form */}
                  <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
                    <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Prepare / Revise Official Quote</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Quoted Amount (INR ₹)
                        </label>
                        <input
                          type="number"
                          value={editQuotedAmount}
                          onChange={(e) => setEditQuotedAmount(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Enquiry Status
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as EnquiryStatus)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_review">In Review</option>
                          <option value="quoted">Quoted</option>
                          <option value="quote_accepted">Quote Accepted</option>
                          <option value="in_progress">In Progress (Website Building)</option>
                          <option value="completed">Completed / Live</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Deliverables Scope
                      </label>
                      <textarea
                        rows={3}
                        value={editQuoteScope}
                        onChange={(e) => setEditQuoteScope(e.target.value)}
                        placeholder="1. Custom mobile storefront with brand styling... 2. WhatsApp ordering... 3. 1-year cloud hosting..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Scope Exclusions
                      </label>
                      <input
                        type="text"
                        value={editQuoteExclusions}
                        onChange={(e) => setEditQuoteExclusions(e.target.value)}
                        placeholder="e.g. Paid search advertisements, physical photography equipment"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Payment & Hosting Terms
                      </label>
                      <input
                        type="text"
                        value={editQuoteTerms}
                        onChange={(e) => setEditQuoteTerms(e.target.value)}
                        placeholder="Standard 1-year hosting with 3-day turnaround upon payment."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="notifyCustomer"
                        checked={notifyCustomer}
                        onChange={(e) => setNotifyCustomer(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                      />
                      <label htmlFor="notifyCustomer" className="text-xs text-slate-300 cursor-pointer">
                        Dispatch email notification to customer with direct quote review link
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => setSelectedEnquiry(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Close
                      </button>

                      <button
                        onClick={handleSaveQuote}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Save & Update Quote</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
