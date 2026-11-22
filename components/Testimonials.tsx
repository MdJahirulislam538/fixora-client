"use client";

import React, { useState } from "react";
import { StarIcon, CheckCircleIcon } from "./icons/Icons";

interface TestimonialItem {
  id: string;
  name: string;
  avatar: string;
  location: string;
  device: string;
  category: "all" | "ac" | "laptop" | "appliance";
  rating: number;
  date: string;
  comment: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Mrs. Farzana Rahman",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    location: "Dhanmondi, Dhaka",
    device: "Gree 1.5 Ton Inverter AC",
    category: "ac",
    rating: 5,
    date: "November 2026",
    comment:
      "Our master bedroom AC stopped cooling right before my daughter's final exams. The technician from FIXORA arrived within 45 minutes, found a minor capacitor fault, replaced it, and tested the temperature thoroughly. Very polite and respectful.",
  },
  {
    id: "2",
    name: "Tanvir Ahmed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    location: "Gulshan-2, Dhaka",
    device: "MacBook Pro 14 (M2)",
    category: "laptop",
    rating: 5,
    date: "October 2026",
    comment:
      "Spilled tea near the keyboard and the system powered off. The technician picked it up with a formal inspection receipt, ultra-cleaned the logic board, and returned it the same evening fully functional. Transparent and professional.",
  },
  {
    id: "3",
    name: "Dr. Kamrul Hasan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    location: "Uttara Sector 7, Dhaka",
    device: "Walton Double-Door Refrigerator",
    category: "appliance",
    rating: 5,
    date: "November 2026",
    comment:
      "The freezer was freezing up while the lower compartment remained warm. He explained the defrost sensor defect clearly and replaced it with genuine parts in 40 minutes without leaving any mess in our kitchen.",
  },
  {
    id: "4",
    name: "Nusrat Jahan",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    location: "Mirpur DOHS, Dhaka",
    device: "Samsung Front-Load Washing Machine",
    category: "appliance",
    rating: 5,
    date: "October 2026",
    comment:
      "Water drainage error stopped our laundry for two days. The technician arrived punctually with the correct pump assembly. Very clean work and provided a 90-day warranty card.",
  },
  {
    id: "5",
    name: "Ashraful Islam",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    location: "Banani, Dhaka",
    device: "Sony Bravia 55\" 4K TV",
    category: "all",
    rating: 5,
    date: "November 2026",
    comment:
      "Audio was coming through but screen was completely black. FIXORA replaced the LED backlight strips with genuine components and color calibrated it. Saved me from buying a new television.",
  },
];

export const Testimonials: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.category === filter || t.category === "all");

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
            CUSTOMER EXPERIENCES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight mb-3">
            The kind of service people remember.
          </h2>
          <p className="text-base sm:text-lg text-[#454B54]">
            Real feedback from households who trusted FIXORA to fix their daily essentials.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {[
            { id: "all", label: "All Reviews" },
            { id: "ac", label: "Air Conditioners" },
            { id: "laptop", label: "Laptops & Computers" },
            { id: "appliance", label: "Home Appliances" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === tab.id
                  ? "bg-[#172B4D] text-white"
                  : "bg-[#F5F7FA] text-[#454B54] hover:bg-slate-200/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#F5F7FA] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div>
                {/* Rating & Device Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {item.device}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-sm text-[#454B54] leading-relaxed mb-6">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              {/* Customer Info Footer */}
              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-white"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#172B4D] flex items-center gap-1">
                      {item.name}
                      <CheckCircleIcon className="w-3.5 h-3.5 text-[#16A34A]" />
                    </h4>
                    <p className="text-[11px] text-[#737B87]">{item.location}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#737B87] font-medium">{item.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
