"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beaker } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  emoji: string;
  match?: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/create",
    label: "Home",
    emoji: "🏠",
    match: (p) => p === "/create",
  },
  {
    href: "/create",
    label: "Create",
    emoji: "✨",
    match: (p) => p === "/create",
  },
  {
    href: "/library",
    label: "Library",
    emoji: "📚",
    match: (p) =>
      p === "/library" ||
      (p.startsWith("/library/") && !p.startsWith("/library/history")),
  },
  {
    href: "/library/history",
    label: "History",
    emoji: "🎵",
    match: (p) => p === "/library/history" || p.startsWith("/library/history"),
  },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = item.match
    ? item.match(pathname)
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
        "max-[899px]:justify-center max-[899px]:px-2",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
      title={item.label}
    >
      <span className="text-base leading-none" aria-hidden>
        {item.emoji}
      </span>
      <span className="max-[899px]:sr-only">{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside
      className={cn(
        "flex w-[200px] shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground",
        "max-[899px]:w-12",
      )}
    >
      <div className="flex flex-col gap-4 border-b border-sidebar-border p-4 max-[899px]:items-center max-[899px]:p-2">
        <Link
          href="/create"
          className="flex flex-col items-center gap-1 max-[899px]:gap-0"
          aria-label="BeatStack home"
        >
          <span
            className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-bold text-white shadow-sm"
            aria-hidden
          >
            B
          </span>
          <span className="text-center text-sm font-bold tracking-tight max-[899px]:sr-only">
            BeatStack
          </span>
        </Link>

        <div className="flex items-center gap-2.5 max-[899px]:flex-col max-[899px]:gap-1">
          <div
            className="size-9 shrink-0 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400"
            aria-hidden
          />
          <div className="min-w-0 flex-1 max-[899px]:sr-only">
            <p className="truncate text-xs font-medium">Free plan</p>
            <p className="text-xs text-muted-foreground">0 credits</p>
          </div>
        </div>

        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-full max-[899px]:sr-only"
          disabled
          title="Coming soon"
        >
          Upgrade to Pro
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <NavLink key={`${item.href}-${item.label}`} item={item} />
        ))}
      </nav>

      <div className="flex flex-col gap-2 border-t border-sidebar-border p-3 max-[899px]:items-center max-[899px]:p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 max-[899px]:size-8 max-[899px]:p-0 max-[899px]:justify-center"
          disabled
          title="Labs — coming soon"
        >
          <Beaker className="size-4 shrink-0" />
          <span className="max-[899px]:sr-only">Labs</span>
        </Button>
        <div className="flex items-center justify-between gap-2 px-1 max-[899px]:justify-center">
          <span className="text-xs text-muted-foreground max-[899px]:sr-only">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
