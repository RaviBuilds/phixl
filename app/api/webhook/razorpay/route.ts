import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin (Bypasses RLS to update credits securely)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

    // 1. Verify the cryptographic signature from Razorpay
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay Signature");
      return new NextResponse("Invalid Signature", { status: 400 });
    }

    const event = JSON.parse(body);

    // 2. Listen specifically for successful payments
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentData = event.payload.payment.entity;

      // Extract the userId we securely attached in Step 2!
      const userId = paymentData.notes?.userId;

      if (!userId) {
        throw new Error("No user ID found in payment notes.");
      }

      // 3. Get the user's current credits
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      const currentCredits = profile?.credits || 0;

      // 4. Add 10 credits to their account
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ credits: currentCredits + 15, plan_name: "pro" })
        .eq("id", userId);

      await supabaseAdmin.from("transactions").insert({
        user_id: userId,
        razorpay_order_id: paymentData.order_id,
        amount: paymentData.amount / 100, // Convert paise/cents back to standard currency format
        currency: paymentData.currency,
        credits_added: 15, // Or whatever amount you tied to this payment
      });

      if (updateError) throw updateError;

      console.log(`Successfully added 15 credits to user ${userId}`);
    }

    return new NextResponse("Webhook Processed Successfully", { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
