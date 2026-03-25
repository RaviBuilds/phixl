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
      <div className="section-wrapper">
        <div className="section-heading section-heading-why">
          <span className="main-tagline mx-auto !block max-w-fit">
            Simple Pricing
          </span>
          <h2 className="section-title section-title-why ">Choose Your Plan</h2>
          <p className="section-subtitle">
            No hidden fees. No subscriptions.
            <br /> Pay only for what you use.
          </p>
        </div>
        <div className="plans-cards-wrapper">
          {plansData.map((plan) => (
            <div
              className={`${plan.planName === "Pro" ? "plans-card plans-card-popular" : "plans-card"}`}
              key={plan.id}
            >
              <h5 className="plan-highlight">{plan.planName}</h5>
              <h3 className="plan-name">
                {plan.planAmount ? plan.planAmount : plan.planName}
                <span>{plan.planAmount ? " per image" : ""}</span>
              </h3>
              <ul className="plans-feature">
                {plan.features.map((feature) => (
                  <li key={`${feature.info}-${plan.id}`}>
                    <span>{feature.icon}</span>
                    {feature.info}
                  </li>
                ))}
              </ul>
              <button className="plan-cta">{plan.buttonText}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
