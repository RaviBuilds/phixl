"use client";
import { useState } from "react";
import { createCheckoutSession } from "@/actions/stripeCheckout";
import { Loader2 } from "lucide-react";


export default function BuyCreditsButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await createCheckoutSession();
      if (response.success && response.url) {
        //redirect the user to secure stripe hosted checkout page
        window.location.href = response.url;
      } else {
        console.error("Checkout Failed", response.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("An unexpected error occured:", error);
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleCheckout}
      className="bg-red-brand-light hover:bg-red-brand cursor-pointer text-white px-5 py-3 rounded-xl font-bold w-full md:w-auto flex justify-center items-center transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin mr-2" size={20} />
          Redirecting to Stripe...
        </>
      ) : (
        "Buy 50 credits for $5"
      )}
    </button>
  );
}
