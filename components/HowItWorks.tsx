import React from "react";
import {
  WrenchIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
} from "./icons/Icons";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Tell Us What's Wrong",
      desc: "Choose your device and tell us about the problem.",
      detail: "Select category, brand, and describe the symptoms in a few clicks.",
      icon: <WrenchIcon className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      num: "02",
      title: "Book Your Service",
      desc: "Choose a convenient date and time.",
      detail: "Pick a morning, afternoon, or evening slot that fits your personal schedule.",
      icon: <CalendarIcon className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      num: "03",
      title: "Meet Your Technician",
      desc: "A technician diagnoses and works on your device.",
      detail: "A vetted expert arrives at your doorstep with diagnostic tools and parts.",
      icon: <UserIcon className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      num: "04",
      title: "Get Back to Normal",
      desc: "Enjoy your repaired device and a hassle-free experience.",
      detail: "Test everything thoroughly, pay digitally or via cash, backed by 90-day warranty.",
      icon: <CheckCircleIcon className="w-5 h-5 text-[#16A34A]" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
            SIMPLE & TRANSPARENT
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight mb-3">
            Getting your device fixed shouldn&apos;t be complicated.
          </h2>
          <p className="text-base text-[#454B54]">
            Four straightforward steps from booking to hassle-free peace of mind.
          </p>
        </div>

        {/* Steps Grid / Timeline */}
        <div className="relative">
          
          {/* Subtle connecting line for desktop */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-[#E5E7EB] -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col items-start md:items-center text-left md:text-center group"
              >
                {/* Step indicator circle */}
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border-2 border-[#E5E7EB] group-hover:border-[#2563EB] transition-colors shadow-2xs mb-5">
                  <span className="text-sm font-black text-[#172B4D] group-hover:text-[#2563EB] transition-colors">
                    {step.num}
                  </span>
                </div>

                {/* Step Content */}
                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1.5">
                  Step {step.num}
                </div>

                <h3 className="text-lg font-bold text-[#172B4D] mb-2 leading-snug">
                  {step.title}
                </h3>

                <p className="text-sm font-medium text-[#454B54] mb-2">
                  {step.desc}
                </p>

                <p className="text-xs text-[#737B87] leading-relaxed max-w-xs">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
