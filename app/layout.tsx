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
});

export const metadata: Metadata = {
  title: "Phixl AI | Restore Old Photos",
  description: "Restore your old images with Phixl AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabse = await createClient();
  const { data :{user} } = await supabse.auth.getUser();
  console.log("LOGIN DATA =>", user);
  return (
    <html lang="en" className={quicksand.variable}>
      <body className=" bg-[#0b0f19] text-white min-h-screen font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
