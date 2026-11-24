"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "../../../../app/lib/auth-client";
import { DashboardLoading, DashboardPageHeading } from "../../../../components/dashboard/DashboardComponents";
import { dashboardRequest } from "../../../../components/dashboard/api";
import { ServiceForm, ServiceFormValue } from "../../../../components/dashboard/ServiceForm";

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [notice, setNotice] = useState("");

  const save = async (value: ServiceFormValue) => {
    await dashboardRequest("/api/dashboard/services", {
      method: "POST",
      body: JSON.stringify(value),
    });
    setNotice("Your service is waiting for admin approval.");
    toast.success("Your service is waiting for admin approval.");
    window.setTimeout(() => router.push("/dashboard/technician/my-services"), 1200);
  };

  return (
    <div>
      <DashboardPageHeading
        eyebrow="Technician"
        title="Add a Service"
        description="Submit your service for admin review before it appears publicly."
      />
      {notice && <p role="status" className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">{notice}</p>}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-7">
        {session?.user ? (
          <ServiceForm
            technicianName={session.user.name}
            technicianEmail={session.user.email}
            submitLabel="Submit for approval"
            onSave={save}
          />
        ) : (
          <DashboardLoading label="Loading your account" />
        )}
      </section>
    </div>
  );
}
