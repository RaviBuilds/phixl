import RedLabel from "@/components/RedLabel";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

interface PlanDataTypes {
  id: string;
  planName: string;
  planAmount: string;
  credits: number;
  features: { included: boolean; info: string }[];
  buttonText: string;
  isPopular?: boolean;
}

const plansData: PlanDataTypes[] = [
  {
    id: "plan-1",
    planName: "Free Trial",
    planAmount: "$0.00",
    credits: 3,
    features: [
      { included: true, info: "3 Free Generations" },
      { included: true, info: "Full AI Restoration Pipeline" },
      { included: false, info: "Artifact-Free Quality" },
      { included: false, info: "No Watermarks" },
    ],
    buttonText: "Start Restoring Free",
  },
  {
    id: "plan-2",
    planName: "Memory Saver",
    planAmount: "$2.99",
    credits: 15,
    features: [
      { included: true, info: "15 Premium Generations" },
      { included: true, info: "Full AI Restoration Pipeline" },
      { included: true, info: "Artifact-Free Quality" },
      { included: true, info: "No Watermarks" },
    ],
    buttonText: "Get 15 Credits",
  },
  {
    id: "plan-3",
    planName: "The Archive",
    planAmount: "$7.99",
    credits: 50,
    isPopular: true,
    features: [
      { included: true, info: "50 Premium Generations" },
      { included: true, info: "Full AI Restoration Pipeline" },
      { included: true, info: "Artifact-Free Quality" },
      { included: true, info: "No Watermarks" },
    ],
    buttonText: "Get 50 Credits",
  },
];

export default function Plans(): React.ReactElement {
  return (
    <section id="pricing">
      <div className="px-6 max-w-full py-15 md:py-25 md:max-w-[724px] md:mx-auto lg:max-w-6xl">
        <div className="mb-12! md:max-w-[600px]! block mx-auto!">
          <div className="w-full flex items-center justify-center">
            <RedLabel>💳 Transparent Pricing</RedLabel>
          </div>
          <h2 className="text-center text-3xl font-bold mb-4 md:text-5xl text-color-white-fresh mt-4 leading-tight">
            Preserve Your Memories
          </h2>
          <p className="text-center text-lg text-gray-400">
            No subscriptions. No hidden fees. <br className="hidden md:block" />{" "}
            Simply purchase the credits you need.
          </p>
        </div>

        {/* Changed grid to force 3 columns on large screens for perfect alignment */}
        <div className="grid w-full mx-auto grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative">
          {plansData.map((plan) => (
            <div
              className={`${
                plan.isPopular
                  ? "bg-gradient-to-br from-[#ff009928] to-[#ff009905] border-2 border-red-brand/50 rounded-3xl py-8 px-6 transition-all duration-300 ease-linear relative md:-translate-y-4 hover:-translate-y-6 shadow-[0_0_30px_#ff009920]"
                  : "bg-[#11182780] border border-gray-800 rounded-3xl py-8 px-6 transition-all duration-300 ease-linear hover:-translate-y-2"
              } flex flex-col h-full`}
              key={plan.id}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-brand to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Best Value
                </div>
              )}

              <h5 className="text-xl font-bold text-gray-400 uppercase tracking-wider mb-2">
                {plan.planName}
              </h5>

              <div className="flex items-baseline gap-1 mb-8">
                <h3 className="text-5xl font-extrabold text-color-white-fresh">
                  {plan.planAmount}
                </h3>
                <span className="text-gray-400 font-medium">one-time</span>
              </div>

              {/* Flex-1 ensures the button is always pushed to the bottom even if content varies */}
              <ul className="flex flex-col items-start justify-start gap-5 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={`${feature.info}-${plan.id}`}
                    className={`flex items-start gap-3 text-[1.05rem] ${feature.included ? "text-white" : "text-gray-500"}`}
                  >
                    {feature.included ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-600 shrink-0" />
                    )}
                    <span className="leading-tight pt-0.5">{feature.info}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login" className="w-full mt-auto">
                <button
                  className={`${
                    plan.isPopular
                      ? "bg-red-brand text-color-white-fresh hover:bg-white hover:text-red-brand shadow-lg"
                      : "bg-gray-800 text-color-white-fresh hover:bg-gray-700"
                  } block w-full text-center transition-all duration-300 ease-linear rounded-full py-3.5 text-[1.05rem] font-bold cursor-pointer`}
                >
                  {plan.buttonText}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
