import { popularServices, disclaimers } from "@/utils/content";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.avif";

export default function Footer(): React.ReactElement {
  return (
    <footer className="bg-[#050a14] border-t border-gray-800 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ========================================== */}
        {/* TOP GRID: 4 Columns on Desktop, 1 on Mobile */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Trust Statement */}
          <div className="flex flex-col items-start">
            <Link href="/">
              <Image
                src={logo}
                alt="Phixl AI Logo"
                width={140}
                className="mb-4"
                placeholder="blur"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed pr-4">
              Preserving your family history with ethical, artifact-free AI.
              Your memories, perfectly restored and strictly private.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-5 text-[1.05rem] text-color-white-fresh font-bold">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-sm text-gray-400 hover:text-red-brand-light transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-sm text-gray-400 hover:text-red-brand-light transition-colors"
                >
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-gray-400 hover:text-red-brand-light transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-red-brand-light transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Services */}
          <div>
            <h3 className="mb-5 text-[1.05rem] text-color-white-fresh font-bold">
              Capabilities
            </h3>
            <ul className="flex flex-col gap-3">
              {popularServices.map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400 cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal & Privacy (Crucial for CRO/Trust) */}
          <div>
            <h3 className="mb-5 text-[1.05rem] text-color-white-fresh font-bold">
              Legal & Privacy
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-400 hover:text-red-brand-light transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 hover:text-red-brand-light transition-colors"
                >
                  Privacy Policy (GDPR)
                </Link>
              </li>
              <li>
                {/* Mandatory CCPA Link */}
                <Link
                  href="/privacy#ccpa"
                  className="text-sm text-gray-400 hover:text-red-brand-light transition-colors"
                >
                  Do Not Sell My Personal Information
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 mb-8" />

        {/* ========================================== */}
        {/* BOTTOM SECTION: Disclaimers & Copyright    */}
        {/* ========================================== */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {disclaimers.map((item) => (
              <p
                key={item}
                className="text-[0.75rem] text-gray-400 leading-tight"
              >
                {item}
              </p>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
            <span className="text-sm text-gray-400 font-medium">
              © {new Date().getFullYear()} Phixl AI. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
