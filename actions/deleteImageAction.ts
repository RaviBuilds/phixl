"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache"; // Moved here!

interface deleteImageParam {
  id: string;
  publicUrl: string;
  imagePath: string;
}

export const deleteImageAction = async ({
  id,
  publicUrl,
  imagePath,
}: deleteImageParam) => {
  try {
    const supabase = await createClient();

    // 1. Verify the user is securely logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. Delete from the DB table using the Primary Key AND the user ID for security
    const { error: deleteError } = await supabase
      .from("restorations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    // 3. If DB table operation is successful, delete the physical file from storage
    const { error: storageError } = await supabase.storage
      .from("restored_images")
      .remove([imagePath]); // No need for template literals if it is already a string

    if (storageError) {
      throw new Error(storageError.message);
    }

    // 4. Purge the cache so the Next.js frontend updates instantly
    revalidatePath("/dashboard", "layout");

    return { success: true, data: null };
  } catch (error: any) {
    console.error("Delete Action Error:", error.message);
    return { success: false, data: null };
  }
};
