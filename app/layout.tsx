import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";

// configure the font weight
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.phixl.online",
  ), // Replace with your actual production URL
  title: {
    default: "Phixl AI | Historical Photo Restoration",
    template: "%s | Phixl AI", // Automatically formats child pages like "Login | Phixl AI"
  },
  description:
    "Preserving your family history with ethical, artifact-free AI restoration.",

  // ---> NEW: Icons Configuration <---
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.phixl.online",
    siteName: "Phixl AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Phixl AI - Family Photo Restoration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phixl AI | Historical Photo Restoration",
    description:
      "Preserving your family history with ethical, artifact-free AI.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient(); // Fixed minor typo here from supabse to supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={quicksand.variable}>
      <body className=" bg-[#0b0f19] text-white min-h-screen font-sans">
        <Navbar user={user} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
