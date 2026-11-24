"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "../../../../app/lib/auth-client";
import {
  formatServicePrice,
  ServicePriceFields,
} from "../../../../components/ServiceData";
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
import { ServiceForm, ServiceFormValue } from "../../../../components/dashboard/ServiceForm";

interface TechnicianService extends Omit<ServiceFormValue, "basePrice">, ServicePriceFields {
  id: string;
  approvalStatus: string;
  isAvailable: boolean;
}

export default function TechnicianServicesPage() {
  const { data: session } = authClient.useSession();
  const [services, setServices] = useState<TechnicianService[]>([]);
  const [editing, setEditing] = useState<TechnicianService | null>(null);
  const [deleting, setDeleting] = useState<TechnicianService | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadServices = useCallback(async () => {
    const result = await dashboardRequest<{ services: TechnicianService[] }>("/api/dashboard/services");
    setServices(result.services);
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await dashboardRequest<{ services: TechnicianService[] }>("/api/dashboard/services");
        if (active) setServices(result.services);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load services.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const saveChanges = async (value: ServiceFormValue) => {
    if (!editing) return;
    await dashboardRequest(`/api/dashboard/services/${encodeURIComponent(editing.id)}`, {
      method: "PATCH",
      body: JSON.stringify(value),
    });
    setEditing(null);
    setNotice("Service updated and sent back for approval.");
    await loadServices();
  };

  const toggleAvailability = async (service: TechnicianService) => {
    setError("");
    try {
      await dashboardRequest(`/api/dashboard/services/${encodeURIComponent(service.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: !service.isAvailable }),
      });
      await loadServices();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Unable to update availability.");
    }
  };

  const deleteService = async () => {
    if (!deleting) return;
    setError("");
    try {
      await dashboardRequest(`/api/dashboard/services/${encodeURIComponent(deleting.id)}`, {
        method: "DELETE",
      });
      setDeleting(null);
      setNotice("Service deleted.");
      await loadServices();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this service.");
    }
  };

  return (
    <div>
      <DashboardPageHeading
        eyebrow="Technician"
        title="My Services"
        description="Edit, remove, and control availability for your service listings."
      />
      {notice && <p role="status" className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      {error && <div className="mb-4"><DashboardError>{error}</DashboardError></div>}
      {isLoading ? (
        <p className="py-10 text-center text-sm text-[#737B87]">Loading services...</p>
      ) : services.length === 0 ? (
        <DashboardEmpty>You haven&apos;t submitted any services yet.</DashboardEmpty>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {services.map((service) => (
              <article key={service.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <ServiceSummary service={service} />
                <ServiceActions service={service} onEdit={() => setEditing(service)} onDelete={() => setDeleting(service)} onToggle={() => void toggleAvailability(service)} />
              </article>
            ))}
          </div>
          <DashboardTable>
            <thead>
              <tr>
                <th className={tableHeaderClass}>Service</th>
                <th className={tableHeaderClass}>Category</th>
                <th className={tableHeaderClass}>Price</th>
                <th className={tableHeaderClass}>Approval</th>
                <th className={tableHeaderClass}>Availability</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className={tableCellClass}>
                    <div className="flex min-w-48 items-center gap-3">
                      {service.image ? <img src={service.image} alt="" className="h-11 w-11 rounded-lg object-cover" /> : <div className="h-11 w-11 rounded-lg bg-slate-100" />}
                      <span className="font-semibold text-[#172B4D]">{service.title}</span>
                    </div>
                  </td>
                  <td className={tableCellClass}>{service.category}</td>
                  <td className={tableCellClass}>{formatServicePrice(service)}</td>
                  <td className={tableCellClass}><StatusBadge value={service.approvalStatus} /></td>
                  <td className={tableCellClass}><AvailabilityToggle service={service} onToggle={() => void toggleAvailability(service)} /></td>
                  <td className={tableCellClass}><ServiceActions service={service} onEdit={() => setEditing(service)} onDelete={() => setDeleting(service)} onToggle={() => void toggleAvailability(service)} compact /></td>
                </tr>
              ))}
            </tbody>
          </DashboardTable>
        </>
      )}

      {editing && session?.user && (
        <Modal title="Edit service" onClose={() => setEditing(null)}>
          <ServiceForm
            initialValue={editing}
            technicianName={session.user.name}
            technicianEmail={session.user.email}
            submitLabel="Save changes"
            onSave={saveChanges}
          />
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete service?" onClose={() => setDeleting(null)}>
          <p className="text-sm text-[#737B87]">Delete {deleting.title}? This cannot be undone.</p>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" className={secondaryButtonClass} onClick={() => setDeleting(null)}>Keep service</button>
            <button type="button" className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700" onClick={() => void deleteService()}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ServiceSummary({ service }: { service: TechnicianService }) {
  return (
    <div className="flex gap-3">
      {service.image ? <img src={service.image} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <div className="h-14 w-14 rounded-lg bg-slate-100" />}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-[#172B4D]">{service.title}</h3>
        <p className="mt-1 text-xs text-[#737B87]">{service.category} · {formatServicePrice(service)}</p>
        <div className="mt-2 flex gap-2"><StatusBadge value={service.approvalStatus} /><StatusBadge value={service.isAvailable ? "available" : "unavailable"} /></div>
      </div>
    </div>
  );
}

function AvailabilityToggle({ service, onToggle }: { service: TechnicianService; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={service.isAvailable}
      onClick={onToggle}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${service.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
    >
      {service.isAvailable ? "Available" : "Unavailable"}
    </button>
  );
}

function ServiceActions({
  service,
  onEdit,
  onDelete,
  onToggle,
  compact = false,
}: {
  service: TechnicianService;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "mt-4"}`}>
      {!compact && <AvailabilityToggle service={service} onToggle={onToggle} />}
      <button type="button" className={`${secondaryButtonClass} px-3 py-1.5 text-xs`} onClick={onEdit}>Edit</button>
      <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50" onClick={onDelete}>Delete</button>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/40 p-4">
      <section role="dialog" aria-modal="true" aria-label={title} className="mx-auto my-6 w-full max-w-3xl rounded-xl bg-white p-5 shadow-xl sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#172B4D]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg px-2 py-1 text-xl text-[#737B87] hover:bg-[#F5F7FA]">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}
