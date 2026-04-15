// app/login/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SignupForm from "@/components/SignupForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account",
  description:
    "Create a free Phixl AI account and get 3 free credits to start restoring your historical photos today.",
};

export default async function SignupPage() {
  // 1. Initialize server-side Supabase
  const supabase = await createClient();

  // 2. Check for an active session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. If the user exists, kick them to the dashboard immediately!
  if (user) {
    redirect("/dashboard");
  }

  // 4. If they are NOT logged in, render your beautiful client-side form
  return <SignupForm />;
}
