import React, { useState } from 'react';
import { X, Key, MessageSquare, ChevronLeft, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  // Steps: 1 (Email/Phone), 2 (Choose Method), 3 (Password), 4 (OTP)
  const [step, setStep] = useState<number>(1);
  const [contactInfo, setContactInfo] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  // एडमिन वेरिफिकेशन लॉजिक
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // यहाँ अपनी एडमिन आईडी डालें
    const ADMIN_ID = "7055975531"; // या admin@email.com
    
    if (contactInfo === ADMIN_ID) {
      alert("Admin Verified! Redirecting to Admin Portal...");
      // यहाँ एडमिन डैशबोर्ड पर रीडायरेक्ट करने का कोड डालें (e.g., router.push('/admin'))
      onClose();
    } else {
      alert("User Login Successful! Opening Courses...");
      // यहाँ नॉर्मल यूज़र लॉगिन का कोड डालें
      onClose();
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setContactInfo('');
    setPassword('');
    setOtp('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md relative overflow-hidden flex flex-col p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Back Button (for steps > 1) */}
        {step > 1 && (
          <button
            onClick={() => setStep(step === 3 || step === 4 ? 2 : 1)}
            className="absolute top-4 left-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Logo/Icon Area */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
            {step === 1 ? <ShieldCheck className="w-7 h-7 text-zinc-700" /> : <div className="w-7 h-7 bg-zinc-300 rounded-full" />}
          </div>
        </div>

        {/* STEP 1: Email or Phone Number */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 duration-200">
            <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Welcome</h2>
            <p className="text-sm text-center text-zinc-500 mb-8">
              Enter your email or phone number to get started.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); if (contactInfo) setStep(2); }}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Phone number/Email
                </label>
                <input
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Enter your email or phone number"
                  className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-shadow"
                />
                <p className="text-[11px] text-zinc-500 mt-2">
                  Please add country code if you are a user outside of India
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-xl transition-colors mt-2 cursor-pointer"
              >
                Next
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Choose Login Method */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 duration-200">
            <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Welcome back</h2>
            <p className="text-sm text-center text-zinc-500 mb-8">
              Choose how you'd like to login.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setStep(3)}
                className="w-full flex items-center justify-between p-4 border border-zinc-200 rounded-2xl hover:border-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-white">
                    <Key className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-zinc-900">Login with Password</h3>
                    <p className="text-xs text-zinc-500">Use the password for your account</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-zinc-400 rotate-180" />
              </button>

              <button
                onClick={() => setStep(4)}
                className="w-full flex items-center justify-between p-4 border border-zinc-200 rounded-2xl hover:border-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-white">
                    <MessageSquare className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-zinc-900">Login with OTP</h3>
                    <p className="text-xs text-zinc-500">We'll send a one-time password</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-zinc-400 rotate-180" />
              </button>
            </div>

            <div className="mt-6 text-center">
              <button className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer">
                Forgot Password
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Login with Password */}
        {step === 3 && (
          <div className="animate-in slide-in-from-right-4 duration-200">
            <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Enter Password</h2>
            <p className="text-sm text-center text-zinc-500 mb-8">
              Logging in as <span className="font-semibold text-zinc-800">{contactInfo}</span>
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-6">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-shadow"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
              >
                Secure Login
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Login with OTP */}
        {step === 4 && (
          <div className="animate-in slide-in-from-right-4 duration-200">
            <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Enter OTP</h2>
            <p className="text-sm text-center text-zinc-500 mb-8">
              We sent a code to <span className="font-semibold text-zinc-800">{contactInfo}</span>
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full text-center tracking-[0.5em] text-lg font-bold px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-shadow"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
              >
                Verify & Login
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
