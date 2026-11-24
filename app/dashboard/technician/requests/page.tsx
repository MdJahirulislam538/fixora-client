"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  DashboardEmpty,
  DashboardError,
  DashboardLoading,
  DashboardPageHeading,
  DashboardTable,
  StatusBadge,
  secondaryButtonClass,
  tableCellClass,
  tableHeaderClass,
} from "../../../../components/dashboard/DashboardComponents";
import { dashboardRequest } from "../../../../components/dashboard/api";

interface TechnicianBooking {
  id: string;
  customerName: string;
  customerPhone?: string;
  phone?: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  serviceTitle: string;
  basePrice: number;
  finalAmount?: number;
  status: string;
}

const filters = ["all", "requested", "accepted", "in-progress", "completed"];
const actionMap: Record<string, { label: string; status: string }[]> = {
  requested: [
    { label: "Accept", status: "accepted" },
    { label: "Reject", status: "rejected" },
  ],
  accepted: [{ label: "Start job", status: "in-progress" }],
  "in-progress": [{ label: "Mark completed", status: "completed" }],
};

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<TechnicianBooking[]>([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [rejectTarget, setRejectTarget] = useState<TechnicianBooking | null>(null);

  const loadBookings = useCallback(async () => {
    const result = await dashboardRequest<{ bookings: TechnicianBooking[] }>("/api/dashboard/requests");
    setBookings(result.bookings);
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await dashboardRequest<{ bookings: TechnicianBooking[] }>("/api/dashboard/requests");
        if (active) setBookings(result.bookings);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load requests.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async (
    booking: TechnicianBooking,
    status: string,
    finalAmount?: number,
  ): Promise<boolean> => {
    setError("");
    setWorkingId(booking.id);
    try {
      await dashboardRequest(`/api/dashboard/requests/${encodeURIComponent(booking.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status, ...(finalAmount !== undefined ? { finalAmount } : {}) }),
      });
      await loadBookings();
      toast.success(status === "completed" ? "Job marked completed." : status === "in-progress" ? "Job started." : `Request ${status}.`);
      return true;
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update this request.");
      return false;
    } finally {
      setWorkingId("");
    }
  };

  const requestStatusUpdate = (booking: TechnicianBooking, status: string, finalAmount?: number) => {
    if (status === "rejected") {
      setRejectTarget(booking);
      return;
    }
    void updateStatus(booking, status, finalAmount);
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    if (await updateStatus(rejectTarget, "rejected")) setRejectTarget(null);
  };

  const visibleBookings = filter === "all"
    ? bookings
    : bookings.filter((booking) => booking.status === filter);

  return (
    <div>
      <DashboardPageHeading
        eyebrow="Technician"
        title="Manage Requests"
        description="Review customer repair requests and move each job through its valid statuses."
      />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter requests by status">
        {filters.map((status) => (
          <button
            type="button"
            key={status}
            onClick={() => setFilter(status)}
            aria-pressed={filter === status}
            className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
              filter === status ? "bg-[#2563EB] text-white" : "border border-[#E5E7EB] bg-white text-[#454B54] hover:bg-slate-50"
            }`}
          >
            {status === "all" ? "All" : status === "in-progress" ? "In Progress" : status[0].toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      {error && <div className="mb-4"><DashboardError>{error}</DashboardError></div>}
      {isLoading ? (
        <DashboardLoading label="Loading requests" />
      ) : visibleBookings.length === 0 ? (
        <DashboardEmpty action={bookings.length === 0
          ? <Link href="/dashboard/technician/add-service" className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Add a service</Link>
          : <button type="button" onClick={() => setFilter("all")} className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Show all requests</button>}>
          {bookings.length === 0 ? "You don't have any repair requests yet." : "No requests match this status."}
        </DashboardEmpty>
      ) : (
        <>
          <div className="space-y-4 md:hidden">
            {visibleBookings.map((booking) => (
              <article key={booking.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-[#172B4D]">{booking.customerName}</h3>
                  <StatusBadge value={booking.status} />
                </div>
                <p className="mt-2 text-sm text-[#454B54]">{booking.serviceTitle}</p>
                <dl className="mt-3 space-y-2 text-xs text-[#737B87]">
                  <div><dt className="inline font-semibold">Phone: </dt><dd className="inline">{booking.customerPhone || booking.phone}</dd></div>
                  <div><dt className="inline font-semibold">Address: </dt><dd className="inline">{booking.address}</dd></div>
                  <div><dt className="inline font-semibold">Preferred date: </dt><dd className="inline">{new Date(booking.preferredDate).toLocaleDateString()}</dd></div>
                </dl>
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-[#454B54]">{booking.problemDescription}</p>
                <RequestActions booking={booking} working={workingId === booking.id} onUpdate={(status, amount) => requestStatusUpdate(booking, status, amount)} />
              </article>
            ))}
          </div>
          <DashboardTable>
            <thead>
              <tr>
                <th className={tableHeaderClass}>Customer</th>
                <th className={tableHeaderClass}>Service / problem</th>
                <th className={tableHeaderClass}>Contact / address</th>
                <th className={tableHeaderClass}>Preferred date</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {visibleBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className={tableCellClass}>
                    <p className="font-semibold text-[#172B4D]">{booking.customerName}</p>
                    <p className="mt-1 text-xs text-[#737B87]">{booking.customerPhone || booking.phone}</p>
                  </td>
                  <td className={`${tableCellClass} max-w-72`}>
                    <p className="font-semibold text-[#172B4D]">{booking.serviceTitle}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-[#737B87]">{booking.problemDescription}</p>
                  </td>
                  <td className={`${tableCellClass} max-w-64`}>{booking.address}</td>
                  <td className={tableCellClass}>{new Date(booking.preferredDate).toLocaleDateString()}</td>
                  <td className={tableCellClass}><StatusBadge value={booking.status} /></td>
                  <td className={tableCellClass}><RequestActions booking={booking} working={workingId === booking.id} onUpdate={(status, amount) => requestStatusUpdate(booking, status, amount)} /></td>
                </tr>
              ))}
            </tbody>
          </DashboardTable>
        </>
      )}
      {rejectTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="reject-request-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 id="reject-request-title" className="text-lg font-bold text-[#172B4D]">Reject this request?</h2>
            <p className="mt-2 text-sm text-[#737B87]">The request for {rejectTarget.serviceTitle} from {rejectTarget.customerName} will be rejected.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className={secondaryButtonClass} disabled={workingId === rejectTarget.id} onClick={() => setRejectTarget(null)}>Keep request</button>
              <button type="button" className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60" disabled={workingId === rejectTarget.id} onClick={() => void confirmReject()}>
                {workingId === rejectTarget.id ? "Rejecting..." : "Reject request"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function RequestActions({
  booking,
  working,
  onUpdate,
}: {
  booking: TechnicianBooking;
  working: boolean;
  onUpdate: (status: string, finalAmount?: number) => void;
}) {
  const [finalAmount, setFinalAmount] = useState(
    String(booking.finalAmount ?? booking.basePrice ?? ""),
  );
  const [amountError, setAmountError] = useState("");
  const actions = actionMap[booking.status] ?? [];

  const handleUpdate = (status: string) => {
    if (status !== "completed") {
      onUpdate(status);
      return;
    }

    const amount = Number(finalAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setAmountError("Enter a positive final amount.");
      return;
    }

    setAmountError("");
    onUpdate(status, amount);
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.some((action) => action.status === "completed") && (
        <label className="w-full text-xs font-semibold text-[#454B54]">
          Final amount (৳)
          <input
            type="number"
            min="1"
            step="1"
            value={finalAmount}
            onChange={(event) => {
              setFinalAmount(event.target.value);
              setAmountError("");
            }}
            className="mt-1 block w-full max-w-48 rounded-lg border border-[#D7DCE3] bg-white px-3 py-2 text-sm text-[#172B4D]"
          />
        </label>
      )}
      {amountError && <p role="alert" className="w-full text-xs text-red-700">{amountError}</p>}
      {actions.map((action) => (
        <button
          type="button"
          key={action.status}
          disabled={working}
          onClick={() => handleUpdate(action.status)}
          className={`${action.status === "rejected" ? "rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50" : secondaryButtonClass} px-3 py-2 text-xs`}
        >
          {working ? "Saving..." : action.label}
        </button>
      ))}
    </div>
  );
}
