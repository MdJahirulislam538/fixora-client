"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "./icons/Icons";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How does FIXORA verify its technicians?",
    a: "Every FIXORA technician undergoes a comprehensive 4-stage screening process: trade certification checks, hands-on practical troubleshooting exams on live appliances, national identity (NID) and police background verification, and customer communication etiquette training.",
  },
  {
    q: "How does pricing and the inspection fee work?",
    a: "We believe in 100% transparent pricing. When our technician visits your residence, they perform a comprehensive diagnostic inspection. If you proceed with the repair with FIXORA, the inspection fee is completely waived! If you choose not to proceed after diagnosis, only a nominal visit fee (৳350) applies.",
  },
  {
    q: "What kind of warranty does FIXORA provide?",
    a: "All repairs completed through FIXORA come with our standard 90-day service warranty on replaced parts and workmanship. If the same fault recurs within 90 days, our technician will revisit and resolve it free of charge.",
  },
  {
    q: "What payment methods are supported in Bangladesh?",
    a: "You can pay comfortably after testing and approving the repair. We accept Cash on Delivery (COD), bKash, Nagad, Rocket, as well as Visa and Mastercard.",
  },
  {
    q: "Can I reschedule or cancel my repair appointment?",
    a: "Yes. You can reschedule or cancel at any time before the technician has been dispatched with zero penalty or cancellation fees. You can do so directly by calling our hotline 09612-FIXORA or via your booking reference.",
  },
  {
    q: "Do technicians bring original replacement parts to the doorstep?",
    a: "Yes. Our technicians carry standard diagnostic kits and the most common genuine spare parts (capacitors, sensors, valves, screen assemblies) for the specific brand and model you entered during booking.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 bg-[#F5F7FA] border-t border-[#E5E7EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight mb-3">
            Everything you need to know about FIXORA
          </h2>
          <p className="text-base text-[#454B54]">
            Clear, honest answers to help you book with complete confidence.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden transition-colors shadow-2xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-[#172B4D] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-[#737B87] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#2563EB]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#454B54] leading-relaxed border-t border-slate-100">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
