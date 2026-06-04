"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import { WorkspaceItemCard } from "@/components/library/WorkspaceItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWorkspace, type Workspace } from "@/lib/workspaces";

type WorkspaceDetailProps = {
  workspaceId: string;
};

export function WorkspaceDetail({ workspaceId }: WorkspaceDetailProps) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | undefined>();
  const [search, setSearch] = useState("");

  const refresh = useCallback(() => {
    setWorkspace(getWorkspace(workspaceId));
  }, [workspaceId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onUpdated = () => refresh();
    window.addEventListener("beatstack:workspaces-updated", onUpdated);
    return () =>
      window.removeEventListener("beatstack:workspaces-updated", onUpdated);
  }, [refresh]);

  const filteredItems = useMemo(() => {
    if (!workspace) return [];
    const q = search.trim().toLowerCase();
    if (!q) return workspace.items;
    return workspace.items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.stylePrompt.toLowerCase().includes(q),
    );
  }, [workspace, search]);

  if (!workspace) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Workspace not found.</p>
        <Link href="/library" className="mt-2 text-sm text-primary hover:underline">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-6">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/library" className="hover:text-foreground">
          Library
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <Link href="/library" className="hover:text-foreground">
          Workspaces
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="font-medium text-foreground">{workspace.name}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="min-w-0 flex-1 truncate text-2xl font-bold tracking-tight">
          {workspace.name}
        </h1>
        <Input
          type="search"
          placeholder="Search presets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
          aria-label="Search presets"
        />
        <Select defaultValue="newest" disabled>
          <SelectTrigger className="w-[120px]" aria-label="Sort order">
            <SelectValue placeholder="Newest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredItems.length === 0 ? (
        workspace.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="max-w-sm text-sm text-muted-foreground">
              No presets yet. Open Create to build a song, then save it to this
              workspace.
            </p>
            <Button
              type="button"
              onClick={() =>
                router.push(`/create?workspace=${encodeURIComponent(workspace.id)}`)
              }
            >
              <Plus className="size-4" />
              Create preset
            </Button>
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No presets match your search.
          </p>
        )
      ) : (
        <ul className="mx-auto w-full max-w-3xl space-y-2">
          {filteredItems.map((item) => (
            <WorkspaceItemCard
              key={item.id}
              workspaceId={workspace.id}
              item={item}
              onDeleted={refresh}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
