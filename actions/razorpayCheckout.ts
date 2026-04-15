"use server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

type Currency = "USD" | "INR";
type UsedId = string;

interface OptionsType {
  amount: number;
  currency:Currency;
  receipt:string;
  notes:{userId:UsedId};
}

export async function createRazorPayOrder(){

    try {
        //get the user to validate
        const supabase = await createClient();
        const {data: {user}} = await supabase.auth.getUser();

        if(!user) throw new Error("Unauthorized!!");

        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID!,
          key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options: OptionsType = {
          amount: 299,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            userId: user.id,
          },
        };
        const order = await razorpay.orders.create(options);

        return {success:true, order};

    } catch (error:any) {
        console.error("Razorpay Order Error:", error);
        return {success:false, error:error.message}
    }
}