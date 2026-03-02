import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInit from "@/components/PWAInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "Poultry Farm Manager",
  description: "Comprehensive poultry farm management and record tracking application",
  manifest: "/manifest.json",
  keywords: ["poultry", "farm", "management", "records", "tracking", "agriculture"],
  authors: [{ name: "Poultry Farm Manager" }],
  creator: "Poultry Farm Manager",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Poultry Farm Manager",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://poultry-farm.com",
    title: "Poultry Farm Manager",
    description: "Comprehensive poultry farm management and record tracking application",
    siteName: "Poultry Farm Manager",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Farm Manager" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="alternate icon" type="image/png" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAInit />
        {children}
      </body>
    </html>
  );
}
