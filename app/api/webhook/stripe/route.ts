import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

//initialize stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-03-25.dahlia",
});

// initialize supabase Admin Clients
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

export async function POST(req: Request) {
  // step 1. Get the raw body and signature from the incoming request

  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // step2: Cryptographically veryify the request come from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
    
  } catch (error: any) {
    console.error("Webhook verification failed:", error.message);
    return new NextResponse(`Webhook Error : ${error.message}`, {
      status: 400,
    });
  }

  // Step 3:  Handle the succesfull payment event

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    //Extract the user id we attached in server action

    const userId = session.metadata?.userId;
   
    if (!userId) {
      console.error("Critical: No UserId found in session metadata");
      return new NextResponse("Metadata missing", { status: 400 });
    }

    try {
      // step 4: fetch the user current credits from the profiles table
      const { data: profile, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

     
      if (fetchError) {
        console.error("Error fetching the profile:", fetchError.message);
        throw new Error("Couldnt fetch the profile");
      }

      const currentCredits = profile?.credits || 0;
      const creditsToAdd = 50;

      // step 5: update the profile with new credit

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ credits: currentCredits + creditsToAdd })
        .eq("id", userId);

      if (updateError) {
        console.error(
          "Error while updating the credits in profile",
          updateError.message,
        );
        throw new Error("Could not update the credits");
      }
      console.log(
        `Succesfully added ${creditsToAdd} credits for user ${userId}`,
      );
    } catch (error: any) {
      console.error(error.message);
      return new NextResponse("Database Error", { status: 500 });
    }
  }
  // step 6: everything goes good then return 200 OK so stripe knows the Webhook was recieved succesfully
  return new NextResponse("Webhook Processed Succesfully", { status: 200 });
}
