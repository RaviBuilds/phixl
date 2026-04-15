import Link from "next/link";
import img1 from "@/public/img1.jpg";
import img2 from "@/public/img2.jpg";
import RedBtn from "@/components/RedBtn";
import ImageReveal from "@/components/ImageReveal";
import { ArrowSvg } from "@/components/Icon";
import RedLabel from "@/components/RedLabel";

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
    <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
      {/* LEFT COLUMN: Emotional Copy & CTA */}
      <div className="w-full lg:w-[55%] text-center lg:text-left flex flex-col items-center lg:items-start">
        <div className="flex">
          <RedLabel>Historical AI Preservation</RedLabel>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] mt-4 mb-6 text-color-white-fresh font-bold leading-[1.1]">
          Bring Your Family History{" "}
          <span className="bg-gradient-to-r from-red-brand to-color-white-fresh bg-clip-text text-transparent">
            Back to Life
          </span>
        </h1>

        <h2 className="text-gray-300 font-light mb-8 text-lg md:text-xl leading-relaxed max-w-2xl">
          Seamlessly repair tears, remove scratches, and vividly colorize faded
          black-and-white photos with artifact-free AI. Your memories, perfectly
          preserved.
        </h2>

        <div className="flex flex-col gap-4 items-center lg:items-start w-full">
          <Link href="/login" className="w-full sm:w-auto">
            <RedBtn svgComponent={<ArrowSvg />} outlineBtn={false}>
              Restore Your First Photo Free
            </RedBtn>
          </Link>

          <span className="text-sm pt-2 text-gray-400 font-medium flex items-center justify-center lg:justify-start gap-2">
            <span className="text-green-400">✓</span> 100% Authentic Results.
            Originals never stored.
          </span>
        </div>

        {/* DESKTOP TRUST RIBBON - Sleeker and pushed further down */}
        <div className="hidden lg:grid mt-24 grid-cols-3 gap-4 w-full pr-4">
          {trustRibbon.map((card) => (
            <div
              className="bg-[#0b0f19] border border-gray-800 flex flex-col rounded-xl items-center justify-center gap-1 py-3 px-3 text-center hover:border-red-brand/50 transition-all duration-300 shadow-sm"
              key={card.card_title}
            >
              <div className="text-xl mb-1">{card.card_icon}</div>
              <h3 className="text-sm font-bold text-color-white-fresh">
                {card.card_title}
              </h3>
              <span className="block text-gray-400 font-normal text-[0.7rem] leading-tight">
                {card.card_subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Visual Proof Slider */}
      <div className="w-full lg:w-[45%] flex justify-center lg:justify-end aspect-square min-h-[350px] md:min-h-[450px]">
        <ImageReveal img1={img1} img2={img2} />
      </div>

      {/* MOBILE TRUST RIBBON - Sleeker and pushed further down */}
      <div className="lg:hidden w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-12">
        {trustRibbon.map((card) => (
          <div
            className="bg-[#0b0f19] border border-gray-800 flex flex-col rounded-xl items-center justify-center gap-1 py-3 px-3 hover:border-red-brand/50 transition-all duration-300 shadow-sm"
            key={card.card_title}
          >
            <div className="text-xl mb-1">{card.card_icon}</div>
            <h3 className="text-sm font-bold text-color-white-fresh">
              {card.card_title}
            </h3>
            <span className="block text-gray-400 font-normal text-xs">
              {card.card_subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}