import Link from "next/link";
import img1 from "@/public/img1.jpg";
import img2 from "@/public/img2.jpg";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Eyebrow from "@/components/ui/Eyebrow";
import AmbientGlow from "@/components/ui/AmbientGlow";
import ImageReveal from "@/components/ImageReveal";
import { ArrowSvg } from "@/components/Icon";

interface TrustCardData {
  card_icon: string;
  card_title: string;
  card_subtitle: string;
}

export default function Banner(): React.ReactElement {
  const trustRibbon: TrustCardData[] = [
    {
      card_icon: "🔒",
      card_title: "100% Private",
      card_subtitle: "Encrypted & Auto-Deleted",
    },
    {
      card_icon: "✨",
      card_title: "Artifact-Free",
      card_subtitle: "Respects Original Faces",
    },
    {
      card_icon: "🎨",
      card_title: "True Colors",
      card_subtitle: "Historically Accurate AI",
    },
  ];

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 overflow-hidden px-6 py-24 md:py-28 lg:flex-row lg:gap-16">
      {/* Ambient glow behind the hero focal point */}
      <AmbientGlow className="right-0 top-1/4 h-[28rem] w-[28rem] opacity-70 lg:h-[34rem] lg:w-[34rem]" />

      {/* LEFT COLUMN: Emotional copy & CTA */}
      <div className="flex w-full flex-col items-center text-center lg:w-[55%] lg:items-start lg:text-left">
        <Eyebrow>Historical AI Preservation</Eyebrow>

        <h1 className="mb-6 mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4.2rem]">
          Bring Your Family History{" "}
          <span className="text-gradient-brand">Back to Life</span>
        </h1>

        <p className="mb-8 max-w-2xl text-lg leading-relaxed text-neutral-200 md:text-xl">
          Seamlessly repair tears, remove scratches, and vividly colorize faded
          black-and-white photos with artifact-free AI. Your memories, perfectly
          preserved.
        </p>

        <div className="flex w-full flex-col items-center gap-4 lg:items-start">
          <Link href="/login" className="w-full sm:w-auto">
            <Button icon={<ArrowSvg />} fullWidth>
              Restore Your First Photo Free
            </Button>
          </Link>

          <span className="flex items-center justify-center gap-2 pt-2 text-sm font-medium text-ink-subtle lg:justify-start">
            <span className="text-emerald-400">✓</span> 100% Authentic Results.
            Originals never stored.
          </span>
        </div>

        {/* DESKTOP TRUST RIBBON */}
        <div className="mt-24 hidden w-full grid-cols-3 gap-4 pr-4 lg:grid">
          {trustRibbon.map((card) => (
            <GlassCard
              key={card.card_title}
              interactive
              className="flex flex-col items-center justify-center gap-1 p-4 text-center"
            >
              <div className="mb-1 text-xl">{card.card_icon}</div>
              <h3 className="text-sm font-semibold text-ink">
                {card.card_title}
              </h3>
              <span className="block text-[0.7rem] leading-tight text-ink-subtle">
                {card.card_subtitle}
              </span>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Visual proof slider */}
      <div className="flex aspect-square min-h-[350px] w-full justify-center md:min-h-[450px] lg:w-[45%] lg:justify-end">
        <ImageReveal img1={img1} img2={img2} />
      </div>

      {/* MOBILE TRUST RIBBON */}
      <div className="mt-12 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:hidden">
        {trustRibbon.map((card) => (
          <GlassCard
            key={card.card_title}
            interactive
            className="flex flex-col items-center justify-center gap-1 p-4 text-center"
          >
            <div className="mb-1 text-xl">{card.card_icon}</div>
            <h3 className="text-sm font-semibold text-ink">
              {card.card_title}
            </h3>
            <span className="block text-xs text-ink-subtle">
              {card.card_subtitle}
            </span>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
