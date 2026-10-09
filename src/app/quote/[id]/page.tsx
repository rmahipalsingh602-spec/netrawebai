'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import confetti from 'canvas-confetti';
import { 
  Store, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  FileText, 
  Download, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Check,
  Lock
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function QuoteDetailInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Quote acceptance & payment state
  const [isAcceptingQuote, setIsAcceptingQuote] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [simulatedOrderPayload, setSimulatedOrderPayload] = useState<any>(null);

  const publicWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919829012345';

  const fetchEnquiry = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/enquiries/${id}?token=${token || ''}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to load enquiry.');
      }

      setData(json);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading quote';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [id, token]);

  // Load Razorpay Checkout Script dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Action: Accept Custom Quote
  const handleAcceptQuote = async () => {
    setIsAcceptingQuote(true);
    setPaymentError(null);

    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept_quote',
          token,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Could not accept quote.');
      }

      await fetchEnquiry();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error accepting quote';
      setPaymentError(msg);
    } finally {
      setIsAcceptingQuote(false);
    }
  };

  // Action: Initiate Razorpay Checkout
  const handlePayNow = async () => {
    setIsInitiatingPayment(true);
    setPaymentError(null);

    try {
      // 1. Create Order on Server
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryId: id,
          token,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to initiate payment.');
      }

      // If in simulation mode or real Razorpay SDK is not configured, show test checkout simulation
      if (orderData.simulated || !window.Razorpay) {
        setSimulatedOrderPayload(orderData);
        setShowSimulatedModal(true);
        setIsInitiatingPayment(false);
        return;
      }

      // 2. Open Real / Test Mode Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amountInPaise,
        currency: orderData.currency,
        name: 'Netrawebai Technologies',
        description: `Website Order: ${orderData.enquiryNumber}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: orderData.customerName,
          email: orderData.email,
          contact: orderData.phone,
        },
        theme: {
          color: '#2563EB',
        },
        handler: async function (response: any) {
          await verifyPaymentOnServer({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            enquiryId: id,
          });
        },
        modal: {
          ondismiss: function () {
            setIsInitiatingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setPaymentError(resp.error?.description || 'Payment was cancelled or failed.');
        setIsInitiatingPayment(false);
      });
      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment initiation failed';
      setPaymentError(msg);
      setIsInitiatingPayment(false);
    }
  };

  // Action: Complete Payment Verification on Server
  const verifyPaymentOnServer = async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    enquiryId: string;
  }) => {
    setIsInitiatingPayment(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const verifyData = await res.json();
      if (!res.ok) {
        throw new Error(verifyData.error || 'Server payment verification failed.');
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      setShowSimulatedModal(false);
      await fetchEnquiry();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setPaymentError(msg);
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  // Simulated Test Sandbox payment handler
  const handleSimulatedPaymentSuccess = async () => {
    if (!simulatedOrderPayload) return;

    const dummyPaymentId = `pay_test_${Math.random().toString(36).substring(2, 10)}`;
    const dummySignature = `sig_test_${Math.random().toString(36).substring(2, 10)}`;

    await verifyPaymentOnServer({
      razorpay_order_id: simulatedOrderPayload.razorpayOrderId,
      razorpay_payment_id: dummyPaymentId,
      razorpay_signature: dummySignature,
      enquiryId: id,
    });
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm">Fetching project details and quote securely...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#1C2541]/90 rounded-3xl p-8 border border-rose-500/30 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          {error || 'Valid access token required to view this project.'}
        </p>
        <p className="text-[11px] text-slate-400 mb-6">
          For your privacy, quotes and orders are protected by a unique cryptographic token. Please click the direct link sent to your email or WhatsApp.
        </p>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
        >
          <span>Submit a New Enquiry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const { enquiry } = data;
  const isPaid = enquiry.paymentStatus === 'paid';
  const isQuoted = enquiry.status === 'quoted';
  const isQuoteAccepted = enquiry.status === 'quote_accepted';
  const isPending = enquiry.status === 'pending' || enquiry.status === 'in_review';

  const payableAmount = enquiry.paidAmount || enquiry.quotedAmount || 1499;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-white flex items-center gap-1">
          <Store className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <div className="flex items-center gap-2 font-mono">
          <span>Project ID:</span>
          <span className="text-blue-400 font-bold">{enquiry.enquiryNumber}</span>
        </div>
      </div>

      {/* Main Status Header Card */}
      <div className="bg-[#1C2541]/80 rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl backdrop-blur-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md shadow-amber-500/20 border border-amber-500/30 bg-[#0F172A] shrink-0">
              <img
                src="/images/logo.png"
                alt="Netrawebai Logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {enquiry.packageType.toUpperCase()} DUKAAN
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  isPaid 
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : isQuoteAccepted
                    ? 'bg-blue-950/60 text-blue-300 border-blue-500/30'
                    : isQuoted
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {isPaid ? 'Payment Confirmed & In Progress' : isQuoteAccepted ? 'Quote Accepted — Ready for Payment' : isQuoted ? 'Quote Ready for Review' : 'Under Engineering Review'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {enquiry.businessName}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Customer: <span className="text-slate-200 font-medium">{enquiry.customerName}</span> • Requested on {new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Total Investment</span>
            <div className="text-3xl font-black text-white flex items-baseline sm:justify-end gap-1">
              <span>₹{payableAmount.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400 font-normal">INR</span>
            </div>
            {isPaid ? (
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center sm:justify-end gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Paid via Razorpay</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">All taxes & 1-year hosting included</span>
            )}
          </div>
        </div>

        {/* Paid Confirmation Banner */}
        {isPaid && (
          <div className="mt-6 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Order Confirmed & Payment Verified!</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Razorpay Payment ID: <code className="text-emerald-300 font-mono">{enquiry.razorpayPaymentId}</code>
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${publicWhatsApp}?text=${encodeURIComponent(`Hello Netrawebai, I have completed payment for my website *${enquiry.businessName}* (ID: ${enquiry.enquiryNumber}). Looking forward to the draft link!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect With Developer</span>
            </a>
          </div>
        )}

        {/* Error notification */}
        {paymentError && (
          <div className="mt-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{paymentError}</span>
          </div>
        )}
      </div>

      {/* Two Column Layout: Deliverables & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Quote Details & Project Scope */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Scope of Work */}
          <div className="bg-[#1C2541]/70 rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Included Website Deliverables</span>
            </h2>

            {enquiry.quoteScope ? (
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                {enquiry.quoteScope}
              </div>
            ) : (
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Mobile-First Website Design ({enquiry.preferredTemplate || 'Dark Obsidian Theme'})</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive WhatsApp Product Basket Ordering</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Google Maps Location, Contact Cards & Store Opening Hours</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free High-Speed Cloud Hosting for 1 Year</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subdomain on netrawebai.in + Custom Domain DNS Setup</span>
                </li>
              </ul>
            )}

            {/* Exclusions & Terms */}
            {enquiry.quoteExclusions && (
              <div className="mt-5 pt-5 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Scope Exclusions:</h4>
                <p className="text-xs text-slate-400 italic whitespace-pre-line">{enquiry.quoteExclusions}</p>
              </div>
            )}

            {enquiry.quoteTerms && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 mb-1">Payment & Delivery Terms:</h4>
                <p className="text-xs text-slate-300">{enquiry.quoteTerms}</p>
              </div>
            )}
          </div>

          {/* Customer Requirements Summary */}
          <div className="bg-[#1C2541]/70 rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Project Requirements Breakdown</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Business Category</span>
                <span className="font-semibold text-white capitalize">{enquiry.category.replace('-', ' ')}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Target Completion</span>
                <span className="font-semibold text-white">{enquiry.targetDate || '2-3 days'}</span>
              </div>

              {enquiry.domainNeeded && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 sm:col-span-2">
                  <span className="text-slate-400 block mb-1">Domain Name Request</span>
                  <span className="font-semibold text-blue-400">{enquiry.domainName || 'Included in package'}</span>
                </div>
              )}

              {enquiry.productsServices && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 sm:col-span-2">
                  <span className="text-slate-400 block mb-1">Products / Catalog Items</span>
                  <span className="text-slate-300 leading-relaxed">{enquiry.productsServices}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Quote Acceptance & Payment Actions */}
        <div className="space-y-6">
          <div className="bg-[#1C2541]/90 rounded-3xl p-6 border border-slate-700/60 shadow-xl backdrop-blur-md sticky top-24">
            <h3 className="text-sm font-bold text-white mb-3">Order Status & Checkout</h3>

            {/* State 1: Paid */}
            {isPaid ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-white block">Payment Fully Verified</span>
                  <span className="text-[11px] text-slate-300 mt-1 block">
                    Our team is currently configuring your domain and designing your mobile shop.
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                    <span>Payment ID</span>
                    <span className="font-mono text-white text-[11px]">{enquiry.razorpayPaymentId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                    <span>Amount Paid</span>
                    <span className="font-bold text-emerald-400">₹{enquiry.paidAmount}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-400">
                    <span>Payment Date</span>
                    <span className="text-slate-200">{new Date(enquiry.paidAt || Date.now()).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${publicWhatsApp}?text=${encodeURIComponent(`Hello Netrawebai, I want an update on my paid order: ${enquiry.enquiryNumber} (${enquiry.businessName}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat With Support Lead</span>
                </a>
              </div>
            ) : isPending ? (
              /* State 2: Under Review */
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                  <Clock className="w-7 h-7 text-amber-400 mx-auto mb-2 animate-pulse" />
                  <span className="text-xs font-bold text-amber-300 block">Quote In Preparation</span>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Our engineering team is analyzing your specifications. You will receive an alert once the quote is ready.
                  </p>
                </div>

                <a
                  href={`https://wa.me/${publicWhatsApp}?text=${encodeURIComponent(`Hello Netrawebai, I submitted custom website enquiry *${enquiry.enquiryNumber}* for *${enquiry.businessName}*. Please provide a quote.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Expedite via WhatsApp</span>
                </a>
              </div>
            ) : isQuoted ? (
              /* State 3: Quote Ready - Needs Acceptance */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30">
                  <span className="text-xs font-bold text-blue-300 block mb-1">Quote Ready for Acceptance</span>
                  <p className="text-[11px] text-slate-300">
                    Please review the deliverables above. Once accepted, you can proceed to secure online payment.
                  </p>
                </div>

                <div className="text-center py-2">
                  <span className="text-xs text-slate-400">Approved Package Cost</span>
                  <div className="text-2xl font-black text-white mt-0.5">
                    ₹{payableAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={handleAcceptQuote}
                  disabled={isAcceptingQuote}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isAcceptingQuote ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Accept Quote & Continue</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* State 4: Quote Accepted or Fixed Package - Ready for Razorpay Payment */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-xs font-bold text-emerald-300 block mb-1">Ready for Checkout</span>
                  <p className="text-[11px] text-slate-300">
                    Pay securely using UPI (Google Pay, PhonePe, Paytm), NetBanking or Credit/Debit Card.
                  </p>
                </div>

                <div className="text-center py-2">
                  <span className="text-xs text-slate-400">Total Payable Amount</span>
                  <div className="text-3xl font-black text-white mt-0.5">
                    ₹{payableAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={handlePayNow}
                  disabled={isInitiatingPayment}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isInitiatingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Opening Secure Checkout...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Securely with Razorpay (₹{payableAmount})</span>
                    </>
                  )}
                </button>

                <div className="pt-3 border-t border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-Bit SSL Encrypted Razorpay Checkout</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Payment Modal for Test Sandbox / Missing Key Fallback */}
      {showSimulatedModal && simulatedOrderPayload && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1C2541] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-blue-500/30 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  ₹
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Razorpay Test Gateway</h3>
                  <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Sandbox Simulation Mode</span>
                </div>
              </div>
              <button
                onClick={() => setShowSimulatedModal(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="my-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Merchant:</span>
                  <span className="text-white font-semibold">Netrawebai Technologies</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Order Number:</span>
                  <span className="font-mono text-blue-400">{simulatedOrderPayload.orderNumber}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payable Amount:</span>
                  <span className="font-bold text-emerald-400 text-sm">₹{simulatedOrderPayload.amount}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-[11px] text-slate-300 leading-normal">
                This is a simulated Razorpay payment modal running in test mode. Clicking below will issue a simulated transaction and verify signatures on the server.
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleSimulatedPaymentSuccess}
                disabled={isInitiatingPayment}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isInitiatingPayment ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Successful UPI / Card Payment</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowSimulatedModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="min-h-[500px] flex items-center justify-center text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
              Loading quote review...
            </div>
          }
        >
          <QuoteDetailInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
