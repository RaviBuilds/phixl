import Eyebrow from "@/components/ui/Eyebrow";
import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}

/**
 * SectionHeading — eyebrow + display title + subtitle, with tight tracking on
 * the heading and off-white body text. Keeps every section opener identical.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps): React.ReactElement {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-5", alignment, className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-ink md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-neutral-200">
          {subtitle}
        </p>
      )}
    </div>
  );
}
