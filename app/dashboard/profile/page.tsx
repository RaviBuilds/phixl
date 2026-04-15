import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BuyCreditsButton from "@/components/BuyCreditsButton";
import {
  User,
  Mail,
  Zap,
  ShieldCheck,
  CreditCard,
  Receipt,
  Download,
  Calendar,
} from "lucide-react";
import type { Metadata } from "next";
import DownloadInvoiceBtn from "@/components/DownloadInvoiceBtn";

export const metadata: Metadata = {
  title: "Profile & Billing",
  description:
    "Manage your account details, view transaction history, and purchase credits.",
  robots: { index: false, follow: false },
};

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
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  // 3. Fetch Transaction History
  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (txError) {
    console.error("Error fetching transactions:", txError);
  }

  // Fallbacks
  const userEmail = user.email || "No email provided";
  const fullName = profile?.full_name || "User";
  const initials = fullName.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto overflow-hidden w-full mb-20">
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
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white">
                {fullName}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white opacity-70 cursor-not-allowed">
                {userEmail}
              </div>
              <p className="text-xs text-gray-400 mt-2">
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
            <div className="h-12 w-px bg-gray-800"></div>
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
            <div className="w-full sm:w-auto">
              <BuyCreditsButton />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 3: TRANSACTION HISTORY             */}
      {/* ========================================== */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-xl mt-4">
        <div className="flex items-center gap-3 mb-8">
          <Receipt className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
        </div>

        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-12 bg-[#0a0a0a] rounded-xl border border-gray-800 border-dashed">
            <Receipt className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No transactions found</p>
            <p className="text-gray-400 text-sm mt-1">
              When you purchase credits, your receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="pb-4 font-medium pl-4">Date</th>
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Credits</th>
                  <th className="pb-4 font-medium text-right pr-4">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors group"
                  >
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(tx.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="py-4 text-gray-400 text-sm">
                      {tx.razorpay_order_id}
                    </td>
                    <td className="py-4 font-medium text-white">
                      {tx.currency === "USD" ? "$" : "₹"}
                      {tx.amount}
                    </td>
                    <td className="py-4">
                      <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold">
                        +{tx.credits_added}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <DownloadInvoiceBtn
                        transaction={tx}
                        userEmail={userEmail}
                        fullName={fullName}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
