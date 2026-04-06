import ImageSwiper from "@/components/ImageSwiper";
import RedBtn from "@/components/RedBtn";
import { ArrowSvg } from "@/components/Icon";

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
    icon: "📤",
    iconInfo: "Upload Photo",
    description: "Select any photo you want to recover.",
  },
  {
    id: "step-2",
    value: 2,
    icon: "✨",
    iconInfo: "AI Magic",
    description: "Our AI processes your image instantly.",
  },
  {
    id: "step-3",
    value: 3,
    icon: "⬇️",
    iconInfo: "Download",
    description: "Get your beautifully restored photo in high quality.",
  },
];


export default function HowItWorks(): React.ReactElement {

  
  return (
    <section>
      <div className="px-6 max-w-full py-15! md:py-25! md:max-w-[724px] md:mx-auto! lg:max-w-full! text-color-white-fresh">
        <div className="mb-8!">
          <h2 className="text-center text-3xl font-bold mb-4!">How It Works</h2>
          <p className="text-center text-lg text-color-gray">
            Restore your images in 3 simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 grid-rows-[auto_auto] w-full relative gap-7 md:max-w-fit md:flex md:flex-row md:items-center md:justify-center md:mx-auto">
          <div className="flex flex-col items-start justify-center w-full h-full md:justify-end md:items-end md:max-w-fit">
            <div className="grid grid-cols-1 w-full grid-rows-[auto_auto_auto] gap-4 md:max-w-fit">
              {HowItWorksData.map((data) => (
                <div
                  className="px-4 py-4 w-full bg-[#1F293780] border border-[#1F293780] rounded-2xl flex items-center justify-start gap-4"
                  key={data.id}
                >
                  <div className="h-9 w-9 bg-[#ff00991c] border border-[#ff009965] text-[#ff0099] rounded-full flex items-center justify-center text-sm font-bold">
                    {data.value}
                  </div>
                  <div className="flex flex-col items-start justify-center gap-2">
                    <div className="flex flex-row items-start justify-center gap-2">
                      {data.icon}{" "}
                      <span className="text-color-white-fresh font-semibold">
                        {data.iconInfo}
                      </span>
                    </div>
                    <p className="text-color-white-low">{data.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider here */}
          <div className="relative w-[50%] h-[100%] mx-auto rounded-2xl overflow-hidden md:max-w-[18rem] lg:max-w-[25rem] drop-shadow-[0px_0px_30px_#ff009950]">
            <ImageSwiper />
          </div>
        </div>
        <div className="mx-auto! w-fit mt-20!">
          <RedBtn svgComponent={<ArrowSvg />}>TryPhixl AI Now</RedBtn>
        </div>
      </div>
    </section>
  );


}


