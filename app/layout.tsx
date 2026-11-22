import type { Metadata, Viewport } from "next";
import "./tailwind-built.css";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "FIXORA — Smart Device & Home Appliance Repair Service Platform",
  description:
    "Repair Smarter. Live Better. FIXORA connects you with skilled, background-verified technicians for smartphones, laptops, ACs, refrigerators, TVs, and smart home appliances across Bangladesh.",
  keywords: [
    "appliance repair",
    "mobile phone repair",
    "ac servicing dhaka",
    "refrigerator repair",
    "laptop repair bangladesh",
    "home technician service",
    "FIXORA",
  ],
  authors: [{ name: "FIXORA Technologies" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans text-[#454B54] bg-[#FFFFFF] antialiased selection:bg-[#2563EB] selection:text-white">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
} 
