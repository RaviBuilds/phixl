export default function Plans(): React.ReactElement {
  const plansData = [
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
      planAmount: { amount: "$0.20", text: "per image" },
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
      planAmount: { amount: "$0.10", text: "per image" },
      features: [
        { icon: "😍", info: "Excellent Quality" },
        { icon: "👀", info: "No Watermarks" },
        { icon: "⚡️", info: "Fast Queue" },
        { icon: "💰", info: "Cheapest Option" },
      ],
      buttonText: "Get API Access",
    },
  ];
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
          <div className="plans-card">
            <h5 className="plan-highlight">Free</h5>
            <h3 className="plan-name">Free</h3>
            <ul className="plans-feature">
              <li>
                <span>🙂</span>Medium Quality
              </li>
              <li>
                <span>😞</span>Watermarks
              </li>
              <li>
                <span>⏳</span>Slow Queue
              </li>
              <li>
                <span>🔄</span>3 Free Credits
              </li>
            </ul>
            <button className="plan-cta">Start Free</button>
          </div>
          <div className="plans-card plans-card-popular">
            <h5 className="plan-highlight">Pro</h5>
            <h3 className="plan-name">
              $0.20 <span>per image</span>
            </h3>
            <ul className="plans-feature">
              <li>
                <span>😍</span>Excellent Quality
              </li>
              <li>
                <span>👀</span>No Watermkarks
              </li>
              <li>
                <span>⚡️</span>Fast Queue
              </li>
              <li>
                <span>🎯</span>Priority Support
              </li>
            </ul>
            <button className="plan-cta">Go Pro</button>
          </div>
          <div className="plans-card">
            <h5 className="plan-highlight">API</h5>
            <h3 className="plan-name">
              $0.10 <span>per image</span>
            </h3>
            <ul className="plans-feature">
              <li>
                <span>😍</span>Excellent Quality
              </li>
              <li>
                <span>👀</span>No Watermark
              </li>
              <li>
                <span>⚡️</span>Fast Queue
              </li>
              <li>
                <span>💰</span>Cheapest Option
              </li>
            </ul>
            <button className="plan-cta">Get API Access</button>
          </div>
        </div>
      </div>
    </section>
  );
}
