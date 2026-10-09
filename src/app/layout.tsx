import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://netrawebai.in'),
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
  icons: {
    icon: [
      { url: '/images/logo.png', sizes: 'any' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    title: "Netrawebai — Har Dukaan Online",
    description: "Your Shop. Your Style. Your Website. Connect your physical shop to online customers with ready-to-use business website designs.",
    url: "https://netrawebai.in",
    siteName: "Netrawebai",
    images: [
      {
        url: '/images/logo.png',
        width: 1024,
        height: 1024,
        alt: 'Netrawebai 3D Logo',
      },
    ],
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
