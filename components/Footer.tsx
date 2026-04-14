import { popularServices } from "@/utils/content";
import { disclaimers } from "@/utils/content";
import Link from "next/link"; // <-- Import Link

export default function Footer(): React.ReactElement {
  return (
    <section className="bg-blue-low-200! px-6! ">
      <div className="px-6 max-w-full py-15 md:py-15 md:max-w-181 md:mx-auto lg:max-w-full">
        <footer>
          <div>
            <h3 className="mb-4 text-[1rem] text-white-fresh font-semibold">
              Quick Links
            </h3>
            <ul className="flex flex-row gap-5">
              {/* Wrapped text in Next.js Links */}
              <li className="text-sm text-color-white! cursor-pointer hover:text-red-brand-light! transition-colors">
                <Link href="/terms">Terms</Link>
              </li>
              <li className="text-sm text-color-white! cursor-pointer hover:text-red-brand-light! transition-colors">
                <Link href="/privacy">Privacy</Link>
              </li>
              <li className="text-sm text-color-white! cursor-pointer hover:text-red-brand-light! transition-colors">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <hr className="border-[#282e3a] my-6" />

          <div>
            <h3 className="mb-4 text-[1rem] text-amber-50 font-semibold">
              Popular Services
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 ml-0 w-max gap-3">
              {popularServices.map((item) => (
                <li
                  key={item}
                  className="text-sm text-color-white! cursor-pointer hover:text-red-brand-light! transition-colors"
                >
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <span className="text-sm text-gray-400 text-center block mt-10">
            © 2026 Phixl AI. All rights reserved.
          </span>

          <hr className="border-[#282e3a] my-6" />

          <div className="pb-10!">
            <ul>
              {disclaimers.map((item) => (
                <li
                  key={item}
                  className="mb-4! text-sm text-gray-500 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
}
