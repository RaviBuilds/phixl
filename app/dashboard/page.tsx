"use server"

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    
  const supabase = await createClient();

  // 1. get the user securely athenticated 

  const { data: {user}} = await supabase.auth.getUser();

  if(!user)
  {
    redirect("/login");
  }

   console.log("USER is already logged in ", user);


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
  return (
    <>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold">Restore Image</h1>

        {/* The Status Dashboard */}
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Workspace for</p>
            <p className="text-xl font-semibold text-white">
              {profile?.full_name}
            </p>
          </div>
          <div className="text-right flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-400">Plan</p>
              <p className="text-pink-500 font-bold uppercase tracking-wider">
                {profile?.plan_name}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-700"></div> {/* Divider */}
            <div>
              <p className="text-sm text-gray-400">Credits</p>
              <p className="text-2xl font-bold text-white">
                {profile?.credits}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder for Task 2.2 */}
        <div className="mt-4 border-2 border-dashed border-gray-800 rounded-2xl p-24 flex items-center justify-center text-gray-500">
          [Drag and Drop Upload Zone goes here]
        </div>
      </div>
    </>
  );
}
