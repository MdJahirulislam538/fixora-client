"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatServiceMode,
  formatStartingPrice,
  getServiceId,
  isRequestableService,
  ServiceRecord,
} from "../../components/ServiceData";


export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadServices = async () => {
      try {
        const response = await fetch(
          "/api/services?approvalStatus=approved&isAvailable=true",
          { signal: controller.signal },
        );
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
        setServices(records.filter(isRequestableService));
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load services. Please try again later.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadServices();
    return () => controller.abort();
  }, []);

  return (
      <main className="min-h-screen bg-[#F5F7FA]">
        <section id="service-list" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">Find trusted help</p>
            <h1 className="mt-2 text-3xl font-bold text-[#172B4D] sm:text-4xl">Browse Services</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#737B87] sm:text-base">
              Explore currently available repair services from FIXORA technicians.
            </p>
          </div>

          {isLoading ? (
            <p className="rounded-xl border border-[#E5E7EB] bg-white p-8 text-center text-sm text-[#737B87]">
              Loading services...
            </p>
          ) : error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-white p-8 text-center text-sm text-red-700">
              {error}
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
              <h2 className="text-lg font-semibold text-[#172B4D]">No services available right now</h2>
              <p className="mt-2 text-sm text-[#737B87]">
                Please check back soon. New approved services will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service) => (
                <article
                  key={getServiceId(service)}
                  className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="h-48 bg-slate-100">
                    {service.image ? (
                      <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#737B87]">
                        Service image unavailable
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-bold text-[#172B4D]">{service.title}</h2>
                    <p className="mt-1 text-sm text-[#737B87]">{service.category}</p>
                    <dl className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#737B87]">Service mode</dt>
                        <dd className="text-right font-medium text-[#172B4D]">{formatServiceMode(service.serviceMode)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#737B87]">Service area</dt>
                        <dd className="text-right font-medium text-[#172B4D]">{service.serviceArea}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#737B87]">Starting price</dt>
                        <dd className="text-right font-bold text-[#172B4D]">{formatStartingPrice(service.startingPrice)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#737B87]">Technician</dt>
                        <dd className="text-right font-medium text-[#172B4D]">{service.technician.name}</dd>
                      </div>
                    </dl>
                    <Link
                      href={`/services/${encodeURIComponent(getServiceId(service))}`}
                      className="mt-5 inline-flex justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
  );
}
