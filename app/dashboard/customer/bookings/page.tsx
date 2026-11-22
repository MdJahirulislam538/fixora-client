"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DashboardEmpty,
  DashboardError,
  DashboardPageHeading,
  DashboardTable,
  StatusBadge,
  primaryButtonClass,
  secondaryButtonClass,
  tableCellClass,
  tableHeaderClass,
} from "../../../../components/dashboard/DashboardComponents";
import { dashboardRequest } from "../../../../components/dashboard/api";

interface Booking {
  id: string;
  serviceTitle: string;
  serviceImage?: string;
  technicianName?: string;
  preferredDate: string;
  basePrice: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
}

function formatAmount(value: number | undefined) {
  return `৳${Number(value ?? 0).toLocaleString()}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const loadBookings = useCallback(async () => {
    const result = await dashboardRequest<{ bookings: Booking[] }>("/api/dashboard/bookings");
    setBookings(result.bookings);
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        if (params.get("checkout") === "success" && sessionId) {
          await dashboardRequest("/api/dashboard/bookings/confirm-payment", {
            method: "POST",
            body: JSON.stringify({ sessionId }),
          });
          setNotice("Payment received. Your booking is marked as paid.");
          window.history.replaceState({}, "", "/dashboard/customer/bookings");
        } else if (params.get("checkout") === "cancelled") {
          setNotice("Checkout was cancelled. You can try again whenever you are ready.");
          window.history.replaceState({}, "", "/dashboard/customer/bookings");
        }
        await loadBookings();
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load your bookings.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [loadBookings]);

  const cancelBooking = async () => {
    if (!cancelTarget) return;
    setIsWorking(true);
    setError("");
    try {
      await dashboardRequest(`/api/dashboard/bookings/${encodeURIComponent(cancelTarget.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "cancelled" }),
      });
      setCancelTarget(null);
      setNotice("Booking cancelled.");
      await loadBookings();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Unable to cancel this booking.");
    } finally {
      setIsWorking(false);
    }
  };

  const payForBooking = async (booking: Booking) => {
    setIsWorking(true);
    setError("");
    try {
      const result = await dashboardRequest<{ url: string }>(
        `/api/dashboard/bookings/${encodeURIComponent(booking.id)}/checkout`,
        { method: "POST" },
      );
      window.location.assign(result.url);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Unable to start checkout.");
      setIsWorking(false);
    }
  };

  return (
    <div>
      <DashboardPageHeading
        eyebrow="Customer"
        title="My Bookings"
        description="Review your repair requests, booking status, and payment."
      />
      {notice && (
        <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </p>
      )}
      {error && <div className="mb-4"><DashboardError>{error}</DashboardError></div>}
      {isLoading ? (
        <p className="py-10 text-center text-sm text-[#737B87]">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <DashboardEmpty>You don&apos;t have any bookings yet.</DashboardEmpty>
      ) : (
        <>
          <div className="space-y-4 md:hidden">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  {booking.serviceImage ? (
                    <img src={booking.serviceImage} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-slate-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#172B4D]">{booking.serviceTitle}</h3>
                    <p className="mt-1 text-xs text-[#737B87]">{booking.technicianName || "Technician pending"}</p>
                    <p className="mt-1 text-xs text-[#737B87]">{formatDate(booking.preferredDate)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={booking.status} />
                    <StatusBadge value={booking.paymentStatus || "unpaid"} />
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-[#737B87]">Base: {formatAmount(booking.basePrice)}</p>
                    <p className="mt-1 font-semibold text-[#172B4D]">Final: {formatAmount(booking.finalAmount ?? booking.basePrice)}</p>
                  </div>
                </div>
                <BookingActions
                  booking={booking}
                  isWorking={isWorking}
                  onCancel={() => setCancelTarget(booking)}
                  onPay={() => void payForBooking(booking)}
                />
              </article>
            ))}
          </div>
          <DashboardTable>
            <thead>
              <tr>
                <th className={tableHeaderClass}>Service</th>
                <th className={tableHeaderClass}>Technician</th>
                <th className={tableHeaderClass}>Preferred date</th>
                <th className={tableHeaderClass}>Price / amount</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Payment</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className={tableCellClass}>
                    <div className="flex min-w-52 items-center gap-3">
                      {booking.serviceImage ? (
                        <img src={booking.serviceImage} alt="" className="h-11 w-11 rounded-lg object-cover" />
                      ) : (
                        <div className="h-11 w-11 rounded-lg bg-slate-100" />
                      )}
                      <span className="font-semibold text-[#172B4D]">{booking.serviceTitle}</span>
                    </div>
                  </td>
                  <td className={tableCellClass}>{booking.technicianName || "Pending"}</td>
                  <td className={tableCellClass}>{formatDate(booking.preferredDate)}</td>
                  <td className={tableCellClass}>
                    <span className="block text-xs text-[#737B87]">Base: {formatAmount(booking.basePrice)}</span>
                    <span className="mt-1 block font-semibold">Final: {formatAmount(booking.finalAmount ?? booking.basePrice)}</span>
                  </td>
                  <td className={tableCellClass}><StatusBadge value={booking.status} /></td>
                  <td className={tableCellClass}><StatusBadge value={booking.paymentStatus || "unpaid"} /></td>
                  <td className={tableCellClass}>
                    <BookingActions
                      booking={booking}
                      isWorking={isWorking}
                      onCancel={() => setCancelTarget(booking)}
                      onPay={() => void payForBooking(booking)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </DashboardTable>
        </>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 id="cancel-booking-title" className="text-lg font-bold text-[#172B4D]">Cancel this booking?</h2>
            <p className="mt-2 text-sm text-[#737B87]">
              Your request for {cancelTarget.serviceTitle} will be cancelled.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className={secondaryButtonClass} disabled={isWorking} onClick={() => setCancelTarget(null)}>
                Keep booking
              </button>
              <button type="button" className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60" disabled={isWorking} onClick={() => void cancelBooking()}>
                {isWorking ? "Cancelling..." : "Cancel booking"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function BookingActions({
  booking,
  isWorking,
  onCancel,
  onPay,
}: {
  booking: Booking;
  isWorking: boolean;
  onCancel: () => void;
  onPay: () => void;
}) {
  if (booking.status === "requested") {
    return <button type="button" onClick={onCancel} disabled={isWorking} className={`${secondaryButtonClass} mt-3 text-xs`}>Cancel</button>;
  }
  if (booking.status === "completed" && booking.paymentStatus !== "paid") {
    return <button type="button" onClick={onPay} disabled={isWorking} className={`${primaryButtonClass} mt-3 text-xs`}>{isWorking ? "Please wait..." : "Pay Now"}</button>;
  }
  return booking.paymentStatus === "paid"
    ? <span className="mt-3 inline-flex"><StatusBadge value="paid" /></span>
    : null;
}
