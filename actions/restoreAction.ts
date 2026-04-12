"use server";

import { createClient } from "@/utils/supabase/server";
import Replicate from "replicate";
import { revalidatePath } from "next/cache";

//replicate initialization done
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

export async function restoreImage(imagePath: string) {
  try {
    const supabase = await createClient();

    //***** verify the user is securely logged in

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    //****** check if user has enough credit

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();
   
    if (!profile || profile.credits <= 0) {
      throw new Error("Insufficient Credit please update your plan");
    }

    //******** get the absolute public url of the image from storage

    const { data: publicUrlData } = supabase.storage
      .from("restoration_images")
      .getPublicUrl(imagePath);

    const imageUrl = publicUrlData.publicUrl;
  

    //********  call the replicate AI model (codeFormer for restoration)

    const output: unknown = await replicate.run(
      "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
      {
        input: {
          image: imageUrl,
          upscale: 2,
          face_upsample: true,
          background_enhance: true,
          codeformer_fidelity: 0.7,
        },
      },
    );

    //****  Deduct 1 credit from the user's profile

    const { data, error } = await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);
 

    //  Download the restored image
    const replicateUrl = output as string;
    const restored_image = await fetch(replicateUrl);
    const imageBuffer = await restored_image.arrayBuffer();

    //Create a permant path for the image on supabase bucket
    const restored_file_name = `restored - ${Date.now()}.png`;
    const restored_file_path = `${user.id}/${restored_file_name}`;

    // upload the image to the supabase bucket

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("restored_images")
      .upload(restored_file_path, imageBuffer, { contentType: "image/png" });

    if (uploadError) {
      throw new Error(uploadError?.message);
    }

    //store the file in DB
    const { error: dbError } = await supabase
      .from("restorations")
      .insert({ user_id: user.id, image_url: restored_file_path });

    if (dbError) {
      console.error("Database insert error", dbError);
      throw new Error("Image Uploaded but failed to save in gallery.");
    }

    //**** return the restored image URL to browser

    const { data: restoredImageData } = supabase.storage
      .from("restored_images")
      .getPublicUrl(restored_file_path);
    const restoredImagePath = restoredImageData.publicUrl;
    revalidatePath("/dashboard", "layout");
    return { success: true, restoredImageUrl: restoredImagePath as string };
  } catch (error: any) {
    console.error("AI Restoration Error:", error);
    let friendlyErrorMessage = "Failed to restore the image. Please try again";
    if (
      error.message.includes("402") ||
      error.message.includes("Insufficient credit")
    ) {
      friendlyErrorMessage =
        "Our AI servers are currently experiencing high load. Please try again later.";
    }
    return {
      success: false,
      error: friendlyErrorMessage,
    };
  }
}
