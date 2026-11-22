import React from "react";

interface FixoraLogoProps {
  variant?: "light" | "dark" | "blue";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const FixoraLogo: React.FC<FixoraLogoProps> = ({
  variant = "light", // 'light' is for white/light backgrounds, 'dark' for navy/dark backgrounds
  showTagline = false,
  size = "md",
  className = "",
}) => {
  const isDark = variant === "dark";

  const sizeClasses = {
    sm: {
      mark: "w-7 h-7",
      title: "text-lg",
      tagline: "text-[9px]",
    },
    md: {
      mark: "w-9 h-9",
      title: "text-2xl",
      tagline: "text-[11px]",
    },
    lg: {
      mark: "w-12 h-12",
      title: "text-3xl",
      tagline: "text-xs",
    },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Bespoke Geometric Brand Mark: House Roofline + Tech Hex Nut + Coral Precision Spark */}
      <div className={`relative flex items-center justify-center ${sizeClasses.mark} rounded-xl shadow-xs transition-transform hover:scale-105`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Base rounded shield container */}
          <rect
            width="40"
            height="40"
            rx="10"
            fill={isDark ? "#2563EB" : "#2563EB"}
          />
          {/* Subtle geometric precision facets */}
          <path
            d="M20 7L31 15.5V28.5L20 34.5L9 28.5V15.5L20 7Z"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Home Gable & Precision Wrench Junction */}
          <path
            d="M13 18L20 12L27 18V26C27 27.1046 26.1046 28 25 28H15C13.8954 28 13 27.1046 13 26V18Z"
            fill="white"
          />
          {/* Center wrench slot / keyway */}
          <path
            d="M20 18V24M17.5 20H22.5"
            stroke="#2563EB"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Coral Vitality & Care Accent Dot */}
          <circle cx="28" cy="12" r="3.5" fill="#F04452" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Wordmark and Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none">
          <span
            className={`font-black tracking-tight ${sizeClasses.title} ${
              isDark ? "text-white" : "text-[#172B4D]"
            }`}
          >
            FIX
          </span>
          <span
            className={`font-black tracking-tight ${sizeClasses.title} text-[#2563EB]`}
          >
            ORA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F04452] ml-0.5 inline-block" />
        </div>
        {showTagline && (
          <span
            className={`font-medium tracking-normal mt-0.5 ${sizeClasses.tagline} ${
              isDark ? "text-slate-300" : "text-[#737B87]"
            }`}
          >
            Repair Smarter. Live Better.
          </span>
        )}
      </div>
    </div>
  );
};
