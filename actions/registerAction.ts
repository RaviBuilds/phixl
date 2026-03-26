"use server";

import { createClient } from "@/utils/supabase/server";

export default async function registerAction(PrevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;
    if (!name || !email || !password || !confirm_password) {
      return {
        error: "Please fill all the details and try again",
        success: null,
      };
    }
    if (password !== confirm_password) {
      return {
        error: "Password and Confirm Password not matched !",
        success: null,
      };
    }
    
    const supabase = await createClient();
    const {error} = await supabase.auth.signUp({
        email,
        password,
        options:{
            data:{
                full_name:name,
            },
        },
    })

    if(error)
    {
      return {
        error: "Unexpected error occured while registering new user, please try again!",
        success: null,
      }; 
    }

  } catch (error) {}

  return { error: null, success: "User Created succesfully" };
}
