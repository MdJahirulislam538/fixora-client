import React from "react";
import { ArrowRightIcon, PhoneIcon } from "./icons/Icons";

interface CallToActionProps {
  onBookClick: () => void;
  onContactClick?: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  onBookClick,
}) => {
  return (
    <section className="bg-[#172B4D] text-white py-16 md:py-20 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle Coral Highlight Dot */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider mb-5">
          <span className="w-2 h-2 rounded-full bg-[#F04452]" />
          <span>FAST DOORSTEP DISPATCH</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Something not working? Let&apos;s get it fixed.
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8">
          Reliable professionals. Convenient service. A better repair experience.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] rounded-xl transition-all shadow-md cursor-pointer"
          >
            Book a Service
            <ArrowRightIcon className="w-4 h-4" />
          </button>

          <a
            href="tel:+8809612349672"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors cursor-pointer"
          >
            <PhoneIcon className="w-4 h-4 text-[#F04452]" />
            Call Hotline: 09612-FIXORA
          </a>
        </div>

      </div>
    </section>
  );
};
