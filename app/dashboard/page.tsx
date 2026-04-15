

import ImageUpload from "@/components/ImageUpload";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import BuyCreditsButton from "@/components/BuyCreditsButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Upload and restore your damaged photos using our advanced AI pipeline.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {    
  const supabase = await createClient();

  // 1. get the user securely athenticated 
  const { data: {user}} = await supabase.auth.getUser();
  if(!user)
  {
    redirect("/login");
  }
  //  2. Fetch the specific details of the user from our new table
  
  const {data: profile, error} = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();
  if(error)
  {
    console.error("Error fetching the profile:", error);
  }

  const hasCredits = profile?.credits > 0;


  return (
    <>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto overflow-hidden pt-14 md:pt-0">
        <h1 className="text-3xl font-bold">Restore Image</h1>

        {/* The Status Dashboard */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-400">Workspace for</p>
            <p className="text-xl font-semibold text-white">
              {profile?.full_name}
            </p>
          </div>
          <div className="text-right flex items-center gap-6">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-400">Plan</p>
              <p className="text-red-brand-light italic font-bold uppercase tracking-wider">
                {profile?.plan_name}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-700"></div> {/* Divider */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-400">Credits</p>
              <p className="text-2xl font-bold text-white">
                {profile?.credits}
              </p>
            </div>
          </div>
        </div>
        {hasCredits ? (
          <ImageUpload />
        ) : (
          <div className="mt-4 border-2 border-dashed border-gray-700 bg-blue-low-200 rounded-2xl p-12 md:p-24 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-2xl">
              💳
            </div>
            <h3 className="text-xl font-bold text-color-white-fresh mb-2">
              Zero Credits Remaining
            </h3>
            <p className="text-sm text-color-gray mb-8 max-w-md">
              You don't have sufficient credit to perform this operation.
              Upgrade your plan to continue restoring images.
            </p>
            <BuyCreditsButton />
            {/* <Link
              href="/"
              className="bg-red-brand hover:bg-red-brand-light text-color-white-fresh px-8 py-3 rounded-full font-bold transition-all drop-shadow-[0px_0px_1px_#fff]"
            >
              Upgrade Plan
            </Link> */}
          </div>
        )}
      </div>
    </>
  );
}
