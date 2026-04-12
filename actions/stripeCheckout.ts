"use server";

import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

//initialize the stripe at start

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function createCheckoutSession() {
  try {
    const supabase = await createClient();

    // step 1 : verify user is Authentcated

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if(!user)
    {
        throw new Error("Unauthorized. Please log in to purchase the credits");
    }

    // step 2: Create the stripe checkout session
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Phixl AI starter Pack",
              description: "50 AI Image Restoration Credits",
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?payment=cancelled`,
    });
if(!session.url)
{
    throw new Error("Failed to generate checkout URL");
}

return { success: true, url:session.url}
  } catch (error:any) {
     console.error("Stripe Checkout Error:", error.message);
     return{ success:false, error:error.message}
  }
}
