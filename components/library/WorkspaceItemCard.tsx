"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { gradientStyleFromString } from "@/lib/gradient-from-string";
import { useEditorStore } from "@/lib/store";
import {
  deleteWorkspaceItem,
  type WorkspaceItem,
} from "@/lib/workspaces";

type WorkspaceItemCardProps = {
  workspaceId: string;
  item: WorkspaceItem;
  onDeleted: () => void;
};

export function WorkspaceItemCard({
  workspaceId,
  item,
  onDeleted,
}: WorkspaceItemCardProps) {
  const router = useRouter();
  const loadWorkspaceItem = useEditorStore((s) => s.loadWorkspaceItem);
  const [loading, setLoading] = useState(false);

  const preview =
    item.stylePrompt.length > 80
      ? `${item.stylePrompt.slice(0, 80)}…`
      : item.stylePrompt;

  const handleLoad = () => {
    setLoading(true);
    loadWorkspaceItem({
      nodes: item.nodeGraph.nodes,
      edges: item.nodeGraph.edges,
      lyrics: item.lyrics,
    });
    router.push("/create");
    toast.success("Loaded in editor");
    setLoading(false);
  };

  const handleDelete = () => {
    if (deleteWorkspaceItem(workspaceId, item.id)) {
      onDeleted();
      toast.success("Preset removed");
    }
  };

  return (
    <li className="group flex gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/30">
      <div
        className="size-16 shrink-0 rounded-lg"
        style={gradientStyleFromString(item.stylePrompt || item.name)}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="mt-0.5 line-clamp-2 font-mono text-xs text-muted-foreground">
          {preview || "No style prompt"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatRelativeTime(item.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleLoad}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            "Load in editor"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Delete preset"
          onClick={handleDelete}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </li>
  );
}
