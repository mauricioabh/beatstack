import Link from "next/link";
import { BeatStackMark } from "@/components/brand/beatstack-mark";
import { cn } from "@/lib/utils";

type BeatStackLogoProps = {
  href?: string;
  showLabel?: boolean;
  markSize?: number;
  className?: string;
  labelClassName?: string;
};

const brandLabelClass =
  "font-[family-name:var(--font-beatstack-brand)] text-center text-[0.9375rem] font-bold leading-none tracking-[-0.04em]";

export function BeatStackLogo({
  href = "/home",
  showLabel = true,
  markSize,
  className,
  labelClassName,
}: BeatStackLogoProps) {
  const resolvedMarkSize = markSize ?? (showLabel ? 40 : 36);

  const content = (
    <>
      <BeatStackMark
        size={resolvedMarkSize}
        className="shadow-sm ring-1 ring-white/10"
        idPrefix="logo"
      />
      {showLabel ? (
        <span className={cn(brandLabelClass, labelClassName)}>
          <span className="text-sidebar-foreground">Beat</span>
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
            Stack
          </span>
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return (
      <div className={cn("flex flex-col items-center gap-1.5", className)}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn("flex flex-col items-center gap-1.5", className)}
      aria-label="BeatStack home"
    >
      {content}
    </Link>
  );
}
