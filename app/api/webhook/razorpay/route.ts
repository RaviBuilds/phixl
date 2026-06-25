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

      // ----------------------------------------------------------------------
      // 2a. IDEMPOTENCY / REPLAY PROTECTION
      // We dedupe on the Razorpay PAYMENT id (paymentData.id) rather than the
      // per-delivery event id. This is strictly safer: a single successful
      // payment can trigger BOTH `payment.captured` and `order.paid` (two
      // distinct events), and the provider may also re-deliver any of them.
      // Keying on the payment id guarantees a payment is credited exactly once
      // regardless of how many events/redeliveries reference it.
      // We "claim" it by inserting into processed_webhooks (id = primary key).
      // A primary-key/unique violation means this payment was already handled,
      // so we ACK with 200 and do NOT credit the user again.
      // ----------------------------------------------------------------------
      const paymentId = paymentData.id;

      if (!paymentId) {
        throw new Error("No payment ID found in webhook payload.");
      }

      const { error: claimError } = await supabaseAdmin
        .from("processed_webhooks")
        .insert({ id: paymentId });

      if (claimError) {
        // Postgres 23505 = unique_violation -> this payment was already processed.
        if (claimError.code === "23505") {
          console.warn(`Event already processed: ${paymentId}`);
          return new NextResponse("Event already processed", { status: 200 });
        }
        // Any other failure writing the marker is a genuine error -> let the
        // provider retry rather than risk an uncredited payment.
        throw claimError;
      }

      try {
        // 3. Get the user's current credits
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("credits")
          .eq("id", userId)
          .single();

        const currentCredits = profile?.credits || 0;

        // 4. Add credits to their account
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ credits: currentCredits + 15, plan_name: "pro" })
          .eq("id", userId);

        if (updateError) throw updateError;

        await supabaseAdmin.from("transactions").insert({
          user_id: userId,
          razorpay_order_id: paymentData.order_id,
          amount: paymentData.amount / 100, // Convert paise/cents back to standard currency format
          currency: paymentData.currency,
          credits_added: 15, // Or whatever amount you tied to this payment
        });

        console.log(`Successfully added 15 credits to user ${userId}`);
      } catch (creditError) {
        // Crediting failed AFTER we claimed the event. Release the claim so the
        // provider's automatic retry can be processed instead of being silently
        // skipped as a "duplicate" — otherwise the user pays but never gets
        // credited.
        await supabaseAdmin
          .from("processed_webhooks")
          .delete()
          .eq("id", paymentId);
        throw creditError;
      }
    }

    return new NextResponse("Webhook Processed Successfully", { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
