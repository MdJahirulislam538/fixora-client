"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FixoraLogo } from "./FixoraLogo";
import {
  PhoneIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserIcon,
} from "./icons/Icons";

interface NavbarProps {
  onOpenBooking?: (category?: string) => void;
  onOpenTracker?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenTracker,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    // { label: "How It Works", href: "#how-it-works" },
    // { label: "Why Us", href: "#why-choose-us" },
    // { label: "Locations", href: "#locations" },
    // { label: "Testimonials", href: "#testimonials" },
    { label: "About Us", href: "/#about" },
    // { label: "Contact", href: "#footer" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const openBooking = (category?: string) => {
    if (onOpenBooking) {
      onOpenBooking(category);
    } else if (pathname === "/") {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#booking");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-[#172B4D] text-white text-xs py-2 px-4 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              Verified Technicians active across Dhaka, Chattogram & Sylhet
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ClockIcon className="w-3.5 h-3.5 text-blue-400" />
              Service Hours: 8:00 AM – 9:30 PM (7 Days)
            </span>
          </div>

          <div className="flex items-center gap-5 text-slate-200">
            <span className="flex items-center gap-1.5 text-xs">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-[#2563EB]" />
              90-Day Repair Guarantee
            </span>
            <button
              onClick={onOpenTracker}
              className="text-xs hover:text-white transition-colors underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <SearchIcon className="w-3 h-3 text-[#F04452]" />
              Track Existing Repair
            </button>
            <a
              href="tel:+8809612349672"
              className="flex items-center gap-1.5 font-semibold text-white bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-md transition-colors"
            >
              <PhoneIcon className="w-3 h-3 text-[#F04452]" />
              Hotline: 09612-FIXORA
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between border-b ${
          isScrolled ? "border-[#E5E7EB] shadow-xs" : "border-slate-100"
        }`}
      >
        {/* Left: FIXORA Logo */}
        <Link href="/" className="flex items-center focus:outline-none" onClick={() => setMobileMenuOpen(false)}>
          <FixoraLogo variant="light" size="md" showTagline={true} />
        </Link>

        {/* Center: Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-[#454B54]">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`transition-colors py-1 focus:outline-none ${
                  isActiveLink(link.href)
                    ? "text-[#2563EB]"
                    : "text-[#454B54] hover:text-[#2563EB]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenTracker}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#172B4D] hover:text-[#2563EB] bg-[#F5F7FA] hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
          >
            <SearchIcon className="w-3.5 h-3.5 text-[#2563EB]" />
            Track Repair
          </button>

          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#172B4D] hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer"
          >
            <UserIcon className="w-4 h-4 text-slate-500" />
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-[#2563EB] border border-[#2563EB]/30 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Sign Up
          </Link>

          <button
            onClick={() => openBooking()}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] rounded-lg transition-all shadow-xs cursor-pointer"
          >
            Book a Repair
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => openBooking()}
            className="sm:hidden px-3 py-1.5 text-xs font-semibold text-white bg-[#2563EB] rounded-md"
          >
            Book Repair
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg text-[#172B4D] hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <XIcon className="w-6 h-6 text-[#172B4D]" />
            ) : (
              <MenuIcon className="w-6 h-6 text-[#172B4D]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] px-5 py-5 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3 text-base font-medium text-[#172B4D]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-md transition-colors ${
                  isActiveLink(link.href)
                    ? "bg-[#EFF6FF] text-[#2563EB]"
                    : "hover:bg-[#F5F7FA] hover:text-[#2563EB]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracker?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-[#172B4D] bg-[#F5F7FA] rounded-lg"
              >
                <SearchIcon className="w-4 h-4 text-[#2563EB]" />
                Track Ongoing Repair
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBooking();
                }}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg text-center"
              >
                Book a Repair Now
              </button>

              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-sm font-semibold text-[#172B4D] border border-[#E5E7EB] rounded-lg text-center"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-sm font-semibold text-[#2563EB] border border-blue-200 rounded-lg text-center"
              >
                Sign Up
              </Link>

              <a
                href="tel:+8809612349672"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-[#172B4D] border border-[#E5E7EB] rounded-lg text-center"
              >
                <PhoneIcon className="w-3.5 h-3.5 text-[#F04452]" />
                Hotline: 09612-FIXORA
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
