"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "../../app/lib/auth-client";
import { DashboardLoading } from "./DashboardComponents";

type Role = "customer" | "technician" | "admin";

const roleHome: Record<Role, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

const roleMenus: Record<Role, { label: string; href: string }[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer" },
    { label: "My Bookings", href: "/dashboard/customer/bookings" },
    { label: "Payment History", href: "/dashboard/customer/payments" },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician" },
    { label: "Add a Service", href: "/dashboard/technician/add-service" },
    { label: "My Services", href: "/dashboard/technician/my-services" },
    { label: "Manage Requests", href: "/dashboard/technician/requests" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Manage Users", href: "/dashboard/admin/users" },
    { label: "Service Approval", href: "/dashboard/admin/services" },
    { label: "All Bookings", href: "/dashboard/admin/bookings" },
    { label: "Transactions", href: "/dashboard/admin/transactions" },
  ],
};

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const user = session?.user;
  const role: Role = user?.role === "technician" || user?.role === "admin" ? user.role : "customer";
  const menu = useMemo(() => roleMenus[role], [role]);
  const pageTitle = menu.find((item) => item.href === pathname)?.label ?? (pathname === "/dashboard/profile" ? "Update Profile" : "Dashboard");
  const initials = user?.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const signOut = async () => {
    setSignOutError("");
    try {
      const { error } = await authClient.signOut();
      if (error) {
        const message = error.message || "Unable to sign out.";
        setSignOutError(message);
        toast.error(message);
        return;
      }
      toast.success("Signed out.");
      router.replace("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out.";
      setSignOutError(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace(`/sign-in?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }
    
    const routeRole = pathname.split("/")[2];
    if (
      (routeRole === "customer" || routeRole === "technician" || routeRole === "admin") &&
      routeRole !== role
    ) {
      router.replace(roleHome[role]);
    }
  }, [isPending, pathname, role, router, user]);

  if (isPending || !user) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-6 sm:p-8">
        <DashboardLoading label="Loading your dashboard" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#E5E7EB] bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#E5E7EB] px-5">
          <Link href="/" className="text-lg font-black tracking-wide text-[#2563EB]">
            FIXORA
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close dashboard navigation"
            className="rounded-lg p-2 text-[#737B87] hover:bg-[#F5F7FA] lg:hidden"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="border-b border-[#E5E7EB] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#737B87]">
            {role} workspace
          </p>
          <p className="mt-1 truncate text-sm font-semibold">{user.name}</p>
        </div>
        <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 px-3 py-4">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#EFF6FF] text-[#2563EB]"
                    : "text-[#454B54] hover:bg-[#F5F7FA] hover:text-[#172B4D]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${active ? "bg-[#2563EB]" : "bg-slate-300"}`}
                />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/dashboard/profile"
            onClick={() => setSidebarOpen(false)}
            aria-current={pathname === "/dashboard/profile" ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/dashboard/profile"
                ? "bg-[#EFF6FF] text-[#2563EB]"
                : "text-[#454B54] hover:bg-[#F5F7FA] hover:text-[#172B4D]"
            }`}
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-slate-300" />
            Update Profile
          </Link>
        </nav>
        <div className="border-t border-[#E5E7EB] p-4">
          <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#454B54] hover:bg-[#F5F7FA]">
            <span aria-hidden="true">←</span> Back to Home
          </Link>
          {signOutError && <p role="alert" className="px-3 py-2 text-xs text-red-700">{signOutError}</p>}
          <button type="button" onClick={() => void signOut()} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50">
            Sign Out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle dashboard navigation"
              aria-expanded={sidebarOpen}
              className="rounded-lg border border-[#E5E7EB] p-2 text-[#172B4D] hover:bg-[#F5F7FA]"
            >
              <span aria-hidden="true">☰</span>
            </button>
            <h1 className="truncate text-base font-bold sm:text-lg">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm font-medium text-[#454B54] hover:text-[#2563EB] sm:block">
              Home
            </Link>
            <div className="flex items-center gap-2.5">
              {user.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="h-9 w-9 rounded-full border border-[#E5E7EB] object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#2563EB]">
                  {initials || "U"}
                </span>
              )}
              <div className="hidden sm:block">
                <p className="max-w-40 truncate text-sm font-semibold">{user.name}</p>
                <p className="text-xs capitalize text-[#737B87]">{role}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
