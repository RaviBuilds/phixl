"use client";
import BuyCreditsButton from "@/components/BuyCreditsButton";
import LogoutBtn from "@/components/LogoutBtn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Restore" },
  { href: "/dashboard/gallery", label: "Gallery" },
  { href: "/dashboard/profile", label: "Profile" },
];

// Shared active / inactive link treatments
const activeLink =
  "text-neutral-100 border-b-2 border-red-brand-light drop-shadow-[0_0_8px_rgba(255,0,153,0.55)]";
const inactiveLink = "text-neutral-400 hover:text-neutral-100 border-b-2 border-transparent";

export default function Sidebar() {
  const currentPath = usePathname();

  return (
    <>
      {/* ========================================== */}
      {/* MOBILE VIEW: Horizontal Scrollable Tabs    */}
      {/* ========================================== */}
      <div className="md:hidden w-full bg-white/[0.02] backdrop-blur-md border-b border-white/10 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between px-6 py-4 min-w-max gap-8">
          <nav className="flex items-center gap-6 text-sm font-bold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  currentPath === item.href ? activeLink : inactiveLink
                } pb-1 transition-all`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Buy Credits */}
          <div className="border-l border-white/10 pl-6">
            <BuyCreditsButton />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* DESKTOP VIEW: Left Sidebar                 */}
      {/* ========================================== */}
      <aside className="hidden md:flex w-64 bg-white/[0.02] backdrop-blur-md border-r border-white/10 p-6 flex-col justify-between">
        <div className="pt-4!">
          <h2 className="text-2xl text-center font-bold tracking-tight text-red-brand-light pb-4">
            Dashboard
          </h2>

          <nav className="flex flex-col items-center justify-center gap-5 text-[1rem] mt-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  currentPath === item.href ? activeLink : inactiveLink
                } pb-1 transition-all`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <hr className="mt-8 border-white/10" />

          <div className="mt-8">
            <BuyCreditsButton />
          </div>
        </div>

        <div className="flex w-full items-center justify-center mb-4">
          <div className="bg-white/[0.04] border border-white/10 text-neutral-300 w-fit block mx-auto px-5 py-2 rounded-full hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer font-bold">
            <LogoutBtn />
          </div>
        </div>
      </aside>
    </>
  );
}
