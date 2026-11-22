import React from "react";
import { ServiceCategoryItem } from "./ServiceCategories";
import {
  XIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "./icons/Icons";

interface ServiceDetailModalProps {
  service: ServiceCategoryItem | null;
  onClose: () => void;
  onBookThis: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookThis,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E5E7EB] flex flex-col max-h-[90vh]">
        
        {/* Modal Header with Image */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-100">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172B4D]/90 via-[#172B4D]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
              Service Overview
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mt-0.5">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#454B54]">
          <p className="text-sm sm:text-base leading-relaxed text-[#172B4D]">
            {service.description}
          </p>

          {/* Quick Service Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-[#F5F7FA] rounded-xl border border-[#E5E7EB] text-xs">
            <div>
              <span className="text-[#737B87] block text-[11px]">Turnaround Time:</span>
              <span className="font-bold text-[#172B4D] flex items-center gap-1 mt-0.5">
                <ClockIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                {service.duration}
              </span>
            </div>
            <div>
              <span className="text-[#737B87] block text-[11px]">Inspection Fee:</span>
              <span className="font-bold text-[#172B4D] mt-0.5 block">
                {service.startingPrice} (Waived if repaired)
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[#737B87] block text-[11px]">Warranty:</span>
              <span className="font-bold text-[#16A34A] flex items-center gap-1 mt-0.5">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                90-Day Guarantee
              </span>
            </div>
          </div>

          {/* Covered Tasks */}
          <div>
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-2.5">
              What We Diagnose & Repair in this Category:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.services.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-[#172B4D]"
                >
                  <CheckCircleIcon className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Protocol Promise */}
          <div className="p-4 rounded-xl border border-blue-100 bg-[#EFF6FF] text-xs text-[#172B4D] space-y-1">
            <p className="font-bold">Our Service Protocol:</p>
            <p className="text-[#454B54] leading-relaxed">
              1. Punctual doorstep arrival with sanitized tools and electrostatic mats.
              <br />
              2. Complete symptom inspection and upfront verbal quote.
              <br />
              3. Replacement parts unsealed and shown in front of you.
              <br />
              4. Full post-repair testing and digital invoice receipt with warranty ID.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#F5F7FA] border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#737B87] hover:text-[#172B4D] transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookThis(service.id);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors shadow-sm"
          >
            Book This Service
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
