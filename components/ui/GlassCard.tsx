import { cn } from "@/utils/cn";

interface GlassCardProps {
  children: React.ReactNode;
  /** Adds the hover lift + border-glow micro-interaction. */
  interactive?: boolean;
  /** Lifts the card onto surface-2 and adds a brand-tinted border (featured). */
  featured?: boolean;
  className?: string;
}

/**
 * GlassCard — the core surface primitive. Glassmorphism fill (bg-white/[0.03],
 * backdrop-blur, hairline border) with an inner top-edge highlight via the
 * `glass` utility. Optional interactive lift and featured emphasis.
 */
export default function GlassCard({
  children,
  interactive = false,
  featured = false,
  className,
}: GlassCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300 ease-out",
        interactive &&
          "hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]",
        featured && "border-brand-pink/30 bg-white/[0.05]",
        className,
      )}
    >
      {children}
    </div>
  );
}
