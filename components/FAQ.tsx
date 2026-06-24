"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";

interface FaqTypes {
  question: string;
  answer: string;
}

const faqs: FaqTypes[] = [
  {
    question: "Will this process damage my original physical photograph?",
    answer:
      "Absolutely not. We only work on digital copies. You simply upload a scan or a smartphone picture of your photo to our secure server. Your precious physical artifact never leaves your home and remains completely safe.",
  },
  {
    question: "How should I scan my photos for the best results?",
    answer:
      "For the highest quality AI restoration, scan your photos in full color (even if the original is black and white) at 600 DPI. Be sure to turn off your scanner's 'auto-enhance' or 'dust removal' features, as they can interfere with our AI's ability to accurately reconstruct details.",
  },
  {
    question: "Can severely water-damaged or torn photos be fixed?",
    answer:
      "Yes. Our advanced deep learning models specifically target and rebuild missing pieces from deep paper tears, correct severe fading, and reverse the effects of water spots and mold to bring the original image back to life.",
  },
  {
    question: "Are my images used to train public AI models?",
    answer:
      "Never. Your privacy is our absolute priority. Your images are securely processed on encrypted servers and automatically deleted shortly after your session. We never claim ownership of your family memories or use them to train public AI models.",
  },
  {
    question: "How does the pricing work? Are there hidden subscriptions?",
    answer:
      "We use a transparent, pay-as-you-go credit system. There are zero hidden fees and no monthly subscriptions to cancel. You simply purchase a pack of credits when you need them, and use them at your own pace.",
  },
];

export default function FAQ(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative w-full px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-3xl">
        <SectionHeading
          eyebrow="Common Questions"
          title="Everything You Need to Know"
          subtitle="Clear answers to ensure your family history is in safe hands."
          className="mb-16"
        />

        <ul className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <li key={faq.question}>
                <div
                  className={cn(
                    "glass overflow-hidden rounded-xl transition-all duration-300",
                    isOpen
                      ? "border-brand-pink/30 bg-white/[0.05]"
                      : "hover:border-white/20",
                  )}
                >
                  <button
                    onClick={() => handleToggle(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-pink/50"
                  >
                    <h3 className="text-[1.1rem] font-semibold text-ink">
                      {faq.question}
                    </h3>
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                        isOpen ? "bg-brand-pink/15" : "bg-white/5",
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform duration-300",
                          isOpen
                            ? "rotate-180 text-brand-rose"
                            : "text-ink-subtle",
                        )}
                      />
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 leading-relaxed text-neutral-200">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
