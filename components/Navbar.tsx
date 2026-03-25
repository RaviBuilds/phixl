"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.avif";

interface NavItem {
  menu: string;
  link: string;
}

const navMenuItem: NavItem[] = [
  { menu: "How it workes", link: "#" },
  { menu: "Features", link: "#" },
  { menu: "Pricing", link: "#" },
  { menu: "FAQ", link: "#" },
];

export default function Navbar(): React.ReactElement {
  const [isNavActive, setIsNavActive] = useState<boolean>(false);

  return (
    <nav>
      <div className="nav-wrapper">
        <button
          onClick={() => setIsNavActive(!isNavActive)}
          className="md:hidden text-3xl text-amber-50 z-30 cursor-pointer"
        >
          {isNavActive ? "close" : "☰"}
        </button>
        <Link href="/">
          <Image
            src={logo}
            alt="Phixl Logo"
            placeholder="blur"
            className="w-[140px]"
          />
        </Link>
        {isNavActive && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 lg:hidden"
            onClick={() => setIsNavActive(false)}
          ></div>
        )}
        <ul
          className={`${isNavActive ? "block" : "hidden"} md:flex md:flex-row`}
        >
          {navMenuItem.map((nav) => (
            <li key={nav.menu}>
              <Link href={nav.link}>{nav.menu}</Link>
            </li>
          ))}
        </ul>
        <div className="login">
          <Link href="/login" className="login-btn">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
