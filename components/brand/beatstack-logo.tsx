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

export function BeatStackLogo({
  href = "/create",
  showLabel = true,
  markSize = 36,
  className,
  labelClassName,
}: BeatStackLogoProps) {
  const content = (
    <>
      <BeatStackMark
        size={markSize}
        className="shadow-sm ring-1 ring-white/10"
        idPrefix="logo"
      />
      {showLabel ? (
        <span
          className={cn(
            "text-center text-sm font-semibold tracking-tight text-sidebar-foreground",
            labelClassName,
          )}
        >
          BeatStack
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return (
      <div className={cn("flex flex-col items-center gap-1", className)}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn("flex flex-col items-center gap-1", className)}
      aria-label="BeatStack home"
    >
      {content}
    </Link>
  );
}
