"use client";

import React, { useState } from "react";
import {
  SmartphoneIcon,
  LaptopIcon,
  TvIcon,
  AirVentIcon,
  RefrigeratorIcon,
  WashingMachineIcon,
  MicrowaveIcon,
  SmartHomeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from "./icons/Icons";

export interface ServiceCategoryItem {
  id: string;
  title: string;
  categoryGroup: "smart" | "major" | "kitchen" | "security";
  icon: React.ReactNode;
  image: string;
  description: string;
  services: string[];
  duration: string;
  startingPrice: string;
  popular?: boolean;
}

export const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  {
    id: "smartphone-tablet",
    title: "Smartphone & Tablet Repair",
    categoryGroup: "smart",
    icon: <SmartphoneIcon className="w-5 h-5 text-[#2563EB]" />,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=700&q=80",
    description:
      "Precision diagnosis and repairs for all major smartphone and tablet brands by certified technicians using original or top-tier OEM parts.",
    services: [
      "Screen replacement",
      "Battery replacement",
      "Charging port problems",
      "Software & OS troubleshooting",
      "Hardware board diagnostics",
    ],
    duration: "45–90 mins (Doorstep or Lab)",
    startingPrice: "৳450",
    popular: true,
  },
  {
    id: "laptop-computer",
    title: "Laptop & Computer Repair",
    categoryGroup: "smart",
    icon: <LaptopIcon className="w-5 h-5 text-[#2563EB]" />,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80",
    description:
      "Comprehensive hardware and operating system solutions for Windows, MacBook, desktops, and office workstations.",
    services: [
      "Hardware diagnostics",
      "Thermal cleaning & cooling paste",
      "RAM & SSD upgrades",
      "Liquid damage recovery",
      "Motherboard chip-level fix",
    ],
    duration: "1–3 hours",
    startingPrice: "৳650",
  },
  {
    id: "ac-service",
    title: "Air Conditioner Service & Repair",
    categoryGroup: "major",
    icon: <AirVentIcon className="w-5 h-5 text-[#2563EB]" />,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80",
    description:
      "Thorough jet wash servicing, gas leak pressure checks, compressor diagnosis, and safe relocation/installation.",
    services: [
      "Deep master jet cleaning",
      "Cooling & refrigerant recharge",
      "PCB circuit repair",
      "Water drainage leakage",
      "Split/Inverter uninstallation",
    ],
    duration: "60–90 mins at home",
    startingPrice: "৳800",
    popular: true,
  },
  {
    id: "refrigerator-repair",
    title: "Refrigerator & Deep Freezer",
    categoryGroup: "major",
    icon: <RefrigeratorIcon className="w-5 h-5 text-[#2563EB]" />,
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=700&q=80",
    description:
      "Fast response home diagnosis for cooling failures, defrost malfunctions, compressor relay faults, and gas line inspection.",
    services: [
      "Cooling issue diagnosis",
      "Compressor replacement",
      "Thermostat & sensor repair",
      "Door gasket replacement",
      "Gas refill & leak brazing",
    ],
    duration: "1–2 hours at home",
    startingPrice: "৳700",
  },
  {
    id: "washing-machine",
    title: "Washing Machine Repair",
    categoryGroup: "major",
    icon: <WashingMachineIcon className="w-5 h-5 text-[#2563EB]" />,
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=700&q=80",
    description:
      "Expert servicing for front-load, top-load, and semi-automatic washers from LG, Samsung, Walton, Whirlpool, and Singer.",
    services: [
      "Drainage pump malfunction",
      "Drum bearing & motor noise",
      "Spin cycle failure",
      "Control board errors",
      "Vibration dampening overhaul",
    ],
    duration: "1–2 hours",
    startingPrice: "৳650",
  },
  {
    id: "television-repair",
    title: "Television & Smart TV Repair",
    categoryGroup: "smart",
    icon: <TvIcon className="w-5 h-5 text-[#2563EB]" />,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=700&q=80",
    description:
      "Reliable servicing for LED, OLED, QLED, and 4K Smart TVs with original backlight strips, power supplies, and logic boards.",
    services: [
      "No picture / black screen",
      "LED backlight strip replacement",
      "Power board troubleshooting",
      "Sound without display fix",
      "Smart TV firmware & ports",
    ],
    duration: "Doorstep test / Lab fix",
    startingPrice: "৳750",
  },
  {
    id: "home-appliance",
    title: "Home Appliance Repair",
    categoryGroup: "kitchen",
    icon: <MicrowaveIcon className="w-5 h-5 text-[#2563EB]" />,
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=700&q=80",
    description:
      "Restore your daily kitchen essentials: microwave ovens, induction cookers, water purifiers, and vacuum cleaners.",
    services: [
      "Microwave heating magnetron",
      "Touchpad & panel repair",
      "Electric kettle & blender motors",
      "Voltage stabilizer diagnosis",
      "Small appliance wiring safety",
    ],
    duration: "45–75 mins",
    startingPrice: "৳500",
  },
  {
    id: "smart-home-installation",
    title: "Smart Home & CCTV Installation",
    categoryGroup: "security",
    icon: <SmartHomeIcon className="w-5 h-5 text-[#2563EB]" />,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=700&q=80",
    description:
      "Modernize your residential security and comfort with smart locks, IP security cameras, video doorbells, and mesh Wi-Fi.",
    services: [
      "HD CCTV & IP Camera setup",
      "Smart digital door locks",
      "Wi-Fi range extension",
      "Smart switch & lighting hub",
      "Mobile security app sync",
    ],
    duration: "2–4 hours",
    startingPrice: "৳1,200",
  },
];

interface ServiceCategoriesProps {
  onSelectService: (service: ServiceCategoryItem) => void;
  onBookService: (serviceId: string) => void;
}

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  onSelectService,
  onBookService,
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filterTabs = [
    { id: "all", label: "All Categories" },
    { id: "smart", label: "Phones & Computing" },
    { id: "major", label: "AC & Major Appliances" },
    { id: "kitchen", label: "Kitchen & Home" },
    { id: "security", label: "Smart Home & CCTV" },
  ];

  const filteredCategories =
    activeTab === "all"
      ? SERVICE_CATEGORIES
      : SERVICE_CATEGORIES.filter((c) => c.categoryGroup === activeTab);

  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
            WHAT WE TAKE CARE OF
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight mb-4">
            Expert care for the devices you depend on.
          </h2>
          <p className="text-base sm:text-lg text-[#454B54] leading-relaxed">
            Whether it&apos;s a device you use every day or an appliance that keeps your home running, our technicians are ready to help.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-[#E5E7EB]">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-[#F5F7FA] text-[#454B54] hover:bg-slate-200/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCategories.map((item, index) => {
            // Give specific cards subtle editorial distinction
            const isFeatured = item.popular && index === 0;

            return (
              <div
                key={item.id}
                className={`group flex flex-col bg-white border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-blue-200 ${
                  isFeatured ? "border-blue-300 ring-1 ring-blue-100" : "border-[#E5E7EB]"
                }`}
              >
                {/* Natural Authentic Photograph with subtle crop */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-white/95 backdrop-blur-xs text-[#2563EB] shadow-xs">
                      {item.icon}
                    </span>
                    {item.popular && (
                      <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#F04452] rounded-md shadow-xs">
                        High Demand
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-[#172B4D] shadow-xs flex items-center gap-1">
                    <ClockIcon className="w-3 h-3 text-[#2563EB]" />
                    {item.duration}
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#172B4D] group-hover:text-[#2563EB] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#737B87] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Service Checklist */}
                  <div className="mb-5 space-y-1.5 flex-1">
                    <p className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wide">
                      Common Services:
                    </p>
                    <ul className="space-y-1 text-xs text-[#454B54]">
                      {item.services.slice(0, 3).map((s) => (
                        <li key={s} className="flex items-center gap-1.5">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                      {item.services.length > 3 && (
                        <li className="text-[11px] text-[#737B87] pl-5">
                          + {item.services.length - 3} more specialized fixes
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Card Footer: Starting Price & Actions */}
                  <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#737B87] block">
                        Inspection starts at
                      </span>
                      <span className="text-base font-bold text-[#172B4D]">
                        {item.startingPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectService(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onBookService(item.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-2xs cursor-pointer"
                      >
                        Book
                        <ArrowRightIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
