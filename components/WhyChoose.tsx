import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

interface WhyChooseTypes {
  id: string;
  icon: string;
  iconInfo: string;
  description: string;
}

const whyChooseData: WhyChooseTypes[] = [
  {
    id: "step1",
    icon: "✨",
    iconInfo: "Artifact-Free Preservation",
    description:
      "Unlike generic AI that hallucinates fake details, our models strictly respect the original facial structure of your ancestors.",
  },
  {
    id: "step2",
    icon: "🎨",
    iconInfo: "Historically Accurate Color",
    description:
      "Breathe vibrant, historically plausible life into black-and-white memories without unnatural or plastic-looking skin tones.",
  },
  {
    id: "step3",
    icon: "🔒",
    iconInfo: "Bank-Level Privacy",
    description:
      "Your photos are processed on encrypted servers and automatically deleted. We never claim ownership of your memories.",
  },
  {
    id: "step4",
    icon: "🩹",
    iconInfo: "Extreme Damage Recovery",
    description:
      "Advanced deep learning specifically trained to seamlessly bridge deep paper tears, water spots, and heavy mold.",
  },
];

export default function WhyChoose(): React.ReactElement {
  return (
    <section id="features" className="relative w-full px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-5xl">
        <SectionHeading
          eyebrow="Our Promise"
          title="Uncompromising Quality for Your Family Archives"
          subtitle="We combine state-of-the-art machine learning with strict historical preservation standards."
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {whyChooseData.map((data) => (
            <GlassCard
              key={data.id}
              interactive
              className="group p-8 text-start"
            >
              <div className="mb-5 origin-left text-4xl transition-transform duration-300 group-hover:scale-110">
                {data.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight text-ink">
                {data.iconInfo}
              </h3>
              <p className="leading-relaxed text-neutral-200">
                {data.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
