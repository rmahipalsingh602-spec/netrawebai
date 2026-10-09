import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netrawebai — Har Dukaan Online | Premium Indian Business Website Builder",
  description: "Create a beautiful, mobile-friendly website for your local shop in India. Explore category designs, customize shop details, add products, and connect with customers on WhatsApp.",
  keywords: [
    "Indian local shop website",
    "website builder India",
    "har dukaan online",
    "mobile shop website",
    "kirana online store",
    "boutique website",
    "jewellery store website",
    "marwad local business",
  ],
  authors: [{ name: "Netrawebai Team" }],
  openGraph: {
    title: "Netrawebai — Har Dukaan Online",
    description: "Your Shop. Your Style. Your Website. Connect your physical shop to online customers with ready-to-use business website designs.",
    url: "https://netrawebai.in",
    siteName: "Netrawebai",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B132B",
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#0B132B] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
