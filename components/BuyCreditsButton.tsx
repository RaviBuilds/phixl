"use client";
import { useState } from "react";
import { createRazorPayOrder } from "@/actions/razorpayCheckout";
import { Loader2 } from "lucide-react";

export default function BuyCreditsButton() {
  const [loading, setLoading] = useState<boolean>(false);


  //Load Razorpay script

  const loadRazorpayScript = ()=>{
    return new Promise((resolve)=>{
      const script  = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const handlePayment = async () => {
    setLoading(true);

    try {
      // load the script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to laod");
        setLoading(false);
        return;
      }

      // 2. create the order on your backend

      const { success, order, error } = await createRazorPayOrder();
      if (!success) throw new Error(error);

      // configure the razorpay overlay

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order?.amount,
        currency: order?.currency,
        name: "Phixl AI",
        description: "15 Premium AI Restorations",
        order_id: order?.id,
        handler: async function (response: any) {
          alert("Payment successful ! Credit will appear in a moment.");
          window.location.reload();
        },
        prefill: {
          name: "Phixl User", // You can pass actual user data here if you want
          email: "",
          contact: "",
        },
        theme: {
          color: "#e11d48", // Matches your red-brand color
        },
      };

      // 4. Open the overlay
      // @ts-ignore - Razorpay attaches itself to the global window object
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error:any) {
     console.error(error);
     alert("Something went wrong with the payment setup.");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handlePayment}
      className="text-sm bg-red-brand-light hover:bg-red-brand cursor-pointer text-white px-5 py-3 rounded-xl font-bold w-full md:w-auto flex justify-center items-center transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin mr-2" size={20} />
          Redirecting to Stripe...
        </>
      ) : (
        "Buy 15 credits for $2.99"
      )}
    </button>
  );
}
