import React from "react";
import { ShieldCheckIcon, AwardIcon } from "./icons/Icons";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Narrative (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-4">
              ABOUT FIXORA
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight mb-5 leading-tight">
              Making everyday technology easier to live with.
            </h2>

            <div className="space-y-4 text-base text-[#454B54] leading-relaxed mb-8">
              <p>
                FIXORA was built around a simple idea: people deserve dependable repair services without the confusion, uncertainty, or inconvenience that often comes with finding the right technician.
              </p>
              <p>
                We bring together skilled professionals, convenient booking, and a customer-first approach to make device repair and home maintenance easier.
              </p>
              <p className="font-semibold text-[#172B4D]">
                Our mission is to restore the devices people depend on and give customers peace of mind.
              </p>
            </div>

            {/* Core Values / Standards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA]">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-[#2563EB]" />
                  <h4 className="text-xs font-bold text-[#172B4D]">
                    Vetted Trade Master Technicians
                  </h4>
                </div>
                <p className="text-[11px] text-[#737B87] leading-relaxed">
                  Every partner technician is rigorously tested for electrical safety, device troubleshooting, and customer respect.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA]">
                <div className="flex items-center gap-2 mb-1.5">
                  <AwardIcon className="w-4 h-4 text-[#F04452]" />
                  <h4 className="text-xs font-bold text-[#172B4D]">
                    Genuine Parts Guarantee
                  </h4>
                </div>
                <p className="text-[11px] text-[#737B87] leading-relaxed">
                  Direct sourcing from authorized distributors ensures replacement screens, compressors, and pumps last.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Collage of Real Workshop & Technician Testing Bench (6 cols) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80"
                    alt="Technician testing circuit board voltage with precision probe"
                    className="w-full h-48 sm:h-56 object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="bg-[#172B4D] text-white p-4 sm:p-5 rounded-2xl">
                  <p className="text-2xl font-black text-blue-400">100%</p>
                  <p className="text-xs font-semibold text-slate-200 mt-1">
                    Transparent Itemized Billing & Written Warranty
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="bg-[#EFF6FF] border border-blue-100 p-4 sm:p-5 rounded-2xl">
                  <p className="text-2xl font-black text-[#2563EB]">120+</p>
                  <p className="text-xs font-semibold text-[#172B4D] mt-1">
                    Master technicians serving residential households
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80"
                    alt="Precision tools and repair workshop setup"
                    className="w-full h-48 sm:h-56 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
