import { cn } from "@/utils/cn";

interface SectionProps {
  children: React.ReactNode;
  /** Optional HTML id for in-page anchors. */
  id?: string;
  /** Constrains inner content width. Defaults to the 7xl reading measure. */
  size?: "default" | "narrow" | "wide";
  className?: string;
  innerClassName?: string;
}

const widths: Record<NonNullable<SectionProps["size"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

/**
 * Section — establishes the vertical rhythm (Linear's ~96px cadence) and the
 * max-width constraint for ultrawide monitors. Every page section should be
 * wrapped in this so spacing stays consistent everywhere.
 */
export default function Section({
  children,
  id,
  size = "wide",
  className,
  innerClassName,
}: SectionProps): React.ReactElement {
  return (
    <section id={id} className={cn("relative w-full px-6 py-24 md:py-32", className)}>
      <div className={cn("mx-auto w-full", widths[size], innerClassName)}>
        {children}
      </div>
    </section>
  );
}
