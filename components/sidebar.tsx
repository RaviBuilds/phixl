import LogoutBtn from "@/components/LogoutBtn";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-800 p-6 hidden flex-col justify-between md:flex">
      <div className="pt-4!">
        <h2 className="text-2xl text-center font-bold text-pink-500">
          Dashboard
        </h2>
        <nav className="flex flex-col gap-4 text-gray-300 text-[0.9rem]">
          <Link
            href="/dashboard"
            className="hover:text-white transition-colors"
          >
            Restore
          </Link>
          <Link
            href="/dashboard/gallery"
            className="hover:text-white transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/dashboard/profile"
            className="hover:text-white transition-colors"
          >
            Profile
          </Link>
        </nav>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="text-black bg-white w-fit block mx-auto px-5! py-2! rounded-2xl hover:text-red-400 transition-colors cursor-pointer">
          <LogoutBtn />
        </div>
      </div>
    </aside>
  );
}
