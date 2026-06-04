"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  coverStyleFromSeed,
  getWorkspaceCoverSeed,
} from "@/lib/workspace-cover";
import type { Workspace } from "@/lib/workspaces";

type WorkspaceCoverArtProps = {
  workspace: Workspace;
  className?: string;
};

export function WorkspaceCoverArt({ workspace, className }: WorkspaceCoverArtProps) {
  if (workspace.coverImage) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image
          src={workspace.coverImage}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 200px"
          unoptimized
        />
      </div>
    );
  }

  const seed = getWorkspaceCoverSeed(workspace);

  return (
    <div
      className={cn("overflow-hidden", className)}
      style={coverStyleFromSeed(seed)}
      aria-hidden
    />
  );
}
