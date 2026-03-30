"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.avif";
import userIcon from "@/public/user.png";
import logoutAction from "@/actions/logoutAction";
import { useActionState } from "react";

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
    const [state, onLogout, isPending] = useActionState(logoutAction, {
        error: null as string | null,
        success: null as string | null,
    });
    const onshowUser = () => {
        console.log("CHEEEEEECKKK");
        setIsUserClicked((prev) => !prev);
        console.log("Value toggled", isUserClicked);
    };
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
                {user ? (
                    <div className="user-profile flex flex-col items-center justify-center gap-1">
                        <Image
                            src={userIcon}
                            alt="User logged in"
                            placeholder="blur"
                            className="w-8 cursor-pointer"
                            onClick={onshowUser}
                        />
                    </div>
                ) : (
                    <div className="login">
                        <Link href="/login" className="login-btn">
                            Login
                        </Link>
                    </div>
                )}
            </div>
            {isUserClicked && (
                <div className="user-icon-dashboard">
                    <ul className="flex flex-col gap-2">
                        <li>
                            <Link
                                href="/dashboard"
                                className="hover:text-red-500 transition-colors"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <form action={onLogout}>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="hover:text-red-500 transition-colors text-left"
                                >
                                    {isPending ? " Logging out..." : "Logout"}
                                </button>
                            </form>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}
