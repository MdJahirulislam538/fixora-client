"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DashboardEmpty,
  DashboardError,
  DashboardPageHeading,
  DashboardTable,
  StatusBadge,
  secondaryButtonClass,
  tableCellClass,
  tableHeaderClass,
} from "../../../../components/dashboard/DashboardComponents";
import { dashboardRequest } from "../../../../components/dashboard/api";
import {
  formatServicePrice,
  getServiceTechnician,
  ServicePriceFields,
  ServiceTechnicianFields,
} from "../../../../components/ServiceData";

interface Service extends ServicePriceFields, ServiceTechnicianFields {
  id: string;
  title: string;
  category: string;
  image: string;
  approvalStatus: string;
  isAvailable: boolean;
}

const filters = ["pending", "approved", "rejected", "all"];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState("pending");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");

  const loadServices = useCallback(async () => {
    const query = filter === "all" ? "" : `?approvalStatus=${encodeURIComponent(filter)}`;
    const result = await dashboardRequest<{ services: Service[] }>(`/api/dashboard/services${query}`);
    setServices(result.services);
  }, [filter]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const query = filter === "all" ? "" : `?approvalStatus=${encodeURIComponent(filter)}`;
        const result = await dashboardRequest<{ services: Service[] }>(`/api/dashboard/services${query}`);
        if (active) setServices(result.services);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load services.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [filter]);

  const review = async (service: Service, approvalStatus: "approved" | "rejected") => {
    setWorkingId(service.id);
    setError("");
    try {
      await dashboardRequest(`/api/dashboard/services/${encodeURIComponent(service.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
      });
      setNotice(`${service.title} ${approvalStatus}.`);
      await loadServices();
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Unable to update service approval.");
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div>
      <DashboardPageHeading eyebrow="Admin" title="Service Approval" description="Review technician submissions and control which services are public." />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter services">
        {filters.map((status) => (
          <button type="button" key={status} aria-pressed={filter === status} onClick={() => { setFilter(status); setLoading(true); }} className={`rounded-full px-3.5 py-2 text-xs font-semibold capitalize ${filter === status ? "bg-[#2563EB] text-white" : "border border-[#E5E7EB] bg-white text-[#454B54]"}`}>
            {status === "all" ? "All" : status}
          </button>
        ))}
      </div>
      {notice && <p role="status" className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      {error && <div className="mb-4"><DashboardError>{error}</DashboardError></div>}
      {loading ? (
        <p className="py-10 text-center text-sm text-[#737B87]">Loading service submissions...</p>
      ) : services.length === 0 ? (
        <DashboardEmpty>No services in this approval category.</DashboardEmpty>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {services.map((service) => {
              const technician = getServiceTechnician(service);
              return (
                <article key={service.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                  <div className="flex gap-3">
                    {service.image ? <img src={service.image} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <div className="h-14 w-14 rounded-lg bg-slate-100" />}
                    <div className="min-w-0"><h3 className="font-semibold text-[#172B4D]">{service.title}</h3><p className="text-xs text-[#737B87]">{service.category} · {technician.name}</p></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between"><StatusBadge value={service.approvalStatus} /><span className="font-semibold">{formatServicePrice(service)}</span></div>
                  <ReviewActions service={service} working={workingId === service.id} onReview={(status) => void review(service, status)} />
                </article>
              );
            })}
          </div>
          <DashboardTable>
            <thead><tr><th className={tableHeaderClass}>Service</th><th className={tableHeaderClass}>Technician</th><th className={tableHeaderClass}>Price</th><th className={tableHeaderClass}>Status</th><th className={tableHeaderClass}>Availability</th><th className={tableHeaderClass}>Review</th></tr></thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {services.map((service) => {
                const technician = getServiceTechnician(service);
                return (
                  <tr key={service.id}>
                    <td className={tableCellClass}><div className="flex min-w-48 items-center gap-3">{service.image ? <img src={service.image} alt="" className="h-11 w-11 rounded-lg object-cover" /> : <div className="h-11 w-11 rounded-lg bg-slate-100" />}<div><p className="font-semibold text-[#172B4D]">{service.title}</p><p className="text-xs text-[#737B87]">{service.category}</p></div></div></td>
                    <td className={tableCellClass}>{technician.name}<span className="mt-1 block text-xs text-[#737B87]">{service.technicianEmail || service.technician?.email}</span></td>
                    <td className={tableCellClass}>{formatServicePrice(service)}</td>
                    <td className={tableCellClass}><StatusBadge value={service.approvalStatus} /></td>
                    <td className={tableCellClass}>{service.isAvailable ? "Available" : "Unavailable"}</td>
                    <td className={tableCellClass}><ReviewActions service={service} working={workingId === service.id} onReview={(status) => void review(service, status)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </DashboardTable>
        </>
      )}
    </div>
  );
}

function ReviewActions({
  service,
  working,
  onReview,
}: {
  service: Service;
  working: boolean;
  onReview: (status: "approved" | "rejected") => void;
}) {
  if (service.approvalStatus !== "pending") return <p className="mt-3 text-xs text-[#737B87]">Already reviewed</p>;
  return (
    <div className="mt-3 flex gap-2">
      <button type="button" disabled={working} onClick={() => onReview("approved")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{working ? "Saving..." : "Approve"}</button>
      <button type="button" disabled={working} onClick={() => onReview("rejected")} className={`${secondaryButtonClass} border-red-200 px-3 py-2 text-xs text-red-700`}>Reject</button>
    </div>
  );
}
