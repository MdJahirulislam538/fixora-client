"use client";

import React, { useState } from "react";
import {
  XIcon,
  SearchIcon,
  ClockIcon,
  PhoneIcon,
  UserIcon,
} from "./icons/Icons";

interface TrackServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackServiceModal: React.FC<TrackServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [referenceId, setReferenceId] = useState("FX-8492");
  const [hasSearched, setHasSearched] = useState(true);

  if (!isOpen) return null;

  const mockTrackData = {
    id: referenceId || "FX-8492",
    customer: "Shakib Al Hasan",
    device: "Gree 1.5 Ton Split Inverter AC",
    service: "Cooling Failure Diagnosis & Jet Wash",
    address: "House 24, Road 7, Dhanmondi, Dhaka",
    status: "Technician Dispatched & En Route",
    stage: 2, // 0: Booking Logged, 1: Specialist Assigned, 2: En Route, 3: In Progress, 4: Complete
    technician: {
      name: "Md. Rafiqul Islam",
      title: "Senior HVAC & Climate Specialist",
      rating: "4.92 ★",
      jobs: "1,420+ repairs",
      phone: "+880 1712-349811",
      eta: "Arriving in ~22 minutes",
    },
  };

  const stages = [
    { title: "Booking Confirmed", desc: "Logged in dispatch queue" },
    { title: "Technician Assigned", desc: "Expert verified & tool-kitted" },
    { title: "En Route to Your Doorstep", desc: "Traveling via transit" },
    { title: "Diagnostics & Service", desc: "Testing and component fix" },
    { title: "Tested & Certified", desc: "90-day warranty active" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#E5E7EB] relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#737B87] hover:bg-slate-100"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            LIVE REPAIR TRACKER
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#172B4D] mt-0.5">
            Track Your Service Request
          </h3>
          <p className="text-xs text-[#737B87] mt-1">
            Enter your 6-character FIXORA Reference ID from your SMS confirmation.
          </p>
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-[#737B87] absolute left-3 top-3" />
            <input
              type="text"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
              placeholder="e.g. FX-8492"
              className="w-full pl-9 pr-3 py-2 text-sm uppercase font-mono font-bold bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
          <button
            onClick={() => setHasSearched(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors cursor-pointer"
          >
            Look Up
          </button>
        </div>

        {/* Tracking Details Result */}
        {hasSearched && (
          <div className="space-y-5">
            {/* Current Status Pill */}
            <div className="p-4 bg-[#EFF6FF] border border-blue-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">
                  Current Status
                </span>
                <p className="text-sm font-bold text-[#172B4D] mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                  {mockTrackData.status}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#737B87] block">Estimated Arrival</span>
                <span className="text-xs font-bold text-[#F04452] flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  {mockTrackData.technician.eta}
                </span>
              </div>
            </div>

            {/* Step Timeline */}
            <div className="space-y-3 pl-2">
              {stages.map((stage, idx) => {
                const isPassed = idx < mockTrackData.stage;
                const isCurrent = idx === mockTrackData.stage;

                return (
                  <div key={stage.title} className="flex items-start gap-3 relative">
                    {/* Circle */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold ${
                        isPassed
                          ? "bg-[#16A34A] text-white"
                          : isCurrent
                          ? "bg-[#2563EB] text-white ring-4 ring-blue-100"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </div>

                    {/* Content */}
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent ? "text-[#2563EB]" : "text-[#172B4D]"
                        }`}
                      >
                        {stage.title}
                      </h4>
                      <p className="text-[11px] text-[#737B87]">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Assigned Technician Profile Box */}
            <div className="p-4 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#172B4D] text-white flex items-center justify-center font-bold text-sm">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172B4D]">
                    {mockTrackData.technician.name}
                  </h4>
                  <p className="text-[11px] text-[#737B87]">
                    {mockTrackData.technician.title} • {mockTrackData.technician.rating}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${mockTrackData.technician.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E7EB] hover:bg-slate-50 rounded-lg text-xs font-semibold text-[#172B4D]"
              >
                <PhoneIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                Call Tech
              </a>
            </div>

            <div className="text-[11px] text-center text-[#737B87] pt-1">
              Need assistance? Call dispatch anytime at <span className="font-bold text-[#172B4D]">09612-FIXORA</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
