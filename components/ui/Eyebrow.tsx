import { cn } from "@/utils/cn";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Eyebrow — a small, slightly positive-tracked taxonomy label that sits above
 * a section heading. Uses a restrained translucent brand tint rather than a
 * loud fill, so the pink reads as an accent, not decoration.
 */
export default function Eyebrow({
  children,
  className,
}: EyebrowProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand-pink/20 bg-brand-pink/10",
        "px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-brand-rose",
        className,
      )}
    >
      {children}
    </span>
  );
}
