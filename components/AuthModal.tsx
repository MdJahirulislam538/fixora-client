"use client";

import React, { useState } from "react";
import { XIcon, CheckCircleIcon, ArrowRightIcon } from "./icons/Icons";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 4) {
      setIsSignedIn(true);
      setTimeout(() => {
        onClose();
        setIsSignedIn(false);
        setOtpSent(false);
        setPhoneNumber("");
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E5E7EB] relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#737B87] hover:bg-slate-100"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            CUSTOMER PORTAL
          </span>
          <h3 className="text-xl font-bold text-[#172B4D] mt-0.5">
            Sign In to FIXORA
          </h3>
          <p className="text-xs text-[#737B87] mt-1">
            Access your ongoing repairs, digital invoices, and warranty certificates.
          </p>
        </div>

        {isSignedIn ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 text-[#16A34A] rounded-full mx-auto flex items-center justify-center mb-3">
              <CheckCircleIcon className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#172B4D]">Welcome back!</h4>
            <p className="text-xs text-[#737B87] mt-1">
              Signed in successfully. Redirecting...
            </p>
          </div>
        ) : !otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                Bangladesh Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#737B87]">
                  +880
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="017XX-XXXXXX"
                  className="w-full pl-14 pr-3 py-2 text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              Send Verification Code
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>

            <p className="text-[11px] text-center text-[#737B87]">
              We will send a 4-digit code via SMS. No passwords to remember.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                Enter 4-Digit SMS Code sent to +880 {phoneNumber}
              </label>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="• • • •"
                className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold py-2 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors cursor-pointer"
            >
              Verify & Sign In
            </button>

            <div className="flex justify-between items-center text-[11px] text-[#737B87]">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[#2563EB] hover:underline"
              >
                Change number
              </button>
              <span>Resend code in 45s</span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
