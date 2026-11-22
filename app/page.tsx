"use client";

import React, { useState } from "react";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import {
  ServiceCategories,
  ServiceCategoryItem,
} from "../components/ServiceCategories";
import { HumanConnection } from "../components/HumanConnection";
import { HowItWorks } from "../components/HowItWorks";
import { BookingSection } from "../components/BookingSection";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Testimonials } from "../components/Testimonials";
import { ServiceLocations } from "../components/ServiceLocations";
import { AboutSection } from "../components/AboutSection";
import { FAQSection } from "../components/FAQSection";
import { CallToAction } from "../components/CallToAction";
import { ServiceDetailModal } from "../components/ServiceDetailModal";
import { TrackServiceModal } from "../components/TrackServiceModal";

export default function Home() {
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<ServiceCategoryItem | null>(null);
  const [bookingCategory, setBookingCategory] = useState<string>("ac-service");
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  // Smooth scroll to booking section
  const scrollToBooking = (categoryId?: string) => {
    if (categoryId) {
      setBookingCategory(categoryId);
    }
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById("services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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

        {/* 8. Service Categories Section */}
        <ServiceCategories
          onSelectService={(service) => setSelectedServiceForModal(service)}
          onBookService={(serviceId) => scrollToBooking(serviceId)}
        />

        {/* 9. Human Connection Section ("SERVICE IS PERSONAL") */}
        <HumanConnection />

        {/* 10. How It Works */}
        <HowItWorks />

        {/* 11. Booking Section */}
        <BookingSection
          key={bookingCategory}
          preselectedCategory={bookingCategory}
          onClearPreselectedCategory={() => setBookingCategory("ac-service")}
        />

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


      {/* Interactive Modals */}
      <ServiceDetailModal
        service={selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
        onBookThis={(serviceId) => scrollToBooking(serviceId)}
      />

      <TrackServiceModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

    </div>
  );
}
