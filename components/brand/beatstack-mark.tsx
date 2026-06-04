import { cn } from "@/lib/utils";

const MARK_VIEWBOX = "0 0 32 32";

type BeatStackMarkProps = {
  className?: string;
  size?: number;
  /** Prefix for SVG gradient ids when multiple marks render on one page */
  idPrefix?: string;
};

export function BeatStackMark({
  className,
  size = 36,
  idPrefix = "beatstack",
}: BeatStackMarkProps) {
  const gradientId = `${idPrefix}-mark-gradient`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
      className={cn("shrink-0", className)}
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="6"
          y1="4"
          x2="26"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <rect
        x="7.5"
        y="17"
        width="3.5"
        height="8"
        rx="1.75"
        fill="#fff"
        fillOpacity="0.9"
      />
      <rect x="14.25" y="11" width="3.5" height="14" rx="1.75" fill="#fff" />
      <rect
        x="21"
        y="14.5"
        width="3.5"
        height="10.5"
        rx="1.75"
        fill="#fff"
        fillOpacity="0.9"
      />
      <rect
        x="6"
        y="26.25"
        width="20"
        height="2"
        rx="1"
        fill="#fff"
        fillOpacity="0.35"
      />
    </svg>
  );
}
