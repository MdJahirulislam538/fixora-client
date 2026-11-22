"use client";

import React, { useState } from "react";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XIcon,
} from "./icons/Icons";

const CATEGORY_BRANDS: Record<string, string[]> = {
  "smartphone-tablet": ["Apple", "Samsung", "Xiaomi", "Vivo", "Oppo", "Realme", "OnePlus", "Google Pixel"],
  "laptop-computer": ["Apple MacBook", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Custom Desktop"],
  "ac-service": ["Gree", "General", "Walton", "Haier", "LG", "Carrier", "Samsung", "Midea"],
  "refrigerator-repair": ["Walton", "Singer", "Samsung", "LG", "Sharp", "Haier", "Hitachi", "Marcel"],
  "washing-machine": ["LG", "Samsung", "Walton", "Whirlpool", "Singer", "Haier", "Sharp", "Bosch"],
  "television-repair": ["Sony", "Samsung", "LG", "Walton", "Xiaomi", "TCL", "Singer", "Hisense"],
  "home-appliance": ["Miyako", "Philips", "Panasonic", "Walton", "Sharp", "Nova", "Singer", "Prestige"],
  "smart-home-installation": ["Dahua", "Hikvision", "Xiaomi", "TP-Link Tapo", "Tuya Smart", "EZVIZ", "Google Nest"],
};

const COMMON_ISSUES: Record<string, string[]> = {
  "smartphone-tablet": ["Cracked Glass / Broken Screen", "Battery Draining Fast", "Not Charging / Loose Port", "Water / Liquid Damage", "Dead / Not Turning On"],
  "laptop-computer": ["Overheating / Fan Noise", "Slow Performance / Freezing", "Screen Flickering / Lines", "Keyboard / Trackpad Defect", "OS Boot Failure / Blue Screen"],
  "ac-service": ["Not Cooling / Blowing Warm Air", "Water Leaking Inside Room", "Strange Noise or Vibration", "AC Deep Jet Wash Servicing", "Gas / Refrigerant Leak Check"],
  "refrigerator-repair": ["Freezer Not Cooling", "Unusual Compressor Noise", "Excessive Frost / Ice Buildup", "Water Leaking on Floor", "Thermostat Not Regulating"],
  "washing-machine": ["Water Not Draining", "Drum Not Spinning", "Heavy Vibration / Shaking", "Error Code on Display", "Water Inlet Valve Issue"],
  "television-repair": ["Sound Working but No Picture", "Half Screen Black / Lines", "TV Won't Turn On (No Light)", "Damaged HDMI / AV Ports", "Wi-Fi Connection Failure"],
  "home-appliance": ["Microwave Not Heating", "Oven Temperature Inconsistent", "Blender / Mixer Motor Stopped", "Water Purifier Filter Clogged", "Electric Wiring Spark"],
  "smart-home-installation": ["New CCTV Camera Setup", "Smart Door Lock Installation", "Wi-Fi Router Mesh Configuration", "Smart Switch Replacement", "App Sync & Remote View Setup"],
};

const BANGLADESH_AREAS: Record<string, string[]> = {
  Dhaka: [
    "Dhanmondi",
    "Gulshan-1",
    "Gulshan-2",
    "Banani",
    "Uttara (Sectors 1-14)",
    "Mirpur (1-14, DOHS)",
    "Mohammadpur",
    "Bashundhara R/A",
    "Badda / Rampura",
    "Mohakhali / DOHS",
    "Lalmatia",
    "Shantinagar / Bailey Rd",
    "Khilgaon",
    "Motijheel",
    "Old Dhaka (Puran Dhaka)",
  ],
  Chattogram: [
    "Agrabad",
    "Nasirabad",
    "GEC Circle",
    "Khulshi",
    "Halishahar",
    "Panchlaish",
    "Chawkbazar",
  ],
  Sylhet: [
    "Zindabazar",
    "Upashahar",
    "Shibganj",
    "Ambarkhana",
    "Kumarpara",
  ],
};

interface BookingSectionProps {
  preselectedCategory?: string;
  onClearPreselectedCategory?: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  preselectedCategory,
  onClearPreselectedCategory,
}) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [category, setCategory] = useState(preselectedCategory || "ac-service");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [problemType, setProblemType] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [area, setArea] = useState("Dhanmondi");
  const [streetAddress, setStreetAddress] = useState("");
  const [serviceDate, setServiceDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("Morning (09:00 AM - 12:00 PM)");
  const [serviceTier, setServiceTier] = useState<"standard" | "express">("standard");

  // State management
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    id: string;
    name: string;
    category: string;
    date: string;
    time: string;
    address: string;
    area: string;
    city: string;
  } | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = "Please enter your full name";
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phoneNumber = "Please enter a valid 11-digit Bangladesh phone number";
    }

    if (!emailAddress.trim() || !emailAddress.includes("@")) {
      errs.emailAddress = "Please enter a valid email address";
    }

    if (!category) {
      errs.category = "Please select a device category";
    }

    if (!brand.trim()) {
      errs.brand = "Please select or type your device brand";
    }

    if (!streetAddress.trim()) {
      errs.streetAddress = "Please provide your street or house address";
    }

    if (!serviceDate) {
      errs.serviceDate = "Please choose a preferred service date";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Realistic API submission simulation
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `FX-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingConfirmation({
        id: generatedId,
        name: fullName,
        category: category,
        date: serviceDate,
        time: timeSlot,
        address: streetAddress,
        area: area,
        city: city,
      });
    }, 1000);
  };

  const handleReset = () => {
    setBookingConfirmation(null);
    setFullName("");
    setPhoneNumber("");
    setEmailAddress("");
    setModel("");
    setIssueDescription("");
    setStreetAddress("");
    setErrors({});
    if (onClearPreselectedCategory) {
      onClearPreselectedCategory();
    }
  };

  return (
    <section id="booking" className="py-16 md:py-24 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
            CONVENIENT SCHEDULING
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight mb-3">
            Let&apos;s get your device back in shape.
          </h2>
          <p className="text-base sm:text-lg text-[#454B54]">
            Tell us a little about your problem. We&apos;ll help you find the right service.
          </p>
        </div>

        {/* 2-Column Form Layout: Left Form Fields, Right Service Summary & Guarantees */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Main Booking Form (8 Columns) */}
          <div className="lg:col-span-8 bg-[#F5F7FA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
            
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Section 1: Customer Contact Details */}
              <div>
                <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider mb-4 pb-2 border-b border-[#E5E7EB] flex items-center justify-between">
                  <span>1. Your Contact Information</span>
                  <span className="text-[11px] text-[#737B87] font-normal">All fields required</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors({ ...errors, fullName: "" });
                      }}
                      placeholder="e.g. Shakib Al Hasan"
                      className={`w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-colors ${
                        errors.fullName ? "border-[#F04452]" : "border-[#E5E7EB]"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-[#F04452] mt-1 flex items-center gap-1">
                        <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#737B87]">
                        +880
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" });
                        }}
                        placeholder="017XX-XXXXXX"
                        className={`w-full pl-14 pr-3.5 py-2.5 bg-white text-sm text-[#172B4D] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-colors ${
                          errors.phoneNumber ? "border-[#F04452]" : "border-[#E5E7EB]"
                        }`}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-xs text-[#F04452] mt-1 flex items-center gap-1">
                        <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => {
                        setEmailAddress(e.target.value);
                        if (errors.emailAddress) setErrors({ ...errors, emailAddress: "" });
                      }}
                      placeholder="e.g. yourname@gmail.com"
                      className={`w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-colors ${
                        errors.emailAddress ? "border-[#F04452]" : "border-[#E5E7EB]"
                      }`}
                    />
                    {errors.emailAddress && (
                      <p className="text-xs text-[#F04452] mt-1 flex items-center gap-1">
                        <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                        {errors.emailAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Device & Problem Details */}
              <div>
                <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider mb-4 pb-2 border-b border-[#E5E7EB]">
                  2. Device & Problem Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Device Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setBrand("");
                        setProblemType("");
                      }}
                      className="w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option value="smartphone-tablet">Smartphone & Tablet</option>
                      <option value="laptop-computer">Laptop & Computer</option>
                      <option value="ac-service">Air Conditioner (AC)</option>
                      <option value="refrigerator-repair">Refrigerator & Freezer</option>
                      <option value="washing-machine">Washing Machine</option>
                      <option value="television-repair">Television (LED / Smart TV)</option>
                      <option value="home-appliance">Home & Kitchen Appliance</option>
                      <option value="smart-home-installation">Smart Home & CCTV</option>
                    </select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Device Brand *
                    </label>
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => {
                          setBrand(e.target.value);
                          if (errors.brand) setErrors({ ...errors, brand: "" });
                        }}
                        placeholder="e.g. Gree, Walton, Samsung, Apple"
                        className={`w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                          errors.brand ? "border-[#F04452]" : "border-[#E5E7EB]"
                        }`}
                      />
                      {/* Popular Quick Brand Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {CATEGORY_BRANDS[category]?.slice(0, 4).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => {
                              setBrand(b);
                              if (errors.brand) setErrors({ ...errors, brand: "" });
                            }}
                            className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                              brand === b
                                ? "bg-[#2563EB] text-white border-[#2563EB]"
                                : "bg-white text-[#454B54] border-[#E5E7EB] hover:bg-slate-100"
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    {errors.brand && (
                      <p className="text-xs text-[#F04452] mt-1 flex items-center gap-1">
                        <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                        {errors.brand}
                      </p>
                    )}
                  </div>

                  {/* Model Name/Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Model / Series (Optional)
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. 1.5 Ton Inverter / Galaxy S23 / Inspiron 15"
                      className="w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  {/* Problem Type */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Problem Type
                    </label>
                    <select
                      value={problemType}
                      onChange={(e) => setProblemType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option value="">Select typical problem (or type below)</option>
                      {COMMON_ISSUES[category]?.map((issue) => (
                        <option key={issue} value={issue}>
                          {issue}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Describe Your Issue */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Describe Your Issue
                    </label>
                    <textarea
                      rows={3}
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Tell us what symptoms you noticed (e.g. water leakage started yesterday morning, strange buzzing noise, power trip)..."
                      className="w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Service Address & Scheduling */}
              <div>
                <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider mb-4 pb-2 border-b border-[#E5E7EB]">
                  3. Service Address & Preferred Time
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      City / Division *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        setCity(newCity);
                        setArea(BANGLADESH_AREAS[newCity]?.[0] || "");
                      }}
                      className="w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option value="Dhaka">Dhaka Metro</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Sylhet">Sylhet</option>
                    </select>
                  </div>

                  {/* Thana / Area */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Thana / Neighborhood Area *
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      {BANGLADESH_AREAS[city]?.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Service Address (House, Road, Block/Sector) *
                    </label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => {
                        setStreetAddress(e.target.value);
                        if (errors.streetAddress) setErrors({ ...errors, streetAddress: "" });
                      }}
                      placeholder="e.g. House 42, Road 9/A, Dhanmondi, Dhaka"
                      className={`w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        errors.streetAddress ? "border-[#F04452]" : "border-[#E5E7EB]"
                      }`}
                    />
                    {errors.streetAddress && (
                      <p className="text-xs text-[#F04452] mt-1 flex items-center gap-1">
                        <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                        {errors.streetAddress}
                      </p>
                    )}
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Preferred Service Date *
                    </label>
                    <input
                      type="date"
                      value={serviceDate}
                      onChange={(e) => {
                        setServiceDate(e.target.value);
                        if (errors.serviceDate) setErrors({ ...errors, serviceDate: "" });
                      }}
                      className="w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    {errors.serviceDate && (
                      <p className="text-xs text-[#F04452] mt-1 flex items-center gap-1">
                        <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                        {errors.serviceDate}
                      </p>
                    )}
                  </div>

                  {/* Preferred Time Slot */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                      Preferred Time Slot *
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white text-sm text-[#172B4D] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                      <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Service Priority Option */}
              <div className="p-4 bg-white rounded-xl border border-[#E5E7EB]">
                <p className="text-xs font-bold text-[#172B4D] mb-2">
                  Service Speed Option
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      serviceTier === "standard"
                        ? "border-[#2563EB] bg-[#EFF6FF]"
                        : "border-[#E5E7EB] hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceTier"
                      checked={serviceTier === "standard"}
                      onChange={() => setServiceTier("standard")}
                      className="mt-1 text-[#2563EB]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#172B4D] block">
                        Standard Scheduled Visit
                      </span>
                      <span className="text-[11px] text-[#737B87]">
                        Regular diagnosis fee waived if you proceed with repair.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      serviceTier === "express"
                        ? "border-[#F04452] bg-[#FEF2F2]"
                        : "border-[#E5E7EB] hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceTier"
                      checked={serviceTier === "express"}
                      onChange={() => setServiceTier("express")}
                      className="mt-1 text-[#F04452]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#172B4D] flex items-center gap-1.5">
                        Express Urgent Dispatch
                        <span className="text-[10px] font-bold text-white bg-[#F04452] px-1.5 py-0.2 rounded">
                          Fast
                        </span>
                      </span>
                      <span className="text-[11px] text-[#737B87]">
                        Technician dispatched within 60–90 mins (subject to area).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-base font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] rounded-xl transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Verifying Schedule & Technicians...
                    </span>
                  ) : (
                    "Schedule a Repair"
                  )}
                </button>
                <p className="text-[11px] text-center text-[#737B87] mt-2.5">
                  No advance payment required. Pay only after service is completed and verified.
                </p>
              </div>

            </form>
          </div>

          {/* Right Column: Service Summary & Reassurance (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Service Summary Card */}
            <div className="bg-[#172B4D] text-white p-6 rounded-2xl shadow-md">
              <span className="text-[11px] uppercase tracking-wider font-bold text-blue-300 block mb-2">
                Booking Overview
              </span>
              <h4 className="text-lg font-bold mb-4">
                What to expect during your service
              </h4>

              <div className="space-y-3.5 text-xs text-slate-300 border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <span>Selected Service:</span>
                  <span className="font-bold text-white capitalize">
                    {category.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Inspection Fee:</span>
                  <span className="font-bold text-[#16A34A] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    ৳0 if Repaired (or ৳350 basic diagnosis)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Warranty:</span>
                  <span className="font-bold text-white">90 Days on Replaced Parts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location Coverage:</span>
                  <span className="font-bold text-white">{city} ({area})</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheckIcon className="w-5 h-5 text-[#2563EB] shrink-0" />
                <span>Strict background check & health protocol followed by every technician.</span>
              </div>
            </div>

            {/* Quick Hotline Call Card */}
            <div className="bg-[#EFF6FF] border border-blue-200 p-5 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wide">
                  Need Help or Custom Inquiry?
                </h4>
                <p className="text-xs text-[#454B54] mt-0.5">
                  Speak directly with a repair coordinator now.
                </p>
                <a
                  href="tel:+8809612349672"
                  className="inline-block text-sm font-bold text-[#2563EB] hover:underline mt-1.5"
                >
                  09612-FIXORA (349672)
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Booking Confirmation Receipt Modal */}
      {bookingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E5E7EB] relative">
            
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#737B87] hover:bg-slate-100"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-100 text-[#16A34A] rounded-2xl mx-auto flex items-center justify-center mb-3">
                <CheckCircleIcon className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
                Booking Confirmed
              </span>
              <h3 className="text-2xl font-bold text-[#172B4D] mt-1">
                We&apos;re on it, {bookingConfirmation.name}!
              </h3>
              <p className="text-xs text-[#737B87] mt-1">
                Your repair request has been logged in our dispatch dispatch queue.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl p-4 mb-6 space-y-2.5 text-xs text-[#454B54]">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]">
                <span className="text-[#737B87]">Booking Reference:</span>
                <span className="font-mono font-bold text-sm text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {bookingConfirmation.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737B87]">Device Type:</span>
                <span className="font-semibold text-[#172B4D] capitalize">
                  {bookingConfirmation.category.replace("-", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737B87]">Scheduled Date:</span>
                <span className="font-semibold text-[#172B4D]">
                  {bookingConfirmation.date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737B87]">Preferred Window:</span>
                <span className="font-semibold text-[#172B4D]">
                  {bookingConfirmation.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737B87]">Service Address:</span>
                <span className="font-semibold text-[#172B4D] text-right max-w-[200px] truncate">
                  {bookingConfirmation.address}, {bookingConfirmation.area}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleReset}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors text-center"
              >
                Done
              </button>
              <p className="text-[11px] text-center text-[#737B87]">
                An SMS confirmation with the assigned technician details has been sent to your phone.
              </p>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
