"use client";

import React, { useState } from "react";
import RedLabel from "@/components/RedLabel";
import { ChevronDown } from "lucide-react";

interface FaqTypes {
  question: string;
  answer: string;
}

// CRO UPDATE: Dismantling user fears (Privacy, Physical Damage, Subscriptions, Scanning Quality)
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
  // State to track which accordion item is open
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default to first item open

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-[#050a14]">
      <div className="px-6 max-w-full py-15 md:py-25 md:max-w-[724px] md:mx-auto lg:max-w-3xl">
        <div className="mb-12">
          <div className="w-full flex items-center justify-center mb-4">
            <RedLabel>Common Questions</RedLabel>
          </div>
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-color-white-fresh leading-tight">
            Everything You Need to Know
          </h2>
          <p className="text-center text-lg text-gray-400">
            Clear answers to ensure your family history is in safe hands.
          </p>
        </div>

        <div className="mt-8 max-w-full mx-auto">
          <ul className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <li key={faq.question} className="w-full">
                  <button
                    onClick={() => handleToggle(index)}
                    className={`w-full flex items-center justify-between border border-gray-800 rounded-2xl p-6 text-left transition-all duration-300 focus:outline-none ${
                      isOpen
                        ? "bg-[#1f293790] border-red-brand/30"
                        : "bg-[#11182780] hover:bg-[#1f293780]"
                    }`}
                  >
                    <h3 className="text-[1.1rem] font-bold text-color-white-fresh pr-4">
                      {faq.question}
                    </h3>
                    <div
                      className={`p-2 rounded-full transition-colors duration-300 ${isOpen ? "bg-red-brand/10" : "bg-transparent"}`}
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180 text-red-brand" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </button>

                  {/* Smooth Accordion Reveal */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-[500px] opacity-100 mt-2 px-6 pb-6"
                        : "max-h-0 opacity-0 px-6"
                    }`}
                  >
                    <p className="text-gray-400 leading-relaxed text-[1rem] pt-2">
                      {faq.answer}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
