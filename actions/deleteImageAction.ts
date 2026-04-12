"use server"
import { createClient } from "@/utils/supabase/server";

interface deleteImageParam {
  id: string;
  publicUrl: string;
  imagePath:string;
}

export const deleteImageAction = async ({
  id,
  publicUrl,
  imagePath,
}: deleteImageParam) => {
  try {
    const supabase = await createClient();
    console.log("Id=>", id)
    console.log("PublicURL=>", publicUrl)
    console.log("ImagePath=>", imagePath)
    return {success:true, data:"hello"}
  } catch (error) {}
};