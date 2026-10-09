'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Store, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('9829012345');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoHint, setDemoHint] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
      setDemoHint(true);
      setOtpCode('1234'); // Pre-fill sample OTP for seamless demo testing
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication and route to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#121A33] rounded-3xl p-8 border border-slate-800 shadow-2xl relative space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20">
              <Store className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Shop Owner Login
            </h1>
            <p className="text-xs text-slate-400">
              Enter your mobile number to access your websites and manage your storefront drafts.
            </p>
          </div>

          {/* Demo Disclaimer */}
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-[11px] text-blue-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Demo Environment:</strong> Standard SMS gateway is simulated. Use sample OTP <code>1234</code> to sign in instantly.
            </span>
          </div>

          {!otpSent ? (
            /* Step 1: Mobile Number Form */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="98290 12345"
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono tracking-wider focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Enter 4-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-center text-sm font-mono tracking-widest focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Enter Dashboard</span>
              </button>
            </form>
          )}

          {/* Guest Access Link */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              href="/dashboard"
              className="text-xs text-slate-400 hover:text-white font-medium underline underline-offset-4"
            >
              Continue to Owner Dashboard directly as Guest &rarr;
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
