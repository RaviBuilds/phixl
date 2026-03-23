import ImageSwiper from "@/components/ImageSwiper";
import RedBtn from "@/components/RedBtn";

interface StepData {
  id: string;
  value: number;
  icon: string;
  iconInfo: string;
  description: string;
}

export default function HowItWorks(): React.ReactElement {

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

  return (
    <section>
      <div className="section-wrapper">
        <div className="section-heading">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Restore your images in 3 simple steps
          </p>
        </div>
        <div className="section-content">
          <div className="section-info">
            <div className="section-info-container">
              {HowItWorksData.map((data) => (
                <div className="section-card" key={data.id}>
                  <div className="number-value">{data.value}</div>
                  <div className="section-card-content">
                    <div className="section-card-content-img">
                      {data.icon} <span>{data.iconInfo}</span>
                    </div>
                    <p>{data.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider here */}
          <div className="swiper-container">
            <ImageSwiper />
          </div>
        </div>
        <div className="section-button">
          <RedBtn className="max-w-fit !px-8">TryPhixl AI Now</RedBtn>
        </div>
      </div>
    </section>
  );


}


