"use client";

import Link from "next/link";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { gradientStyleFromString } from "@/lib/gradient-from-string";
import type { Workspace } from "@/lib/workspaces";

type WorkspaceCardProps = {
  workspace: Workspace;
};

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const presetCount = workspace.items.length;

  return (
    <Link
      href={`/library/workspaces/${workspace.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
      <div
        className="aspect-[4/3] w-full"
        style={gradientStyleFromString(workspace.name)}
        aria-hidden
      />
      <div className="p-3">
        <h3 className="truncate font-semibold group-hover:text-primary">
          {workspace.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {presetCount === 1
            ? "1 preset"
            : `${presetCount} presets`}{" "}
          · {formatRelativeTime(workspace.updatedAt)}
        </p>
      </div>
    </Link>
  );
}
