"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beaker } from "lucide-react";
import { BeatStackLogo } from "@/components/brand/beatstack-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { CollapsiblePanel, usePanelCollapsed } from "@/components/ui/collapsible-panel";
import { cn } from "@/lib/utils";

const NAV_SIDEBAR_COLLAPSE_KEY = "beatstack_nav_sidebar_collapsed";

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
  const collapsed = usePanelCollapsed();
  const active = item.match
    ? item.match(pathname)
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-lg py-2 text-sm font-medium transition-colors",
        collapsed ? "justify-center px-2" : "gap-2.5 px-2.5",
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
      <span className={cn(collapsed && "sr-only", "max-[899px]:sr-only")}>
        {item.label}
      </span>
    </Link>
  );
}

function SidebarHeader() {
  const collapsed = usePanelCollapsed();

  return (
    <div
      className={cn(
        "flex flex-col border-b border-sidebar-border",
        collapsed ? "items-center gap-2 p-2 pt-10" : "gap-4 p-4",
        "max-[899px]:items-center max-[899px]:gap-2 max-[899px]:p-2",
      )}
    >
      <BeatStackLogo
        showLabel={!collapsed}
        className={cn(collapsed ? "gap-0" : undefined, "max-[899px]:gap-0")}
        labelClassName={!collapsed ? "max-[899px]:sr-only" : undefined}
      />

      <div
        className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "gap-2.5",
          "max-[899px]:flex-col max-[899px]:gap-1",
        )}
      >
        <div
          className="size-9 shrink-0 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400"
          aria-hidden
        />
        <div
          className={cn(
            "min-w-0 flex-1",
            collapsed && "sr-only",
            "max-[899px]:sr-only",
          )}
        >
          <p className="truncate text-xs font-medium">Free plan</p>
          <p className="text-xs text-muted-foreground">0 credits</p>
        </div>
      </div>

      <Button
        type="button"
        variant="default"
        size="sm"
        className={cn(
          "w-full",
          collapsed && "sr-only",
          "max-[899px]:sr-only",
        )}
        disabled
        title="Coming soon"
      >
        Upgrade to Pro
      </Button>
    </div>
  );
}

function SidebarFooter() {
  const collapsed = usePanelCollapsed();

  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-t border-sidebar-border",
        collapsed ? "items-center p-2" : "p-3",
        "max-[899px]:items-center max-[899px]:p-2",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2",
          collapsed
            ? "size-8 justify-center p-0"
            : "w-full justify-start",
          "max-[899px]:size-8 max-[899px]:p-0 max-[899px]:justify-center",
        )}
        disabled
        title="Labs — coming soon"
      >
        <Beaker className="size-4 shrink-0" />
        <span className={cn(collapsed && "sr-only", "max-[899px]:sr-only")}>
          Labs
        </span>
      </Button>
      <div
        className={cn(
          "flex items-center gap-2",
          collapsed ? "justify-center px-0" : "justify-between px-1",
          "max-[899px]:justify-center",
        )}
      >
        <span
          className={cn(
            "text-xs text-muted-foreground",
            collapsed && "sr-only",
            "max-[899px]:sr-only",
          )}
        >
          Theme
        </span>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <CollapsiblePanel
      storageKey={NAV_SIDEBAR_COLLAPSE_KEY}
      ariaLabel="navigation"
      expandedClassName="w-[200px]"
      collapsedClassName="w-12"
      panelClassName="bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader />

      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <NavLink key={`${item.href}-${item.label}`} item={item} />
        ))}
      </nav>

      <SidebarFooter />
    </CollapsiblePanel>
  );
}
