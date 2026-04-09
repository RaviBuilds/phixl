"use server";

import { createClient } from "@/utils/supabase/server";
import Replicate from "replicate";
import { revalidatePath } from "next/cache";

//replicate initialization done
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput:false,
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
    console.log("Profile=>", profile);
    if (!profile || profile.credits <= 0) {
      throw new Error("Insufficient Credit please update your plan");
    }

    //******** get the absolute public url of the image from storage

    const { data: publicUrlData } = supabase.storage
      .from("restoration_images")
      .getPublicUrl(imagePath);

    const imageUrl = publicUrlData.publicUrl;
    console.log("Sending image to replicate AI");

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

    console.log("Output =>", output);
    //****  Deduvt 1 credit from the user's profile

    const {data, error} = await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);
   console.log("DATA=>", data);
   console.log("ERROR=>", error);
    //**** return the restored image URL to browser
    revalidatePath("/dashboard");
    return { success: true, restoredImageUrl: output as string };
  } catch (error: any) {
    console.log("AI Restoration Error:", error);
    return {
      success: false,
      error: error.message || "Failed to restore the image.",
    };
  }
}
