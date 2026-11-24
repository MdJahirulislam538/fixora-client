"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DashboardEmpty,
  DashboardError,
  DashboardLoading,
  DashboardPageHeading,
  DashboardTable,
  tableCellClass,
  tableHeaderClass,
} from "../../../../components/dashboard/DashboardComponents";
import { dashboardRequest } from "../../../../components/dashboard/api";

interface Payment {
  id: string;
  serviceTitle: string;
  technicianName?: string;
  amount: number;
  transactionId: string;
  paidAt: string;
}

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    dashboardRequest<{ payments: Payment[] }>("/api/dashboard/payments")
      .then((result) => {
        if (active) setPayments(result.payments);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load payment history.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <DashboardPageHeading
        eyebrow="Customer"
        title="Payment History"
        description="View completed payments for your FIXORA bookings."
      />
      {error && <div className="mb-4"><DashboardError>{error}</DashboardError></div>}
      {isLoading ? (
        <DashboardLoading label="Loading payments" />
      ) : payments.length === 0 ? (
        <DashboardEmpty action={<Link href="/dashboard/customer/bookings" className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">View bookings</Link>}>
          No payments to show yet.
        </DashboardEmpty>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {payments.map((payment) => (
              <article key={payment.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <h3 className="font-semibold text-[#172B4D]">{payment.serviceTitle}</h3>
                <p className="mt-1 text-sm text-[#737B87]">{payment.technicianName || "Technician"}</p>
                <p className="mt-3 text-sm font-semibold">৳{Number(payment.amount).toLocaleString()}</p>
                <p className="mt-1 break-all text-xs text-[#737B87]">{payment.transactionId}</p>
                <p className="mt-1 text-xs text-[#737B87]">{new Date(payment.paidAt).toLocaleString()}</p>
              </article>
            ))}
          </div>
          <DashboardTable>
            <thead>
              <tr>
                <th className={tableHeaderClass}>Service</th>
                <th className={tableHeaderClass}>Technician</th>
                <th className={tableHeaderClass}>Amount</th>
                <th className={tableHeaderClass}>Transaction ID</th>
                <th className={tableHeaderClass}>Payment date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className={`${tableCellClass} font-semibold text-[#172B4D]`}>{payment.serviceTitle}</td>
                  <td className={tableCellClass}>{payment.technicianName || "—"}</td>
                  <td className={`${tableCellClass} font-semibold`}>৳{Number(payment.amount).toLocaleString()}</td>
                  <td className={`${tableCellClass} max-w-56 break-all text-xs`}>{payment.transactionId}</td>
                  <td className={tableCellClass}>{new Date(payment.paidAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </DashboardTable>
        </>
      )}
    </div>
  );
}
