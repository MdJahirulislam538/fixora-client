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

interface Transaction {
  id: string;
  customerName: string;
  technicianName: string;
  serviceTitle: string;
  amount: number;
  transactionId: string;
  paidAt: string;
}

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    dashboardRequest<{ payments: Transaction[] }>("/api/dashboard/payments")
      .then((result) => {
        if (active) setPayments(result.payments);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load transactions.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalRevenue = payments.reduce((total, payment) => total + Number(payment.amount || 0), 0);

  return (
    <div>
      <DashboardPageHeading eyebrow="Admin" title="Transactions" description="All verified payments recorded for completed FIXORA bookings." />
      <section className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm font-medium text-[#454B54]">Total revenue</p>
        <p className="mt-2 text-3xl font-bold text-[#172B4D]">৳{totalRevenue.toLocaleString()}</p>
      </section>
      {error && <div className="mb-4"><DashboardError>{error}</DashboardError></div>}
      {loading ? (
        <DashboardLoading label="Loading transactions" />
      ) : payments.length === 0 ? (
        <DashboardEmpty action={<Link href="/dashboard/admin/bookings" className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Review bookings</Link>}>
          No transactions have been recorded yet.
        </DashboardEmpty>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {payments.map((payment) => (
              <article key={payment.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <h3 className="font-semibold text-[#172B4D]">{payment.serviceTitle}</h3>
                <p className="mt-1 text-sm text-[#454B54]">{payment.customerName} · {payment.technicianName}</p>
                <p className="mt-2 font-semibold">৳{Number(payment.amount).toLocaleString()}</p>
                <p className="mt-1 break-all text-xs text-[#737B87]">{payment.transactionId}</p>
                <p className="mt-1 text-xs text-[#737B87]">{new Date(payment.paidAt).toLocaleString()}</p>
              </article>
            ))}
          </div>
          <DashboardTable>
            <thead><tr><th className={tableHeaderClass}>Customer</th><th className={tableHeaderClass}>Technician</th><th className={tableHeaderClass}>Service</th><th className={tableHeaderClass}>Amount</th><th className={tableHeaderClass}>Transaction ID</th><th className={tableHeaderClass}>Payment date</th></tr></thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className={tableCellClass}>{payment.customerName}</td>
                  <td className={tableCellClass}>{payment.technicianName}</td>
                  <td className={tableCellClass}>{payment.serviceTitle}</td>
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
