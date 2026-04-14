import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BuyCreditsButton from "@/components/BuyCreditsButton";
import { User, Mail, Zap, ShieldCheck, CreditCard } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Authenticate User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch Profile Data
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
  }

  // Fallbacks in case data is missing
  const userEmail = user.email || "No email provided";
  const fullName = profile?.full_name || "User";
  const initials = fullName.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto overflow-hidden w-full">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400">
          Manage your account settings and billing information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ========================================== */}
        {/* CARD 1: ACCOUNT DETAILS                    */}
        {/* ========================================== */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-xl flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            {/* Elegant Initial Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-red-brand flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{fullName}</h2>
              <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Account</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            {/* Field: Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white">
                {fullName}
              </div>
            </div>

            {/* Field: Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white opacity-70 cursor-not-allowed">
                {userEmail}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Email is tied to your Google Auth provider and cannot be changed
                here.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* CARD 2: BILLING & CREDITS                  */}
        {/* ========================================== */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-red-brand-light" />
            <h2 className="text-xl font-bold text-white">Plan & Credits</h2>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 mb-8 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Current Plan</p>
              <p className="text-red-brand-light font-bold text-xl uppercase tracking-wider">
                {profile?.plan_name || "FREE"}
              </p>
            </div>
            <div className="h-12 w-px bg-gray-800"></div> {/* Divider */}
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Credits Available</p>
              <p className="text-white font-bold text-3xl flex items-center gap-2 justify-end">
                <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
                {profile?.credits || 0}
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-white font-medium mb-2">
              Need more generations?
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Purchase additional credits to continue restoring your premium
              photos with our high-fidelity AI pipeline.
            </p>

            {/* Reusing your existing payment button */}
            <div className="w-full sm:w-auto">
              <BuyCreditsButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
