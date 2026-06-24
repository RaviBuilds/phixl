import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { cn } from "@/utils/cn";

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
    <section id="pricing" className="relative w-full px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Transparent Pricing"
          title="Preserve Your Memories"
          subtitle="No subscriptions. No hidden fees. Simply purchase the credits you need."
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
          {plansData.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative",
                plan.isPopular && "md:-translate-y-4",
              )}
            >
              {/* Ambient glow only behind the featured tier */}
              {plan.isPopular && (
                <AmbientGlow className="inset-x-0 top-0 mx-auto h-64 w-64 opacity-80" />
              )}

              <GlassCard
                interactive
                featured={plan.isPopular}
                className={cn(
                  "flex h-full flex-col p-8",
                  plan.isPopular && "hover:-translate-y-2",
                )}
              >
                {plan.isPopular && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-pink to-brand-rose px-4 py-1 text-sm font-semibold text-white shadow-lg">
                    Best Value
                  </div>
                )}

                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
                  {plan.planName}
                </h3>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-ink">
                    {plan.planAmount}
                  </span>
                  <span className="font-medium text-ink-subtle">one-time</span>
                </div>

                <ul className="mb-8 flex flex-1 flex-col gap-5">
                  {plan.features.map((feature) => (
                    <li
                      key={`${feature.info}-${plan.id}`}
                      className={cn(
                        "flex items-start gap-3 text-[1.05rem]",
                        feature.included ? "text-ink" : "text-ink-subtle",
                      )}
                    >
                      {feature.included ? (
                        <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
                      ) : (
                        <XCircle className="h-6 w-6 shrink-0 text-ink-subtle" />
                      )}
                      <span className="pt-0.5 leading-tight">{feature.info}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/login" className="mt-auto w-full">
                  <Button
                    variant={plan.isPopular ? "primary" : "secondary"}
                    fullWidth
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
