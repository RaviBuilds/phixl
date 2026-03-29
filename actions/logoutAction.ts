"use server"
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

export default async function logoutAction(prevState: any) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();

    if(error)
    {
       return { error: error.message, success: null }; 
    }
  } catch (error:any) {
    return { error: error.message, success: null };
  }
  redirect("/");
}
