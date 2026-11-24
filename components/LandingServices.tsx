"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatServiceMode,
  formatServicePrice,
  getServicePrice,
  getServiceId,
  getServiceTechnician,
  isRequestableService,
  ServiceRecord,
} from "./ServiceData";
import { RepairRequestForm } from "./RepairRequestForm";
import { toast } from "sonner";

export function LandingServices() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("recommended");

  useEffect(() => {
    const controller = new AbortController();
    const loadServices = async () => {
      try {
        const response = await fetch("/api/services?includeUnavailable=true", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Services are unavailable right now. Please try again later.");
        }
        const result = await response.json();
        const records: ServiceRecord[] = Array.isArray(result)
          ? result
          : result.services;
        if (!Array.isArray(records)) {
          throw new Error("The services response was not in the expected format.");
        }
        setServices(records.filter((service) => service.approvalStatus === "approved"));
      } catch (loadError) {
        if (!controller.signal.aborted) {
          const message = loadError instanceof Error
            ? loadError.message
            : "Unable to load services. Please try again later.";
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadServices();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedService) {
      document.getElementById("landing-booking-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedService]);

  const displayedServices = [...services].sort((left, right) => {
    if (sortOrder === "category") {
      return left.category.localeCompare(right.category, undefined, { sensitivity: "base" }) ||
        left.title.localeCompare(right.title, undefined, { sensitivity: "base" });
    }

    const leftPrice = Number(String(getServicePrice(left)).replace(/[^\d.-]/g, "")) || 0;
    const rightPrice = Number(String(getServicePrice(right)).replace(/[^\d.-]/g, "")) || 0;
    return sortOrder === "price-low"
      ? leftPrice - rightPrice
      : sortOrder === "price-high"
        ? rightPrice - leftPrice
        : 0;
  });

  return (
    <section
      id="landing-services"
      className="scroll-mt-20 border-y border-[#E5E7EB] bg-[#F5F7FA] py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
              Book a trusted technician
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#172B4D] sm:text-4xl">
              Available Repair Services
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#737B87] sm:text-base">
              Choose an approved service to submit a repair request.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label htmlFor="landing-service-sort" className="flex items-center gap-2 text-sm font-semibold text-[#454B54]">
              Sort by
              <select
                id="landing-service-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="rounded-lg border border-[#D7DCE3] bg-white px-3 py-2 text-sm font-normal"
              >
                <option value="recommended">Recommended</option>
                <option value="category">Category (A–Z)</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
            <Link
              href="/services"
              className="text-sm font-semibold text-[#2563EB] hover:underline"
            >
              Browse all services
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div aria-busy="true" aria-label="Loading services" className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                <div className="h-48 bg-slate-200" />
                <div className="space-y-3 p-5"><div className="h-5 w-3/4 rounded bg-slate-200" /><div className="h-4 w-1/2 rounded bg-slate-100" /><div className="h-10 rounded-lg bg-blue-50" /></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-white p-8 text-center text-sm text-red-700">
            {error}
          </p>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-[#172B4D]">
              No services available right now
            </h3>
            <p className="mt-2 text-sm text-[#737B87]">
              Approved services will appear here. Please check back soon.
            </p>
            <Link href="/services" className="mt-5 inline-flex rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
              Browse services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedServices.map((service) => {
              const isAvailable = isRequestableService(service);
              const technician = getServiceTechnician(service);
              return (
                <article
                  key={getServiceId(service)}
                  className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm"
                >
                <div className="h-48 bg-slate-100">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#737B87]">
                      Service image unavailable
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-[#172B4D]">{service.title}</h3>
                    {!isAvailable && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                        Currently unavailable
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[#737B87]">{service.category}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-[#737B87]">Service mode</dt>
                      <dd className="text-right font-medium text-[#172B4D]">
                        {formatServiceMode(service.serviceMode)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-[#737B87]">Service area</dt>
                      <dd className="text-right font-medium text-[#172B4D]">
                        {service.serviceArea}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-[#737B87]">Starting price</dt>
                      <dd className="text-right font-bold text-[#172B4D]">
                        {formatServicePrice(service)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-[#737B87]">Technician</dt>
                      <dd className="text-right font-medium text-[#172B4D]">
                        {technician.name}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {isAvailable ? (
                      <>
                        <Link
                          href={`/services/${encodeURIComponent(getServiceId(service))}`}
                          className="inline-flex justify-center rounded-lg border border-[#2563EB] px-3 py-2.5 text-sm font-semibold text-[#2563EB] hover:bg-[#EFF6FF]"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedService(service)}
                          className="rounded-lg bg-[#2563EB] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
                        >
                          Book Service
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="col-span-2 cursor-not-allowed rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-500"
                      >
                        Booking unavailable
                      </button>
                    )}
                  </div>
                </div>
                </article>
              );
            })}
          </div>
        )}

        {selectedService && (
          <section
            id="landing-booking-form"
            className="mt-10 scroll-mt-20 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                  Selected service
                </p>
                <h3 className="mt-1 text-xl font-bold text-[#172B4D]">
                  {selectedService.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="text-sm font-semibold text-[#737B87] hover:text-[#172B4D]"
              >
                Choose another service
              </button>
            </div>
            <RepairRequestForm service={selectedService} />
          </section>
        )}
      </div>
    </section>
  );
}
