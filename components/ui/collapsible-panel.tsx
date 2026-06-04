"use client";

import { createContext, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollapsedPanel } from "@/lib/use-collapsed-panel";
import { cn } from "@/lib/utils";

const CollapsiblePanelContext = createContext(false);

export function usePanelCollapsed() {
  return useContext(CollapsiblePanelContext);
}

type CollapsiblePanelProps = {
  storageKey: string;
  ariaLabel: string;
  expandedClassName?: string;
  collapsedClassName?: string;
  panelClassName?: string;
  toggleClassName?: string;
  children: React.ReactNode;
};

export function CollapsiblePanel({
  storageKey,
  ariaLabel,
  expandedClassName = "w-[200px]",
  collapsedClassName = "w-12",
  panelClassName,
  toggleClassName,
  children,
}: CollapsiblePanelProps) {
  const { collapsed, toggle } = useCollapsedPanel(storageKey);

  return (
    <CollapsiblePanelContext.Provider value={collapsed}>
      <div className="relative flex h-full shrink-0">
        <aside
          className={cn(
            "overflow-hidden border-r transition-[width] duration-200 ease-in-out",
            collapsed ? collapsedClassName : expandedClassName,
          )}
        >
          <div
            className={cn(
              "flex h-full flex-col",
              collapsed ? collapsedClassName : expandedClassName,
              panelClassName,
            )}
          >
            {children}
          </div>
        </aside>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={cn(
            "absolute z-30 size-7 rounded-full border bg-background shadow-sm",
            collapsed
              ? "left-1/2 top-2 -translate-x-1/2"
              : "-right-3.5 top-3",
            toggleClassName,
          )}
          onClick={toggle}
          aria-label={collapsed ? `Expand ${ariaLabel}` : `Collapse ${ariaLabel}`}
          aria-expanded={!collapsed}
          title={collapsed ? `Expand ${ariaLabel}` : `Collapse ${ariaLabel}`}
        >
          {collapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ChevronLeft className="size-3.5" />
          )}
        </Button>
      </div>
    </CollapsiblePanelContext.Provider>
  );
}
