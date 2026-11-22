import React from "react";
import Link from "next/link";
import { FixoraLogo } from "./FixoraLogo";
import { PhoneIcon, MailIcon, MapPinIcon, ShieldCheckIcon } from "./icons/Icons";

interface FooterProps {
  onSelectService?: (serviceId: string) => void;
  onOpenBooking?: () => void;
  onOpenTracker?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectService,
  onOpenTracker,
}) => {
  return (
    <footer id="footer" className="bg-[#172B4D] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <FixoraLogo variant="dark" size="md" showTagline={true} />
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm pt-2">
              FIXORA is Bangladesh&apos;s trusted on-demand smart device and home appliance repair platform. We connect residential customers with vetted, certified technicians for reliable, transparent, and guaranteed service.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-white">FIXORA Technologies Ltd.</p>
              <p>Registered under Trade License & Consumer Protection Standards</p>
            </div>
          </div>

          {/* Services Column (3 Cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Repair Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { name: "Smartphone Repair", id: "smartphone-tablet" },
                { name: "Laptop & Computer Repair", id: "laptop-computer" },
                { name: "Television & Smart TV Repair", id: "television-repair" },
                { name: "AC Service & Jet Wash", id: "ac-service" },
                { name: "Refrigerator & Freezer Repair", id: "refrigerator-repair" },
                { name: "Washing Machine Repair", id: "washing-machine" },
                { name: "Smart Home & CCTV Installation", id: "smart-home-installation" },
              ].map((s) => (
                <li key={s.id}>
                  {onSelectService ? (
                    <button
                      onClick={() => onSelectService(s.id)}
                      className="hover:text-white transition-colors text-left cursor-pointer"
                    >
                      {s.name}
                    </button>
                  ) : (
                    <Link
                      href={`/services/${encodeURIComponent(s.id)}`}
                      className="hover:text-white transition-colors text-left"
                    >
                      {s.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support Column (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm mb-6">
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#why-choose-us" className="hover:text-white transition-colors">
                  Our Technicians
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:text-white transition-colors">
                  Reviews & Stories
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-white transition-colors text-left"
                >
                  Track Service
                </button>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Direct Assistance
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm">
              <a
                href="tel:+8809612349672"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#F04452]">
                  <PhoneIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Toll-Free Hotline</span>
                  <span className="font-bold text-white">09612-FIXORA</span>
                </div>
              </a>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                  <MailIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Customer Support</span>
                  <span className="text-white">care@fixora.com.bd</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#16A34A] shrink-0 mt-0.5">
                  <MapPinIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Main Operations Hub</span>
                  <span className="text-slate-300">
                    House 42, Road 11, Banani, Dhaka-1213, Bangladesh
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Security reassurance badge */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-[#2563EB]" />
                Authorized cashless bKash, Nagad & Card payment supported.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} FIXORA Ltd. All rights reserved. Repair Smarter. Live Better.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Warranty Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
