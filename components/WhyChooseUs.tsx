import React from "react";
import {
  ShieldCheckIcon,
  BadgePercentIcon,
  ClockIcon,
  AwardIcon,
  HeadphonesIcon,
  ThumbsUpIcon,
} from "./icons/Icons";

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-16 md:py-24 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            WHY CUSTOMERS CHOOSE US
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight mb-4">
            Good service is built on trust.
          </h2>
          <p className="text-base sm:text-lg text-[#454B54] leading-relaxed">
            We hold ourselves to a standard that puts accountability, precision, and your family&apos;s peace of mind first.
          </p>
        </div>

        {/* Editorial Layout: Left High-Impact Pillars, Right Real Technician at Work & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 6 Distinct Pillars arranged with editorial rhythm (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Row 1: 2 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-blue-200 transition-colors shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-1.5">
                  Skilled & Verified Technicians
                </h3>
                <p className="text-xs text-[#737B87] leading-relaxed">
                  Professionals with rigorous technical trade evaluations and police background verification before entering your home.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-blue-200 transition-colors shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#F04452] flex items-center justify-center mb-3">
                  <ThumbsUpIcon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-1.5">
                  Honest Communication
                </h3>
                <p className="text-xs text-[#737B87] leading-relaxed">
                  We explain the issue in plain terms, outline all available solutions, and confirm your approval before proceeding.
                </p>
              </div>
            </div>

            {/* Row 2: Full Width Highlight Pillar */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] hover:border-blue-200 transition-colors shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0">
                <BadgePercentIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#172B4D] mb-1">
                  Transparent Pricing
                </h3>
                <p className="text-xs text-[#737B87] leading-relaxed">
                  No confusing surprises or post-repair markups. You receive an itemized service breakdown before any parts are replaced.
                </p>
              </div>
            </div>

            {/* Row 3: 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs">
                <ClockIcon className="w-5 h-5 text-[#2563EB] mb-2" />
                <h4 className="text-xs font-bold text-[#172B4D] mb-1">
                  Convenient Scheduling
                </h4>
                <p className="text-[11px] text-[#737B87] leading-normal">
                  Book service according to your daily availability, 7 days a week.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs">
                <AwardIcon className="w-5 h-5 text-[#2563EB] mb-2" />
                <h4 className="text-xs font-bold text-[#172B4D] mb-1">
                  Quality Workmanship
                </h4>
                <p className="text-[11px] text-[#737B87] leading-normal">
                  We care about getting the repair right the first time with calibrated tools.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs">
                <HeadphonesIcon className="w-5 h-5 text-[#2563EB] mb-2" />
                <h4 className="text-xs font-bold text-[#172B4D] mb-1">
                  Customer-First Service
                </h4>
                <p className="text-[11px] text-[#737B87] leading-normal">
                  Your time, your home, and your experience truly matter to us.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Authentic Photography of Tool Bench / Master Technician + Credibility Stats (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md bg-white">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="FIXORA repair workshop testing bench and professional technician inspecting components"
                className="w-full h-64 object-cover object-center"
                loading="lazy"
              />
              <div className="p-5 bg-white border-t border-[#E5E7EB]">
                <p className="text-xs font-bold text-[#172B4D] mb-1">
                  Standardized Testing Bench & Clean Tooling
                </p>
                <p className="text-[11px] text-[#737B87]">
                  Every technician undergoes 120+ hours of diagnostic training in our certified workshop before field dispatch.
                </p>
              </div>
            </div>

            {/* Quick Impact Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-center shadow-2xs">
                <span className="text-2xl font-black text-[#2563EB] block">
                  45,000+
                </span>
                <span className="text-[11px] font-semibold text-[#737B87]">
                  Successful Repairs Done
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-center shadow-2xs">
                <span className="text-2xl font-black text-[#172B4D] block">
                  98.4%
                </span>
                <span className="text-[11px] font-semibold text-[#737B87]">
                  First-Visit Resolution
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
