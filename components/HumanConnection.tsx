import React from "react";
import {
  CheckCircleIcon,
  ThumbsUpIcon,
} from "./icons/Icons";

export const HumanConnection: React.FC = () => {
  const commitments = [
    {
      title: "Respecting your home & routine",
      desc: "Our technicians wear protective boot-covers, use dedicated tool mats, and clean up completely before leaving your residence.",
    },
    {
      title: "Honest explanations, no jargon",
      desc: "We diagnose the root issue right in front of you, explain your practical repair options, and quote the exact cost before starting any work.",
    },
    {
      title: "Genuine parts & sealed packaging",
      desc: "We never compromise on component quality. Replacement items are opened and verified in your presence with traceable warranties.",
    },
    {
      title: "Direct follow-up & human care",
      desc: "Our relationship doesn't end when the invoice is signed. We follow up 48 hours later to ensure your appliance runs smoothly.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F5F7FA] border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Authentic Photography with Real Customer & Technician Interaction */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative">
              {/* Main Photo: Candid interaction between technician and homeowner */}
              <div className="rounded-2xl overflow-hidden shadow-md border border-[#E5E7EB] bg-white">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                  alt="A professional repair technician respectfully discussing diagnosis with a customer in a bright home"
                  className="w-full h-[400px] sm:h-[480px] object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Sub-card with authentic customer quote */}
              <div className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:right-6 bg-white p-4 sm:p-5 rounded-xl shadow-lg border border-[#E5E7EB] max-w-xs sm:max-w-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                    <ThumbsUpIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#172B4D]">
                      Reassured from minute one
                    </p>
                    <p className="text-[11px] text-[#737B87]">
                      Homeowner in Dhanmondi, Dhaka
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#454B54] italic leading-relaxed">
                  &ldquo;He explained exactly why the refrigerator cooling coil was frosting up instead of just pushing for an expensive part swap. That honesty is rare.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Commitments */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[#F04452] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F04452]" />
              SERVICE IS PERSONAL
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight leading-tight mb-5">
              We know how frustrating a broken device can be.
            </h2>

            <div className="space-y-4 text-base text-[#454B54] leading-relaxed mb-8">
              <p>
                A broken refrigerator, a laptop that won&apos;t start, or an AC that stops working on a hot day can disrupt your entire routine.
              </p>
              <p>
                At FIXORA, we believe repair service is more than fixing a machine. It&apos;s about respecting your time, understanding your problem, and helping you get back to your day.
              </p>
              <p className="font-medium text-[#172B4D]">
                We believe every customer deserves honest advice, skilled workmanship, and service they can feel confident about.
              </p>
            </div>

            {/* 4 Pillars of Human Care */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {commitments.map((c) => (
                <div
                  key={c.title}
                  className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircleIcon className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <h4 className="text-xs font-bold text-[#172B4D] leading-snug">
                      {c.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#737B87] leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
