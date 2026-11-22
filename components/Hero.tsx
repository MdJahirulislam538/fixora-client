"use client";

import React from "react";
import {
  WrenchIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "./icons/Icons";

interface HeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreClick }) => {
  return (
    <section id="hero" className="relative bg-white pt-8 pb-14 md:py-16 overflow-hidden">
      {/* Background Soft Accent Tint */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F5F7FA]/70 -z-10 hidden lg:block rounded-l-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetrical 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-blue-100 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#F04452]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                YOUR HOME. YOUR DEVICES. OUR CARE.
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#172B4D] leading-[1.18] tracking-tight mb-5 max-w-2xl">
              Technology should make life easier. We make sure it stays that way.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#454B54] leading-relaxed mb-7 max-w-xl">
              From everyday appliances to essential smart devices, FIXORA connects you with trusted professionals who care about getting the job done right.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-6">
              <button
                onClick={onBookClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
              >
                Book a Repair
                <ArrowRightIcon className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-[#172B4D] hover:text-[#2563EB] bg-white hover:bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl transition-colors cursor-pointer"
              >
                Explore Our Services
              </button>
            </div>

            {/* Trust Line */}
            <div className="pt-4 border-t border-[#E5E7EB] w-full max-w-xl">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm font-medium text-[#737B87]">
                <span className="flex items-center gap-1.5 text-[#172B4D]">
                  <CheckCircleIcon className="w-4 h-4 text-[#16A34A]" />
                  Trusted technicians
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-[#172B4D]">
                  <CheckCircleIcon className="w-4 h-4 text-[#16A34A]" />
                  Transparent pricing
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-[#172B4D]">
                  <CheckCircleIcon className="w-4 h-4 text-[#16A34A]" />
                  Service you can count on
                </span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols) - Authentic Photography with Clean Contextual UI */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E5E7EB] bg-slate-100">
              
              {/* Natural, Candid Photographic Subject */}
              {/* Technician repairing an air conditioner and home appliance in a residential setting */}
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80"
                alt="FIXORA certified technician diagnosing an indoor home climate system with precision tools"
                className="w-full h-[380px] sm:h-[440px] object-cover object-center"
                loading="eager"
              />

              {/* Bottom Subtle Overlay Strip - Authentic Service Verification */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#172B4D]/90 via-[#172B4D]/60 to-transparent p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1.5">
                      <ShieldCheckIcon className="w-4 h-4 text-[#2563EB]" />
                      Verified Doorstep Technician
                    </p>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Equipped with safety gear, calibrated tools & OEM parts
                    </p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-xs px-2.5 py-1 rounded-md text-right">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <StarIcon className="w-3.5 h-3.5 fill-amber-300" />
                      4.9 / 5
                    </span>
                    <span className="text-[10px] text-slate-200">18k+ Home Repairs</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Single clean supporting badge (not cluttered, purpose-driven) */}
            <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 bg-white border border-[#E5E7EB] rounded-xl shadow-md p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                <WrenchIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#737B87] uppercase tracking-wide">
                  Standard Guarantee
                </p>
                <p className="text-xs font-bold text-[#172B4D]">
                  90-Day Free Warranty
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
