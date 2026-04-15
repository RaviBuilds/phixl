"use client";
import BuyCreditsButton from "@/components/BuyCreditsButton";
import LogoutBtn from "@/components/LogoutBtn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const currentPath = usePathname();

  return (
    <>
      {/* ========================================== */}
      {/* MOBILE VIEW: Horizontal Scrollable Tabs    */}
      {/* ========================================== */}
      <div className="md:hidden w-full bg-[#0a0a0a] border-b border-gray-800 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between px-6 py-4 min-w-max gap-8">
          <nav className="flex items-center gap-6 text-sm font-bold text-gray-400">
            <Link
              href="/dashboard"
              className={`${
                currentPath === "/dashboard"
                  ? "text-white border-b-2 border-pink-400"
                  : ""
              } pb-1 transition-colors`}
            >
              Restore
            </Link>
            <Link
              href="/dashboard/gallery"
              className={`${
                currentPath === "/dashboard/gallery"
                  ? "text-white border-b-2 border-pink-400"
                  : ""
              } pb-1 transition-colors`}
            >
              Gallery
            </Link>
            <Link
              href="/dashboard/profile"
              className={`${
                currentPath === "/dashboard/profile"
                  ? "text-white border-b-2 border-pink-400"
                  : ""
              } pb-1 transition-colors`}
            >
              Profile
            </Link>
          </nav>

          {/* Mobile Logout Button */}
          <div className="border-l border-gray-700 pl-6">
            <BuyCreditsButton />
            {/* <div className="text-black bg-white px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors text-sm font-bold">
              <LogoutBtn />
            </div> */}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* DESKTOP VIEW: Left Sidebar                 */}
      {/* ========================================== */}
      <aside className="hidden md:flex w-64 border-r border-gray-800 p-6 flex-col justify-between bg-[#0a0a0a]">
        <div className="pt-4!">
          <h2 className="text-2xl text-center font-bold text-red-brand-light pb-4">
            Dashboard
          </h2>

          <nav className="flex flex-col items-center justify-center text-gray-300 gap-5 text-[1rem] mt-6">
            <Link
              href="/dashboard"
              className={`${
                currentPath === "/dashboard"
                  ? "border-b border-pink-400 text-white"
                  : "border-none"
              } hover:text-white transition-colors pb-1`}
            >
              Restore
            </Link>
            <Link
              href="/dashboard/gallery"
              className={`${
                currentPath === "/dashboard/gallery"
                  ? "border-b border-pink-400 text-white"
                  : "border-none"
              } hover:text-white transition-colors pb-1`}
            >
              Gallery
            </Link>
            <Link
              href="/dashboard/profile"
              className={`${
                currentPath === "/dashboard/profile"
                  ? "text-white border-b-2 border-pink-400"
                  : "border-none"
              } hover:text-white transition-colors pb-1`}
            >
              Profile
            </Link>
          </nav>

          <hr className="mt-8 border-[#313030]" />

          <div className="mt-8">
            <BuyCreditsButton />
          </div>
        </div>

        <div className="flex w-full items-center justify-center mb-4">
          <div className="text-black bg-white w-fit block mx-auto px-5 py-2 rounded-2xl hover:text-red-400 transition-colors cursor-pointer font-bold">
            <LogoutBtn />
          </div>
        </div>
      </aside>
    </>
  );
}
