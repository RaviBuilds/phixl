"use client";
import google_logo from "@/public/logo-google.png";
import logo from "@/public/logo.avif";
import Image from "next/image";
import { useActionState, useState } from "react";
import { loginAction } from "@/actions/loginAction";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function UserLogin() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: null as string | null,
  });
 const [isGoogleLoading, setIsGoogleLoading]= useState(false);

 const supabase = createClient();

 const handleGoogleAuth = async()=>{

  setIsGoogleLoading(true);
  const {error} = await supabase.auth.signInWithOAuth({
    provider:"google",
    options:{
      redirectTo:`${window.location.origin}/api/auth/callback`
    },
  });
  if(error)
  {
    console.error("Google Auth Error", error.message);
    setIsGoogleLoading(false);
  }
 }

  return (
    <div className="bg-[#050a14] w-full h-screen relative flex items-start pt-7 justify-center text-white">
      <div className="w-full relative flex flex-col items-center justify-center">
        <div className="w-[10rem] mb-3">
          <Image src={logo} alt="logo" placeholder="blur" className="w-40" />
        </div>

        <div className="w-full mt-10 px-12 sm:max-w-[450px] sm:p-6 sm:border sm:border-[#5c4f64] sm:rounded-[2rem] sm:bg-[#140511]">
          <h2 className="text-center text-2xl font-bold">Login</h2>

          <form action={formAction} className="mt-5">
            <div className="mb-4 w-full">
              <label className="text-sm font-bold text-white mb-1 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="bg-[rgb(25,13,34)] border transition-all duration-300 ease-linear focus:outline-1 border-[#332b35] focus:outline-amber-50 rounded-md text-sm font-bold w-full px-4 py-3"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="text-sm font-bold text-white mb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="bg-[rgb(25,13,34)] border transition-all duration-300 ease-linear focus:outline-1 border-[#332b35] focus:outline-amber-50 rounded-md text-sm font-bold w-full px-4 py-3"
              />
            </div>

            <div className="mt-10 text-center relative">
              {state.error && (
                <p className="text-red-500 top-[-2rem] text-sm left-1/2 -translate-x-1/2 absolute">
                  Error in login
                </p>
              )}
              <button
                className="bg-[#ff0099] drop-shadow-[0px_0px_1px_#fff] transition-all duration-300 ease-linear px-4 py-2 rounded-md text-[1rem] font-bold cursor-pointer hover:drop-shadow-[0px_0px_2px_#fff] disabled:bg-gray-500 disabled:cursor-no-drop"
                disabled={isPending}
              >
                {isPending ? "Submitting" : "Login"}
              </button>
              <span className="block mt-2 underline text-gray-500 text-sm font-bold hover:text-gray-300 cursor-pointer">
                Forgot your password?
              </span>
            </div>
          </form>

          <div className="my-6 relative block text-center w-full before:content-[''] before:absolute before:w-[32%] before:h-full before:left-0 before:-translate-y-[47%] before:border-b before:border-[rgb(179,179,179)] after:content-[''] after:absolute after:w-[32%] after:h-full after:right-0 after:-translate-y-[47%] after:border-b after:border-[rgb(179,179,179)]">
            <span>Or Login Via</span>
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

          <div className="flex flex-row gap-3 w-full mt-5 items-center justify-center">
            <span className="text-gray-400 font-semibold text-[1rem]">
              Don't have an account?
            </span>
            <p className="text-amber-50 font-bold text-[1rem]">
              <Link href="/register">Register now</Link>
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 font-normal text-gray-500 underline cursor-pointer"
        >
          Back to HomePage
        </Link>
      </div>
    </div>
  );
}
