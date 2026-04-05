"use client";

import React, { useState } from "react";
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
    
    const onshowUser = () => {
        setIsUserClicked((prev) => !prev);
        console.log("Value toggled", isUserClicked);
    };

    return (
        <nav className="bg-[#050a14] border-b border-[#2a2a2b] flex flex-row items-center justify-between px-6 py-3 md:py-5 relative">
            
            <div className="flex items-center justify-between w-full md:max-w-[724px] md:mx-auto lg:max-w-full">
                
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
                    className={`${
                        isNavActive ? "block" : "hidden"
                    } md:flex md:flex-row bg-[#050a14] shadow-[0px_0px_35px_2px_#ff4ab7] md:shadow-none top-[10%] left-1/2 -translate-x-1/2 translate-y-[50%] absolute backdrop-blur z-20 px-10 py-16 rounded-2xl md:top-0 md:px-0 md:py-0 md:translate-x-0 md:relative md:translate-y-0 md:left-0 md:rounded-none`}
                >
                    {navMenuItem.map((nav) => (
                        <li key={nav.menu} className="pb-6 text-center md:pb-0">
                            <Link 
                                href={nav.link} 
                                className="font-semibold text-[#fafafa] hover:text-pink-300! text-xl md:text-sm md:px-6 transition-colors"
                            >
                                {nav.menu}
                            </Link>
                        </li>
                    ))}
                </ul>

                {user ? (
                    <div className="flex flex-col items-center justify-center gap-1">
                        <Image
                            src={userIcon}
                            alt="User logged in"
                            placeholder="blur"
                            className="w-8 cursor-pointer"
                            onClick={onshowUser}
                        />
                    </div>
                ) : (
                    <div>
                        <Link 
                            href="/login" 
                            className="text-white bg-[#ff0099] hover:bg-white hover:text-pink-300 font-bold transition-all duration-300 ease-linear px-6! py-2! text-sm rounded-full md:py-3 cursor-pointer inline-block"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </div>

           
            {isUserClicked && (
                
                <div className="absolute right-0 bg-amber-50 text-black top-20 w-fit h-fit z-50 rounded-md p-4 shadow-lg">
                    <ul className="flex flex-col gap-2">
                        <li>
                            <Link
                                href="/dashboard"
                                className="font-bold hover:text-red-500 transition-colors"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <LogoutBtn />
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}