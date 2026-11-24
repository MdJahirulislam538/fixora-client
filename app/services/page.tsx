"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";
import {
  formatServiceMode,
  formatServicePrice,
  getServiceId,
  getServiceTechnician,
  isRequestableService,
  ServiceRecord,
} from "../../components/ServiceData";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [serviceMode, setServiceMode] = useState("");
  const [sort, setSort] = useState("default");

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

  const categories = Array.from(new Set(services.map((service) => service.category).filter(Boolean)));
  const matchingServices = services
    .filter((service) => {
      const technician = getServiceTechnician(service);
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || [
        service.title,
        service.category,
        service.serviceArea,
        technician.name,
      ].some((value) => value?.toLowerCase().includes(query));
      return matchesSearch &&
        (!category || service.category === category) &&
        (!serviceMode || formatServiceMode(service.serviceMode) === serviceMode);
    })
    .sort((left, right) => {
      const leftPrice = Number(left.basePrice ?? left.startingPrice ?? 0);
      const rightPrice = Number(right.basePrice ?? right.startingPrice ?? 0);
      return sort === "price-low" ? leftPrice - rightPrice
        : sort === "price-high" ? rightPrice - leftPrice
        : 0;
    });

  if (isLoading) return <LoadingSkeleton label="Loading services" cards={8} />;

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

          {error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-white p-8 text-center text-sm text-red-700">
              {error}
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
              <h2 className="text-lg font-semibold text-[#172B4D]">No services available right now</h2>
              <p className="mt-2 text-sm text-[#737B87]">
                Please check back soon. New approved services will appear here.
              </p>
              <Link href="/" className="mt-5 inline-flex rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 grid gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-xs font-semibold text-[#454B54] sm:col-span-2 lg:col-span-1">
                  Search services
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Title, category, area, technician"
                    className="mt-1.5 w-full rounded-lg border border-[#D7DCE3] px-3 py-2.5 text-sm font-normal"
                  />
                </label>
                <label className="text-xs font-semibold text-[#454B54]">
                  Category
                  <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#D7DCE3] bg-white px-3 py-2.5 text-sm font-normal">
                    <option value="">All categories</option>
                    {categories.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-[#454B54]">
                  Service mode
                  <select value={serviceMode} onChange={(event) => setServiceMode(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#D7DCE3] bg-white px-3 py-2.5 text-sm font-normal">
                    <option value="">All modes</option>
                    <option value="Home Visit">Home Visit</option>
                    <option value="Shop Drop-off">Shop Drop-off</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-[#454B54]">
                  Sort by price
                  <select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#D7DCE3] bg-white px-3 py-2.5 text-sm font-normal">
                    <option value="default">Recommended</option>
                    <option value="price-low">Lowest first</option>
                    <option value="price-high">Highest first</option>
                  </select>
                </label>
              </div>

              {matchingServices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
                  <h2 className="text-lg font-semibold text-[#172B4D]">No matching services</h2>
                  <p className="mt-2 text-sm text-[#737B87]">Try changing your search or filters.</p>
                  <button type="button" onClick={() => { setSearch(""); setCategory(""); setServiceMode(""); setSort("default"); }} className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {matchingServices.map((service) => {
                const technician = getServiceTechnician(service);
                return (
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
                        <dd className="text-right font-bold text-[#172B4D]">{formatServicePrice(service)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#737B87]">Technician</dt>
                        <dd className="text-right font-medium text-[#172B4D]">{technician.name}</dd>
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
                );
              })}
                </div>
              )}
            </>
          )}
        </section>
      </main>
  );
}
