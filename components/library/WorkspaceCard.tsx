"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ImagePlus, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { WorkspaceCoverArt } from "@/components/library/WorkspaceCoverArt";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRelativeTimeCompact } from "@/lib/format-relative-time";
import { newCoverSeed } from "@/lib/workspace-cover";
import {
  setWorkspaceCover,
  type Workspace,
} from "@/lib/workspaces";

const MAX_COVER_BYTES = 400_000;

type WorkspaceCardProps = {
  workspace: Workspace;
};

function presetLabel(count: number): string {
  if (count === 1) return "1 preset";
  return `${count} presets`;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const presetCount = workspace.items.length;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);

  const openCoverEditor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCoverDialogOpen(true);
  };

  const handleRegenerate = () => {
    if (
      setWorkspaceCover(workspace.id, {
        coverSeed: newCoverSeed(),
        coverImage: null,
      })
    ) {
      toast.success("Cover updated");
      setCoverDialogOpen(false);
    }
  };

  const handleResetCover = () => {
    if (setWorkspaceCover(workspace.id, { coverSeed: "", coverImage: null })) {
      toast.success("Cover reset to auto");
      setCoverDialogOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      return;
    }
    if (file.size > MAX_COVER_BYTES) {
      toast.error("Image must be under 400 KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== "string") return;
      if (setWorkspaceCover(workspace.id, { coverImage: dataUrl })) {
        toast.success("Cover image saved");
        setCoverDialogOpen(false);
      }
    };
    reader.onerror = () => toast.error("Could not read image");
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Link
        href={`/library/workspaces/${workspace.id}`}
        className="group relative block aspect-square overflow-hidden rounded-lg border border-border/80 bg-card transition-colors hover:border-border hover:shadow-md"
      >
        <WorkspaceCoverArt workspace={workspace} className="absolute inset-0 size-full" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60"
          aria-hidden
        />

        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-start justify-between gap-1 p-1.5">
            <span
              className="rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium leading-none text-white backdrop-blur-sm"
              title={presetLabel(presetCount)}
            >
              {presetLabel(presetCount)}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="icon-xs"
              className="size-7 shrink-0 bg-black/55 text-white shadow-sm backdrop-blur-sm hover:bg-black/70 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              aria-label="Edit workspace cover"
              onClick={openCoverEditor}
            >
              <ImagePlus className="size-3.5" />
            </Button>
          </div>

          <div className="flex flex-1 items-center justify-center px-2 py-1">
            <h3
              className="line-clamp-3 text-center text-sm font-semibold leading-snug text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              title={workspace.name}
            >
              {workspace.name}
            </h3>
          </div>

          <p className="pb-2 text-center text-[10px] font-medium leading-none text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Updated {formatRelativeTimeCompact(workspace.updatedAt)}
          </p>
        </div>
      </Link>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      <Dialog open={coverDialogOpen} onOpenChange={setCoverDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Workspace cover</DialogTitle>
            <DialogDescription>
              The cover is shown on this tile. By default it is generated from
              your workspace name or the first saved preset. You can shuffle the
              artwork or upload your own image.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-lg border">
            <WorkspaceCoverArt workspace={workspace} className="size-full" />
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button type="button" className="w-full gap-2" onClick={handleRegenerate}>
              <Shuffle className="size-4" />
              Shuffle cover
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              Upload image
            </Button>
            {(workspace.coverSeed || workspace.coverImage) && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleResetCover}
              >
                Reset to auto
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
