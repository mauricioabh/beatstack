"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { PromptHistoryPanel } from "@/components/library/PromptHistoryPanel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type HistorySheetProps = {
  trigger: React.ReactNode;
};

export function HistorySheet({ trigger }: HistorySheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="size-4" />
            Prompt history
          </SheetTitle>
          <SheetDescription>
            Last 20 generated prompts. Click to copy.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1">
          {open ? <PromptHistoryPanel /> : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
