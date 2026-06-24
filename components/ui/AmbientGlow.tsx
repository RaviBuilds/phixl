import { cn } from "@/utils/cn";

interface AmbientGlowProps {
  /** Extra positioning/size classes, e.g. "top-0 left-1/2 h-72 w-72". */
  className?: string;
}

/**
 * AmbientGlow — a soft, low-opacity brand-tinted blob placed behind a focal
 * point (hero image, pricing card). Pure CSS radial gradient + blur, marked
 * aria-hidden and pointer-events-none so it never affects layout or a11y.
 */
export default function AmbientGlow({
  className,
}: AmbientGlowProps): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className={cn("ambient-glow absolute -z-10 rounded-full", className)}
    />
  );
}
