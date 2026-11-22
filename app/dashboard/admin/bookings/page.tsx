"use client";

import { useEffect, useState } from "react";
import {
  DashboardEmpty,
  DashboardError,
  DashboardPageHeading,
  DashboardTable,
  StatusBadge,
  tableCellClass,
  tableHeaderClass,
} from "../../../../components/dashboard/DashboardComponents";
import { dashboardRequest } from "../../../../components/dashboard/api";

interface AdminBooking {
  id: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName?: string;
  preferredDate: string;
  status: string;
  paymentStatus: string;
  finalAmount: number;
  basePrice: number;
}

const statuses = ["all", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const query = status === "all" ? "" : `?status=${encodeURIComponent(status)}`;
        const result = await dashboardRequest<{ bookings: AdminBooking[] }>(`/api/dashboard/admin/bookings${query}`);
        if (active) setBookings(result.bookings);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load platform bookings.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [status]);

  return (
    <div>
      <DashboardPageHeading eyebrow="Admin" title="All Bookings" description="Read-only view of repair bookings across the platform." />
      <label className="mb-5 flex items-center gap-3 text-sm font-semibold text-[#172B4D]">
        Filter by status
        <select value={status} onChange={(event) => { setStatus(event.target.value); setLoading(true); }} className="rounded-lg border border-[#D7DCE3] bg-white px-3 py-2 text-sm capitalize">
          {statuses.map((item) => <option key={item} value={item}>{item === "all" ? "All statuses" : item === "in-progress" ? "In Progress" : item}</option>)}
        </select>
      </label>
      {error && <div className="mb-4"><DashboardError>{error}</DashboardError></div>}
      {loading ? (
        <p className="py-10 text-center text-sm text-[#737B87]">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <DashboardEmpty>No bookings match this status.</DashboardEmpty>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <h3 className="font-semibold text-[#172B4D]">{booking.serviceTitle}</h3>
                <p className="mt-1 text-sm text-[#454B54]">{booking.customerName} · {booking.technicianName || "Technician pending"}</p>
                <p className="mt-1 text-xs text-[#737B87]">{new Date(booking.preferredDate).toLocaleDateString()}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><StatusBadge value={booking.status} /><StatusBadge value={booking.paymentStatus || "unpaid"} /><span className="font-semibold">৳{Number(booking.finalAmount ?? booking.basePrice).toLocaleString()}</span></div>
              </article>
            ))}
          </div>
          <DashboardTable>
            <thead><tr><th className={tableHeaderClass}>Service</th><th className={tableHeaderClass}>Customer</th><th className={tableHeaderClass}>Technician</th><th className={tableHeaderClass}>Date</th><th className={tableHeaderClass}>Status</th><th className={tableHeaderClass}>Payment</th><th className={tableHeaderClass}>Amount</th></tr></thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className={`${tableCellClass} font-semibold text-[#172B4D]`}>{booking.serviceTitle}</td>
                  <td className={tableCellClass}>{booking.customerName}<span className="mt-1 block text-xs text-[#737B87]">{booking.customerEmail}</span></td>
                  <td className={tableCellClass}>{booking.technicianName || "Pending"}</td>
                  <td className={tableCellClass}>{new Date(booking.preferredDate).toLocaleDateString()}</td>
                  <td className={tableCellClass}><StatusBadge value={booking.status} /></td>
                  <td className={tableCellClass}><StatusBadge value={booking.paymentStatus || "unpaid"} /></td>
                  <td className={`${tableCellClass} font-semibold`}>৳{Number(booking.finalAmount ?? booking.basePrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </DashboardTable>
        </>
      )}
    </div>
  );
}
