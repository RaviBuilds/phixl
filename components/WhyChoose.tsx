import RedLabel from "@/components/RedLabel";

interface WhyChooseTypes {
  id: string;
  icon: string;
  iconInfo: string;
  description: string;
}

// CRO UPDATE: Replaced generic SaaS features with the 4 Pillars of Historical Preservation
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
    <section id="features">
      {/* Centered with a max-width for better reading measure */}
      <div className="px-6 max-w-5xl py-15 md:py-25 mx-auto">
        <div className="mb-12! md:max-w-[800px]! block mx-auto!">
          <div className="w-full flex items-center justify-center">
            <RedLabel>Our Promise</RedLabel>
          </div>
          <h2 className="text-center text-3xl font-bold mb-4 md:text-4xl lg:text-5xl text-color-white-fresh mt-4 leading-tight">
            Uncompromising Quality for Your Family Archives
          </h2>
          <p className="text-center text-lg text-gray-400 max-w-2xl mx-auto">
            We combine state-of-the-art machine learning with strict historical
            preservation standards.
          </p>
        </div>

        <div className="pt-3">
          {/* Changed to a rigid 2-column grid for perfect balance */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {whyChooseData.map((data) => (
              <div
                className="bg-[#11182780] border border-gray-800 rounded-2xl p-8 text-start hover:border-red-brand/40 hover:-translate-y-1 transition-all duration-300 shadow-lg group"
                key={data.id}
              >
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {data.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-color-white-fresh">
                  {data.iconInfo}
                </h3>
                <p className="text-[1rem] text-gray-400 leading-relaxed">
                  {data.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
