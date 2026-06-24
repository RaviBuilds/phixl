"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { ArrowSvg } from "@/components/Icon";

const ImageSwiper = dynamic(() => import("./ImageSwiper"), {
  ssr: false,
  // Skeleton holds the space while the JS downloads — no layout shift.
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-2xl bg-surface-2" />
  ),
});

interface StepData {
  id: string;
  value: number;
  icon: string;
  iconInfo: string;
  description: string;
}

const HowItWorksData: StepData[] = [
  {
    id: "step-1",
    value: 1,
    icon: "🔒",
    iconInfo: "Secure Digital Upload",
    description:
      "Upload a scan or smartphone photo. Your precious physical original stays safely at home.",
  },
  {
    id: "step-2",
    value: 2,
    icon: "✨",
    iconInfo: "Ethical AI Restoration",
    description:
      "Our algorithms meticulously rebuild facial details and repair damage without altering the original essence.",
  },
  {
    id: "step-3",
    value: 3,
    icon: "🖼️",
    iconInfo: "Preserve & Share",
    description:
      "Download your artifact-free, high-resolution memory, ready for print or your family archives.",
  },
];

export default function HowItWorks(): React.ReactElement {
  return (
    <section id="how-it-works" className="relative w-full px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading
          eyebrow="Simple & Secure"
          title="How It Works"
          subtitle="Restore your family archives in 3 simple, secure steps."
          className="mb-16"
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* LEFT: The 3 steps */}
          <ol className="flex flex-col gap-5">
            {HowItWorksData.map((data) => (
              <li key={data.id}>
                <GlassCard
                  interactive
                  className="flex items-start gap-5 p-6"
                >
                  <div className="mt-0.5 flex h-10 w-10 min-w-10 items-center justify-center rounded-full border border-brand-pink/40 bg-brand-pink/10 text-base font-semibold text-brand-rose">
                    {data.value}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{data.icon}</span>
                      <h3 className="text-lg font-semibold text-ink">
                        {data.iconInfo}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-200">
                      {data.description}
                    </p>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ol>

          {/* RIGHT: Slider, framed with an ambient glow behind it */}
          <div className="relative mx-auto w-full max-w-md">
            <AmbientGlow className="inset-0 m-auto h-full w-full opacity-60" />
            <div className="relative aspect-[4/5] min-h-[400px] overflow-hidden rounded-2xl border border-white/10 bg-surface-1 shadow-2xl md:min-h-[500px]">
              <ImageSwiper />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 w-fit">
          <Link href="/login">
            <Button icon={<ArrowSvg />}>Restore Your First Photo Free</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
