import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Timex Ceramic | International Premium Tiles & Ceramics",
    template: "%s | Timex Ceramic",
  },
  description: "Experience luxury surfaces with Timex Ceramic. Explore premium floor tiles, vitrified slabs, bathware, and interactive visualizers for luxury spaces.",
  keywords: ["premium tiles", "luxury ceramics", "vitrified tiles", "italian tiles", "bathroom tiles", "living room slabs", "timex ceramic", "tile visualiser"],
  authors: [{ name: "Timex Ceramic" }],
  metadataBase: new URL("https://www.timexceramic.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Timex Ceramic | International Premium Tiles & Ceramics",
    description: "Experience luxury surfaces with Timex Ceramic. Explore premium collections, custom catalogue builder, and AI room visualizers.",
    url: "https://www.timexceramic.com",
    siteName: "Timex Ceramic",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Timex Ceramic Premium Surfaces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Timex Ceramic | Premium Surfaces",
    description: "Redefining premium spaces with international quality ceramic tiles.",
    images: ["/images/og-image.jpg"],
  },
};

import React, { Suspense } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { getGlobalSeoSettings, getCustomCodeSettings } from "@/services/seo";
import { CustomCodeInjector } from "@/components/common/CustomCodeInjector";
import { ScrollToTop } from "@/components/common/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getGlobalSeoSettings();
  const customCode = getCustomCodeSettings();
  const orgData = settings.organization_data || {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.timexceramic.com/#organization",
    "name": "Timex Ceramic",
    "url": "https://www.timexceramic.com/",
    "logo": "https://www.timexceramic.com/wp-content/uploads/2023/07/Timex-Ceramic-Logo.png",
    "email": "smm@ambestmedia.com",
    "telephone": "+91-22-26122960",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "402, Pratik Avenue, Opp. Shiv Sagar Rest., Nehru Road, Vile Parle (E)",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400057",
      "addressCountry": "IN"
    }
  };

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png?v=2" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png?v=2" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" sizes="180x180" />
        {settings.verification_codes?.google && (
          <meta name="google-site-verification" content={settings.verification_codes.google} />
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <CustomCodeInjector initialSettings={customCode} />
        <LanguageProvider>
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(orgData),
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}

