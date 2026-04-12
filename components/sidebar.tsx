"use client";
import BuyCreditsButton from "@/components/BuyCreditsButton";
import LogoutBtn from "@/components/LogoutBtn";
import Link from "next/link";
import  { usePathname } from "next/navigation";
export default function Sidebar() {
 const currentPath = usePathname();
 
  return (
    <aside className="w-64 border-r border-gray-800 p-6 hidden flex-col justify-between md:flex">
      <div className="pt-4!">
        <h2 className="text-2xl text-center font-bold text-red-brand-light pb-4">
          Dashboard
        </h2>
        <nav className="flex items-center justify-center flex-row text - gray - 300 gap-4 text-[0.9rem]">
          <Link
            href="/dashboard"
            className={`${currentPath === "/dashboard" ? "border-b border-pink-400" : "border-none"} hover:text-white transition-colors`}
          >
            Restore
          </Link>
          <Link
            href="/dashboard/gallery"
            className={`${currentPath === "/dashboard/gallery" ? "border-b border-pink-400" : "border-none"} hover:text-white transition-colors`}
          >
            Gallery
          </Link>
          <Link
            href="/dashboard/profile"
            className={`${currentPath === "/dashboard/profile" ? "border-b border-pink-400" : "border-none"} hover:text-white transition-colors`}
          >
            Profile
          </Link>
        </nav>
        <hr className="mt-3 border-[#313030]" />
        <div className="mt-4">
          <BuyCreditsButton />
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="text-black bg-white w-fit block mx-auto px-5! py-2! rounded-2xl hover:text-red-400 transition-colors cursor-pointer">
          <LogoutBtn />
        </div>
      </div>
    </aside>
  );
}
