"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    //initialize the supabase connection

    const supabase = await createClient();

    //attempt to login

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    return { error: "Unexpected error occured" };
  }
  redirect("/dashboard");
}
