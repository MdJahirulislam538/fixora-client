"use client";

import React, { useState } from "react";
import {
  MapPinIcon,
  SearchIcon,
  ClockIcon,
  ArrowRightIcon,
} from "./icons/Icons";

interface AreaCoverage {
  area: string;
  city: string;
  activeTechnicians: number;
  avgResponseMins: number;
  coverageStatus: "active" | "express" | "expansion";
}

const COVERAGE_DATA: AreaCoverage[] = [
  { area: "Dhanmondi", city: "Dhaka", activeTechnicians: 14, avgResponseMins: 35, coverageStatus: "express" },
  { area: "Gulshan-1 & 2", city: "Dhaka", activeTechnicians: 18, avgResponseMins: 30, coverageStatus: "express" },
  { area: "Banani", city: "Dhaka", activeTechnicians: 12, avgResponseMins: 30, coverageStatus: "express" },
  { area: "Uttara (All Sectors)", city: "Dhaka", activeTechnicians: 16, avgResponseMins: 40, coverageStatus: "express" },
  { area: "Mirpur (1-14 & DOHS)", city: "Dhaka", activeTechnicians: 22, avgResponseMins: 40, coverageStatus: "active" },
  { area: "Mohammadpur", city: "Dhaka", activeTechnicians: 15, avgResponseMins: 45, coverageStatus: "active" },
  { area: "Bashundhara R/A", city: "Dhaka", activeTechnicians: 10, avgResponseMins: 35, coverageStatus: "express" },
  { area: "Badda / Rampura", city: "Dhaka", activeTechnicians: 11, avgResponseMins: 45, coverageStatus: "active" },
  { area: "Agrabad & Khulshi", city: "Chattogram", activeTechnicians: 12, avgResponseMins: 50, coverageStatus: "active" },
  { area: "Nasirabad & GEC", city: "Chattogram", activeTechnicians: 9, avgResponseMins: 55, coverageStatus: "active" },
  { area: "Zindabazar & Upashahar", city: "Sylhet", activeTechnicians: 8, avgResponseMins: 45, coverageStatus: "active" },
];

interface ServiceLocationsProps {
  onBookInArea: (area: string) => void;
}

export const ServiceLocations: React.FC<ServiceLocationsProps> = ({ onBookInArea }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<AreaCoverage>(COVERAGE_DATA[0]);

  const filtered = COVERAGE_DATA.filter((item) =>
    item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="locations" className="py-16 md:py-24 bg-[#F5F7FA] border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            SERVICE AVAILABILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight mb-3">
            Professional repair service, closer to home.
          </h2>
          <p className="text-base sm:text-lg text-[#454B54]">
            Find out whether FIXORA technicians are active in your neighborhood right now.
          </p>
        </div>

        {/* Interactive Checker: Search + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Search & Area List (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            
            {/* Search Input */}
            <div className="relative mb-5">
              <SearchIcon className="w-4 h-4 text-[#737B87] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your area (e.g. Dhanmondi, Gulshan, Uttara, Mirpur, Chattogram)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {/* Area Grid Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {filtered.map((item) => {
                const isSelected = selectedArea.area === item.area;
                return (
                  <button
                    key={item.area}
                    onClick={() => setSelectedArea(item)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#2563EB] bg-[#EFF6FF] shadow-2xs"
                        : "border-[#E5E7EB] bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#172B4D]">
                        {item.area}
                      </h4>
                      <p className="text-[11px] text-[#737B87]">{item.city}</p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                        Active
                      </span>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-2 py-8 text-center text-xs text-[#737B87]">
                  No matching coverage found for &ldquo;{searchQuery}&rdquo;. We expand new zones regularly!
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Live Status Detail Card for Selected Area (5 cols) */}
          <div className="lg:col-span-5 bg-[#172B4D] text-white p-6 sm:p-7 rounded-2xl shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 text-[#2563EB]" />
                  Coverage Status
                </span>
                <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#16A34A] rounded-md">
                  Active Now
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-1">
                {selectedArea.area}
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                Division / District: {selectedArea.city}
              </p>

              {/* Status Metric Rows */}
              <div className="space-y-3.5 bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Active Field Technicians:</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    {selectedArea.activeTechnicians} Certified Pros
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Average Arrival Time:</span>
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5 text-amber-300" />
                    ~{selectedArea.avgResponseMins} minutes
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Emergency Dispatch:</span>
                  <span className="font-bold text-emerald-400">
                    Available Today
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onBookInArea(selectedArea.area)}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Book Service in {selectedArea.area}
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
