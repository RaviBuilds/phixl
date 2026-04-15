import ImageSwiper from "@/components/ImageSwiper";
import RedBtn from "@/components/RedBtn";
import { ArrowSvg } from "@/components/Icon";
import Link from "next/link";

interface StepData {
  id: string;
  value: number;
  icon: string;
  iconInfo: string;
  description: string;
}

// CRO UPDATE: Shifting copy from "Tech Tool" to "Historical Preservation"
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
    <section id="how-it-works">
      <div className="px-6 max-w-full py-15! md:py-25! md:max-w-[724px] md:mx-auto! lg:max-w-full! text-color-white-fresh">
        <div className="mb-12!">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-4!">
            How It Works
          </h2>
          <p className="text-center text-lg text-color-gray max-w-2xl mx-auto">
            Restore your family archives in 3 simple, secure steps.
          </p>
        </div>

        <div className="grid grid-cols-1 grid-rows-[auto_auto] w-full relative gap-10 lg:gap-16 md:max-w-fit md:flex md:flex-row md:items-center md:justify-center md:mx-auto">
          {/* LEFT SIDE: The 3 Steps */}
          <div className="flex flex-col items-start justify-center w-full h-full md:justify-end md:items-end md:max-w-fit">
            <div className="grid grid-cols-1 w-full grid-rows-[auto_auto_auto] gap-5 md:max-w-fit">
              {HowItWorksData.map((data) => (
                <div
                  className="px-5 py-5 w-full bg-[#1F293780] border border-gray-800 hover:border-red-brand/40 transition-colors duration-300 rounded-2xl flex items-start justify-start gap-5 shadow-lg"
                  key={data.id}
                >
                  <div className="h-10 w-10 min-w-[40px] bg-[#ff00991c] border border-[#ff009965] text-[#ff0099] rounded-full flex items-center justify-center text-[1rem] font-bold mt-1">
                    {data.value}
                  </div>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <div className="flex flex-row items-center justify-start gap-2">
                      <span className="text-lg">{data.icon}</span>
                      <span className="text-color-white-fresh font-bold text-lg">
                        {data.iconInfo}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mt-1">
                      {data.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Slider */}
          <div className="relative w-full sm:w-[80%] md:w-[50%] aspect-[4/5] md:aspect-auto min-h-[400px] md:min-h-[500px] mx-auto rounded-2xl overflow-hidden md:max-w-[20rem] lg:max-w-[25rem] shadow-[0_0_30px_#ff009930] border-4 border-[#1a1a24]">
            <ImageSwiper />
          </div>
        </div>

        <div className="mx-auto! w-fit mt-16!">
          <Link href="/login">
            <RedBtn svgComponent={<ArrowSvg />} outlineBtn={false}>
              Restore Your First Photo Free
            </RedBtn>
          </Link>
        </div>
      </div>
    </section>
  );
}
