"use client";
import google_logo from "@/public/logo-google.png";
import logo from "@/public/logo.avif";
import Image from "next/image";
import { useActionState, useState } from "react";
import registerAction from "@/actions/registerAction";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(registerAction, {
    error: null as string | null,
    success: null as string | null,
  });

  const [passwords, setPasswords] = useState({
    password: "",
    confirm_password: "",
  });
  const [screenError, setScreenError] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const supabse = createClient();

  function checkPassword() {
    if (passwords.password !== passwords.confirm_password) {
      setScreenError(true);
    } else {
      setScreenError(false);
    }
  }

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    const { error } = await supabse.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error("Google Auth Error", error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative flex items-start pt-7 justify-center text-neutral-100 pb-10">
      <div className="w-full relative flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="w-[10rem] mb-3">
          <Image src={logo} alt="logo" placeholder="blur" className="w-40" />
        </div>

        {/* Global Notifications */}
        {screenError && (
          <p className="text-red-500 text-sm top-12 absolute font-bold">
            Password and Confirm password should match!!
          </p>
        )}
        {state.success && (
          <p className="text-green-600 text-sm top-12 absolute font-bold">
            {state.success}
          </p>
        )}

        {/* Form Wrapper */}
        <div className="w-full mt-10 px-12 sm:max-w-[450px] sm:p-6 sm:glass-card">
          <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-100">Signup</h2>

          <form action={formAction} className="mt-5">
            {/* Name Input */}
            <div className="mb-4 w-full">
              <label className="text-sm font-bold text-neutral-200 mb-1 block">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="bg-white/[0.03] border border-white/10 text-neutral-200 placeholder:text-neutral-500 focus:border-white/30 focus:outline-none rounded-md text-sm font-bold w-full px-4 py-3 transition-all duration-300 ease-linear"
              />
            </div>

            {/* Email Input */}
            <div className="mb-4 w-full">
              <label className="text-sm font-bold text-neutral-200 mb-1 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="bg-white/[0.03] border border-white/10 text-neutral-200 placeholder:text-neutral-500 focus:border-white/30 focus:outline-none rounded-md text-sm font-bold w-full px-4 py-3 transition-all duration-300 ease-linear"
              />
            </div>

            {/* Password Input */}
            <div className="mb-4 w-full">
              <label className="text-sm font-bold text-neutral-200 mb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={passwords.password}
                required
                onChange={(e) =>
                  setPasswords({ ...passwords, password: e.target.value })
                }
                className="bg-white/[0.03] border border-white/10 text-neutral-200 placeholder:text-neutral-500 focus:border-white/30 focus:outline-none rounded-md text-sm font-bold w-full px-4 py-3 transition-all duration-300 ease-linear"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4 w-full">
              <label className="text-sm font-bold text-neutral-200 mb-1 block">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                required
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirm_password: e.target.value,
                  })
                }
                onBlur={checkPassword}
                className="bg-white/[0.03] border border-white/10 text-neutral-200 placeholder:text-neutral-500 focus:border-white/30 focus:outline-none rounded-md text-sm font-bold w-full px-4 py-3 transition-all duration-300 ease-linear"
              />
            </div>

            {/* Register Button Area */}
            <div className="mt-10 text-center relative">
              {state.error && (
                <p className="text-red-500 top-[-2rem] text-sm left-1/2 -translate-x-1/2 absolute w-full">
                  {state.error}
                </p>
              )}
              <button
                className="bg-[#ff0099] drop-shadow-[0px_0px_1px_#fff] transition-all duration-300 ease-linear px-4 py-2 rounded-md text-[1rem] font-bold cursor-pointer hover:drop-shadow-[0px_0px_2px_#fff] disabled:bg-gray-500 disabled:cursor-no-drop"
                disabled={screenError || isPending}
              >
                {isPending ? "Processing" : "Signup"}
              </button>

              <span className="block mt-2 underline text-neutral-400 text-sm font-bold hover:text-neutral-300 cursor-pointer">
                <Link href="/login">Already have an account?</Link>
              </span>
            </div>
          </form>

          <div className="my-6 relative block text-center w-full before:content-[''] before:absolute before:w-[32%] before:h-full before:left-0 before:-translate-y-[47%] before:border-b before:border-[rgb(179,179,179)] after:content-[''] after:absolute after:w-[32%] after:h-full after:right-0 after:-translate-y-[47%] after:border-b after:border-[rgb(179,179,179)]">
            <span>Or Signup Via</span>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="shadow-[inset_0px_0px_10px_5px_#cccccc49] bg-[#830550] drop-shadow-[0px_0px_1px_#fff] transition-all duration-300 ease-linear px-4 py-2 rounded-md text-[1rem] font-bold cursor-pointer flex flex-row w-full items-center justify-center gap-3"
            disabled={isGoogleLoading || isPending}
          >
            {isGoogleLoading ? (
              <span className="text-sm">Redirecting...</span>
            ) : (
              <>
                <Image
                  src={google_logo}
                  alt="google"
                  placeholder="blur"
                  className="w-7"
                />
                <span className="text-sm">Google</span>
              </>
            )}
          </button>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-6 font-normal text-neutral-400 underline cursor-pointer"
        >
          Back to HomePage
        </Link>
      </div>
    </div>
  );
}
