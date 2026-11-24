"use client";

import React, { useState } from "react";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { LandingServices } from "../components/LandingServices";
import { HumanConnection } from "../components/HumanConnection";
import { HowItWorks } from "../components/HowItWorks";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Testimonials } from "../components/Testimonials";
import { ServiceLocations } from "../components/ServiceLocations";
import { AboutSection } from "../components/AboutSection";
import { FAQSection } from "../components/FAQSection";
import { CallToAction } from "../components/CallToAction";
import { TrackServiceModal } from "../components/TrackServiceModal";

export default function Home() {
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const scrollToBooking = () => {
    document.getElementById("landing-services")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    document.getElementById("landing-services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#454B54]">
      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 6. Hero Section */}
        <Hero
          onBookClick={() => scrollToBooking()}
          onExploreClick={scrollToServices}
        />

        {/* 7. Trust Indicators */}
        <TrustBar />

        {/* Approved services available to book */}
        <LandingServices />

        {/* 9. Human Connection Section ("SERVICE IS PERSONAL") */}
        <HumanConnection />

        {/* 10. How It Works */}
        <HowItWorks />

        {/* 12. Why Choose FIXORA */}
        <WhyChooseUs />

        {/* 14. Service Location & Availability Section */}
        <ServiceLocations
          onBookInArea={() => {
            scrollToBooking();
          }}
        />

        {/* 13. Customer Testimonials */}
        <Testimonials />

        {/* 15. About FIXORA */}
        <AboutSection />

        {/* FAQs Section */}
        <FAQSection />

        {/* 16. Call to Action */}
        <CallToAction
          onBookClick={() => scrollToBooking()}
          onContactClick={() => {
            const footerEl = document.getElementById("footer");
            if (footerEl) footerEl.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </main>


      <TrackServiceModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

    </div>
  );
}
