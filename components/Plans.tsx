import RedLabel from "@/components/RedLabel";

interface PlanDataTypes {
  id: string;
  planName: string;
  planAmount?: string;
  features: { icon: string; info: string }[];
  buttonText: string;
}

const plansData: PlanDataTypes[] = [
  {
    id: "plan-1",
    planName: "Free",
    features: [
      { icon: "🙂", info: "Medium Quality" },
      { icon: "😞", info: "Watermarks" },
      { icon: "⏳", info: "Slow Queue" },
      { icon: "🔄", info: "3 Free Credits" },
    ],
    buttonText: "Start Free",
  },
  {
    id: "plan-2",
    planName: "Pro",
    planAmount: "$0.20",
    features: [
      { icon: "😍", info: "Excellent Quality" },
      { icon: "👀", info: "No Watermarks" },
      { icon: "⚡️", info: "Fast Queue" },
      { icon: "🎯", info: "Priority Support" },
    ],
    buttonText: "Go Pro",
  },
  {
    id: "plan-3",
    planName: "API",
    planAmount: "$0.10",
    features: [
      { icon: "😍", info: "Excellent Quality" },
      { icon: "👀", info: "No Watermarks" },
      { icon: "⚡️", info: "Fast Queue" },
      { icon: "💰", info: "Cheapest Option" },
    ],
    buttonText: "Get API Access",
  },
];
export default function Plans(): React.ReactElement {
  return (
    <section>
      <div className="px-6 max-w-full py-15 md:py-25 md:max-w-[724px] md:mx-auto lg:max-w-full">
        <div className="mb-8! md:max-w-[600px]! block mx-auto!">
          <div className="w-full flex items-center justify-center">
            <RedLabel>💳 Simple Pricing</RedLabel>
          </div>
          <h2 className="text-center text-4xl font-bold mb-4 md:text-5xl text-color-white-fresh ">
            Choose Your Plan
          </h2>
          <p className="text-center text-lg text-color-gray">
            No hidden fees. No subscriptions.
            <br /> Pay only for what you use.
          </p>
        </div>
        <div className="grid w-[90%] mx-auto grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-8 mt-20 relative">
          {plansData.map((plan) => (
            <div
              className={`${
                plan.planName === "Pro"
                  ? "bg-gradient-to-br from-[#ff009928] to-[#ff009915] border border-[#ff009946] rounded-2xl py-7 px-6 transition-all duration-300 ease-linear relative before:content-['Most_Popular'] before:absolute before:bg-color-white-fresh before:px-[12px] before:py-[5px] before:text-red-brand before:text-[0.8rem] before:font-[800] before:rounded-[1rem] before:top-0 before:-translate-y-1/2 before:right-4 hover:scale-105"
                  : "bg-[#1F293780] border border-gray-text rounded-2xl py-7 px-6 transition-all duration-300 ease-linear hover:scale-105"
              }`}
              key={plan.id}
            >
              <h5 className="text-3xl font-bold pb-2 text-color-white-fresh">
                {plan.planName}
              </h5>
              <h3 className="text-2xl font-semibold pb-5 text-color-white">
                {plan.planAmount ? plan.planAmount : plan.planName}
                <span>{plan.planAmount ? " per image" : ""}</span>
              </h3>
              <ul className="flex flex-col items-start justify-start gap-4">
                {plan.features.map((feature) => (
                  <li
                    key={`${feature.info}-${plan.id}`}
                    className="text-color-white text-[1rem]"
                  >
                    <span className="text-xl mr-3">{feature.icon}</span>
                    {feature.info}
                  </li>
                ))}
              </ul>
              <button
                className={`${plan.planName === "Pro" ? "bg-red-brand text-color-white hover:bg-color-white-fresh hover:text-red-brand" : "bg-color-gray text-color-white hover:bg-gray-500"} mt-6 block w-full text-center transition-all duration-300 ease-linear   rounded-full py-3 text-[1rem] font-bold cursor-pointer`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
