import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  /** Optional trailing icon (e.g. an arrow). */
  icon?: React.ReactElement;
  fullWidth?: boolean;
}

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "px-6 py-3.5 text-base cursor-pointer transition-all duration-300 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

const variants = {
  // Sparing use of the pink→rose gradient — reserved for the primary CTA.
  primary:
    "text-white bg-gradient-to-r from-brand-pink to-brand-rose " +
    "shadow-[0_10px_30px_-10px_rgba(236,72,153,0.55)] " +
    "hover:shadow-[0_14px_40px_-8px_rgba(236,72,153,0.7)] hover:brightness-110",
  // Charcoal glass button for secondary actions.
  secondary:
    "text-ink glass hover:border-white/20 hover:bg-white/[0.06]",
};

/**
 * Button — the shared CTA primitive. Smooth background/shadow transitions on
 * hover and an accessible focus ring. Wrap in next/link for navigation.
 */
export default function Button({
  children,
  variant = "primary",
  icon,
  fullWidth = false,
  className,
  ...rest
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      {...rest}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
}
