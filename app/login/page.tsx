// app/login/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm"; // Adjust path if needed
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Access your Phixl AI account to restore your family photos and manage your credits.",
};

export default async function LoginPage() {
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
  return <LoginForm />;
}
