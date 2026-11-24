"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  formatServiceMode,
  formatServicePrice,
  getServiceTechnician,
  isRequestableService,
  ServiceRecord,
} from "../../../components/ServiceData";
import { RepairRequestForm } from "../../../components/RepairRequestForm";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import { toast } from "sonner";
type LoadState = "loading" | "loaded" | "not-found" | "error";

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceRecord | null>(null);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    const controller = new AbortController();
    const loadService = async () => {
      try {
        const response = await fetch(`/api/services/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        if (response.status === 404) {
          setState("not-found");
          return;
        }
        if (!response.ok) {
          throw new Error("Unable to load this service.");
        }
        const result = await response.json();
        const record: ServiceRecord | null = result.service ?? result;
        if (!record || !isRequestableService(record)) {
          setState("not-found");
          return;
        }
        setService(record);
        setState("loaded");
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setState("error");
          toast.error(loadError instanceof Error ? loadError.message : "Unable to load this service.");
        }
      }
    };

    void loadService();
    return () => controller.abort();
  }, [id]);

  const technician = service ? getServiceTechnician(service) : null;

  if (state === "loading") return <LoadingSkeleton label="Loading service details" cards={1} />;

  return (
      <main className="min-h-screen bg-[#F5F7FA]">
      {state === "not-found" ? (
        <section className="mx-auto max-w-2xl px-4 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">404</p>
          <h1 className="mt-2 text-3xl font-bold text-[#172B4D]">Service not found</h1>
          <p className="mt-3 text-sm text-[#737B87]">
            This service may have been removed or is no longer available.
          </p>
          <Link href="/services" className="mt-6 inline-flex rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
            Browse available services
          </Link>
        </section>
      ) : state === "error" || !service ? (
        <p role="alert" className="mx-auto max-w-7xl px-4 py-12 text-sm text-red-700">
          Unable to load this service. Please try again later.
        </p>
      ) : (
        <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <Link href="/services" className="text-sm font-semibold text-[#2563EB] hover:underline">
            ← All Services
          </Link>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="h-64 bg-slate-100 sm:h-96">
              {service.image && (
                <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-5 sm:p-8">
              <p className="text-sm font-semibold text-[#2563EB]">{service.category}</p>
              <h1 className="mt-2 text-3xl font-bold text-[#172B4D]">{service.title}</h1>
              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#454B54]">{service.description}</p>

              <dl className="mt-6 grid gap-4 rounded-xl bg-[#F5F7FA] p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-xs text-[#737B87]">Starting price</dt>
                  <dd className="mt-1 font-bold text-[#172B4D]">{formatServicePrice(service)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#737B87]">Estimated duration</dt>
                  <dd className="mt-1 font-semibold text-[#172B4D]">{service.estimatedDuration}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#737B87]">Service mode</dt>
                  <dd className="mt-1 font-semibold text-[#172B4D]">{formatServiceMode(service.serviceMode)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#737B87]">Service area</dt>
                  <dd className="mt-1 font-semibold text-[#172B4D]">{service.serviceArea}</dd>
                </div>
              </dl>

              <section className="mt-8 rounded-xl border border-[#E5E7EB] p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {technician?.photo ? (
                    <img src={technician.photo} alt={technician.name} className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <div aria-hidden="true" className="h-16 w-16 rounded-full bg-slate-200" />
                  )}
                  <div>
                    <h2 className="font-bold text-[#172B4D]">{technician?.name}</h2>
                    {technician?.area && <p className="mt-1 text-sm text-[#737B87]">{technician.area}</p>}
                    {technician?.bio && <p className="mt-2 text-sm leading-5 text-[#454B54]">{technician.bio}</p>}
                  </div>
                </div>
              </section>

              <Link
                href="#request-repair"
                className="mt-6 inline-flex rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
              >
                Request Repair
              </Link>
            </div>
          </div>
          <div id="request-repair" className="scroll-mt-8">
            <RepairRequestForm service={service} />
          </div>
        </article>
      )}
      </main>
  );
}
