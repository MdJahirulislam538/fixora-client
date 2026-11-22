import React from "react";
import {
  ShieldCheckIcon,
  BadgePercentIcon,
  ClockIcon,
  HeadphonesIcon,
} from "./icons/Icons";

export const TrustBar: React.FC = () => {
  const highlights = [
    {
      icon: <ShieldCheckIcon className="w-5 h-5 text-[#2563EB]" />,
      title: "Skilled Technicians",
      subtitle: "Verified trade credentials & background checked",
    },
    {
      icon: <BadgePercentIcon className="w-5 h-5 text-[#F04452]" />,
      title: "Transparent Pricing",
      subtitle: "Itemized quote upfront before repair begins",
    },
    {
      icon: <ClockIcon className="w-5 h-5 text-[#2563EB]" />,
      title: "Convenient Home Service",
      subtitle: "Doorstep diagnostics at your scheduled time",
    },
    {
      icon: <HeadphonesIcon className="w-5 h-5 text-[#16A34A]" />,
      title: "Reliable Customer Support",
      subtitle: "Dedicated post-service follow-up & 90-day warranty",
    },
  ];

  return (
    <section className="bg-[#F5F7FA] border-y border-[#E5E7EB] py-6 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB]">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-start gap-3.5 pt-4 sm:pt-0 ${
                index !== 0 ? "sm:pl-6 lg:pl-8" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 shadow-2xs">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172B4D] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#737B87] mt-0.5 leading-normal">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
