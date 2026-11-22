"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="flex-1">{children}</div>
      {!isDashboard && <Footer />}
    </>
  );
}
