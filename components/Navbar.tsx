"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.avif";
import userIcon from "@/public/user.png";
import LogoutBtn from "@/components/LogoutBtn";

interface NavbarProps {
  user: any;
}

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

export default function Navbar({ user }: NavbarProps): React.ReactElement {
  const [isNavActive, setIsNavActive] = useState<boolean>(false);
  const [isUserClicked, setIsUserClicked] = useState(false);

  const dropDownRef = useRef<HTMLDivElement>(null);

  const onshowUser = () => {
    setIsUserClicked((prev) => !prev);
  };

  const onshowUseronHover = () => {
    setIsUserClicked(true);
  };

  // --- FIX 1: Added TouchEvent for mobile support ---
  useEffect(() => {
    function hideMenu(event: MouseEvent | TouchEvent) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsUserClicked(false);
      }
    }

    // Listen for both mouse clicks and mobile taps
    document.addEventListener("mousedown", hideMenu);
    document.addEventListener("touchstart", hideMenu);

    return () => {
      document.removeEventListener("mousedown", hideMenu);
      document.removeEventListener("touchstart", hideMenu);
    };
  }, []);

  useEffect(() => {
    if (isNavActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isNavActive]);

  return (
    <nav className="bg-black-background border-b! border-gray-text! flex flex-row items-center justify-between px-6! py-3 md:py-5 relative">
      <div className="flex items-center justify-between w-full md:max-w-[724px] md:mx-auto lg:max-w-full">
        <button
          onClick={() => setIsNavActive(!isNavActive)}
          className="md:hidden text-3xl text-color-white z-30 cursor-pointer"
        >
          {isNavActive ? "X" : "☰"}
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
            className="fixed inset-1 bg-black-background h-screen z-10 lg:hidden"
            onClick={() => setIsNavActive(false)}
          ></div>
        )}
        <ul
          className={`${
            isNavActive ? "block" : "hidden"
          } md:flex md:flex-row top-[10%] left-1/2 -translate-x-1/2 translate-y-[50%]! absolute z-20 px-10! py-16! rounded-2xl md:top-0 md:px-0 md:py-0! md:translate-x-0! md:relative md:translate-y-0! md:left-0! md:rounded-none`}
        >
          {navMenuItem.map((nav) => (
            <li key={nav.menu} className="pb-6 text-center md:pb-0 ">
              <Link
                href={nav.link}
                className="font-semibold text-color-white-fresh hover:text-red-brand-light! whitespace-nowrap text-xl md:text-sm md:px-6 transition-colors"
              >
                {nav.menu}
              </Link>
            </li>
          ))}
        </ul>

        {user ? (
          <div
            ref={dropDownRef}
            className="flex flex-col items-center justify-center gap-1 relative"
          >
            <Image
              src={userIcon}
              alt="User logged in"
              placeholder="blur"
              className="w-8 cursor-pointer"
              onClick={onshowUser}
              onMouseEnter={onshowUseronHover}
            />
            {isUserClicked && (
              <div className="absolute right-0 bg-color-white text-black top-15 w-fit h-fit z-50 rounded-md p-4 shadow-lg">
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link
                      href="/dashboard"
                      // --- FIX 2: Close menu immediately upon navigation ---
                      onClick={() => setIsUserClicked(false)}
                      className="hover:text-red-brand transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li onClick={() => setIsUserClicked(false)}>
                    <LogoutBtn />
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Link
              href="/login"
              className="text-color-white-fresh bg-red-brand hover:bg-color-white-fresh hover:text-red-brand-light font-bold transition-all duration-300 ease-linear px-6! py-2! text-sm rounded-full md:py-3 cursor-pointer inline-block"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
