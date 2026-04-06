import img1 from "@/public/img1.jpg";
import img2 from "@/public/img2.jpg";
import RedBtn from "@/components/RedBtn";
import ImageReveal from "@/components/ImageReveal";
import { ArrowSvg } from "@/components/Icon";
import { RocketSVG } from "@/components/Icon";
import { DownArrow } from "@/components/Icon";
import RedLabel from "@/components/RedLabel";
interface cardHeaderData {
  card_icon: string;
  card_title: string;
  card_subtitle: string;
}

type cardHeaderType = cardHeaderData[];

export default function Banner(): React.ReactElement {
  const cardHeader: cardHeaderType = [
    {
      card_icon: "👥",
      card_title: "+ 10K",
      card_subtitle: "Users",
    },
    {
      card_icon: "🖼️",
      card_title: "+ 450K",
      card_subtitle: "Images",
    },
    {
      card_icon: "⚡",
      card_title: "99.9%",
      card_subtitle: "Uptime",
    },
  ];

  return (
    <section className="flex flex-col items-center bg-black-background py-12! gap-2 md:grid md:grid-cols-[70%_30%] md:grid-rows-[auto_auto] md:px-0! md:max-w-[724px] md:mx-auto! lg:grid-cols-2 lg:bg-transparent lg:max-w-full lg:px-6!">
      <div className="text-center max-w-[600px] md:max-w-[100%] md:text-start px-6! md:px-0!">
        <RedLabel>✨ AI-Powered Technology</RedLabel>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6! text-color-white-fresh font-bold">
          Restore images with
          <span className="bg-gradient-to-r from-red-brand to-color-white-fresh bg-clip-text text-transparent">
            Phixl AI
          </span>
        </h1>
        <p className="text-gray-300 font-light mb-6! text-lg">
          Experience the future of restore images with our advanced restore AI
          technology.
        </p>
        <div className="flex flex-col gap-5! md:flex-row items-center justify-center md:items-start md:justify-between">
          <div className="flex flex-col gap-2 w-full">
            <RedBtn svgComponent=<ArrowSvg /> outlineBtn={false}>
              Restore Now
            </RedBtn>

            <span className="text-sm pt-2! text-gray-400">
              ✨ 3 free images included
            </span>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <RedBtn svgComponent=<RocketSVG /> outlineBtn={true}>
              View Plans
            </RedBtn>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <RedBtn svgComponent=<DownArrow /> outlineBtn={true}>
              Learn More
            </RedBtn>
          </div>
        </div>
        <div className="hidden lg:block  mt-10! pb-10! lg:grid grid-cols-3 grid-rows-1 gap-6 w-full mt-3!  md:pb-0!">
          {cardHeader.map((card) => (
            <div
              className="bg-blue-low-200 border border-solid border-gray-text flex flex-col rounded-2xl items-center justify-center gap-1 py-3! lg:py-4! hover:bg-[radial-gradient(circle_at_50%_50%,_#ff009911,_#9b89b333)] transition-all duration-300"
              key={card.card_title}
            >
              <div className="text-2xl">{card.card_icon}</div>
              <h5 className="text-xl font-bold text-color-white-fresh">
                {card.card_title}
              </h5>
              <span className="block text-gray-400 font-normal text-sm">
                {card.card_subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ImageReveal img1={img1} img2={img2} />

      <div className="lg:hidden bg-gradient-to-b from-[#050a14] to-[#ff009915] mt-10! pb-10! grid grid-cols-1 grid-rows-3 gap-6 w-full px-6! md:mt-3! md:bg-none md:grid-cols-3 md:grid-rows-1 md:pb-0!;">
        {cardHeader.map((card) => (
          <div
            className="bg-blue-low-200 border border-solid border-gray-text flex flex-col rounded-2xl items-center justify-center gap-1 py-3! lg:py-4! hover:bg-[radial-gradient(circle_at_50%_50%,_#ff009911,_#9b89b333)] transition-all duration-300"
            key={card.card_title}
          >
            <div className="text-2xl">{card.card_icon}</div>
            <h5 className="text-xl font-bold color-white-fresh">
              {card.card_title}
            </h5>
            <span className="block text-gray-400 font-normal text-sm">
              {card.card_subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
